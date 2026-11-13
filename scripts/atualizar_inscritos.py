#!/usr/bin/env python3
"""Sincroniza SOMENTE campos já publicados na listagem pública da Agito.
Sem autenticação; não copia CPF, data de nascimento, user_id, contato ou fotos.
Fonte não documentada: trate alterações/indisponibilidade como erro sem sobrescrever a última cópia válida.
"""
from __future__ import annotations
import argparse
import datetime as dt
import json
import re
import sys
import time
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API = "https://agitoesportes.com.br/api"
SLUG = "3-corrida-de-rua-portal-da-amazonia"
EVENT_ID = "6162cb4f-b415-4670-98ac-18f316a3e941"
DEST = Path(__file__).resolve().parents[1] / "central" / "inscritos" / "dados.json"
DATE_LIMIT = dt.date(2026, 11, 17)
PAGE_SIZE = 100
MAX_PAGES = 60
HEADERS = {"Accept": "application/json", "User-Agent": "PortalAmazonia2026-CentralAtleta/1.0 (sync de listagem publica)"}

def load(url: str) -> dict:
    last = None
    for attempt in range(4):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=25) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}")
                if not response.headers.get("Content-Type", "").startswith("application/json"):
                    raise ValueError("Conteúdo inesperado (não JSON)")
                result = json.load(response)
                if not isinstance(result, dict):
                    raise ValueError("Objeto JSON esperado")
                return result
        except (HTTPError, URLError, OSError, TimeoutError, ValueError) as exc:
            last = exc
            if attempt < 3:
                time.sleep(1 + attempt * 2)
    raise RuntimeError(f"Agito indisponível: {type(last).__name__}") from last

def clean(value, max_len: int = 100) -> str:
    if not isinstance(value, str):
        return ""
    value = unicodedata.normalize("NFC", value)
    value = re.sub(r"[\x00-\x1f\x7f-\x9f]", " ", value)
    return re.sub(r"\s+", " ", value).strip()[:max_len]

def group(category: str) -> str:
    upper = category.upper()
    if upper.startswith("KIDS"): return "KIDS"
    if upper.startswith("PCD"): return "PCD"
    if upper == "ESCOLAR": return "ESCOLAR"
    if upper.startswith("5KM ") or re.fullmatch(r"\d{2}(?:\+|-\d{2})", upper):
        return "ADULTO"
    raise ValueError(f"Categoria nova/desconhecida: {category!r}; revisar mapeamento antes de publicar")

def naipe(category: str, category_info: dict) -> str:
    label = clean(category_info.get("gender_type"), 30).upper()
    if label == "FEMININO": return "Feminino"
    if label == "MASCULINO": return "Masculino"
    # Não deduzir sexo por nome nem por faixa etária "Misto".
    return "Não informado"

def build() -> dict:
    metadata = load(f"{API}/categories/{EVENT_ID}/list")
    cat_list = metadata.get("categories")
    if not isinstance(cat_list, list) or len(cat_list) < 10:
        raise ValueError("Lista de categorias inesperada")
    by_id = {c.get("id"): c for c in cat_list if isinstance(c, dict)}
    total = None
    rows = []
    event_id = None
    for page in range(1, MAX_PAGES + 1):
        params = urlencode({"search_term": "", "page": page, "limit": PAGE_SIZE})
        data = load(f"{API}/inscriptions/{SLUG}/public-list?{params}")
        if not isinstance(data.get("event"), dict) or data["event"].get("id") != EVENT_ID:
            raise ValueError("Evento retornado não corresponde à Corrida Portal da Amazônia")
        count = data.get("registers")
        if not isinstance(count, int) or count < 1 or count > 20000:
            raise ValueError("Contagem inválida")
        if total is None: total = count
        if count != total: raise ValueError("Total mudou durante paginação; repetir sincronização")
        batch = data.get("inscriptions")
        if not isinstance(batch, list) or len(batch) > PAGE_SIZE:
            raise ValueError("Página inválida")
        for ins in batch:
            if not isinstance(ins, dict) or not isinstance(ins.get("category"), dict):
                raise ValueError("Inscrição sem categoria")
            cat = ins["category"]
            category = clean(cat.get("name"), 75)
            meta = by_id.get(cat.get("id"), {})
            if not category or not meta or clean(meta.get("name")) != category:
                raise ValueError("Categoria divergente da lista pública")
            members = ins.get("members")
            if not isinstance(members, list) or len(members) != 1:
                raise ValueError("Inscrição com estrutura inesperada de membros")
            member = members[0]
            if not isinstance(member, dict):
                raise ValueError("Dados de atleta inesperados")
            if clean(ins.get("status"), 30).lower() != "confirmed":
                raise ValueError("Inscrição não confirmada em listagem pública; revisar política de exibição")
            name = clean(member.get("name"), 105)
            item = {
                "nome": name if name else "Nome não informado pela Agito",
                "grupo": group(category),
                "categoria": category,
                "naipe": naipe(category, meta),
                "cidade": clean(member.get("city"), 65),
                "uf": clean(member.get("uf"), 2).upper(),
                "equipe": clean(member.get("team"), 90),
                "sem_nome": not bool(name)
            }
            rows.append(item)
        if len(rows) >= total: break
        if not batch: raise ValueError("Paginação terminou antes do total esperado")
        time.sleep(0.2)
    if len(rows) != total:
        raise ValueError(f"Incompleto: {len(rows)} de {total} registros. Preservando dado anterior.")
    counts = Counter(r["grupo"] for r in rows)
    if set(counts) != {"ADULTO", "ESCOLAR", "PCD", "KIDS"}:
        raise ValueError(f"Grupos esperados ausentes: {dict(counts)}")
    rows.sort(key=lambda r: (r["grupo"], r["categoria"], r["nome"].casefold()))
    return {
        "versao": 1,
        "atualizado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "origem": "Lista pública de inscrições — Agito Esportes",
        "fonte": "https://agitoesportes.com.br/event/3-corrida-de-rua-portal-da-amazonia/inscriptions",
        "total": len(rows),
        "sem_nome": sum(r["sem_nome"] for r in rows),
        "totais_por_grupo": {g: counts[g] for g in ("ADULTO", "ESCOLAR", "PCD", "KIDS")},
        "aviso_escolar": "A categoria Escolar disputa 5 km, conforme o Regulamento oficial 1.3 (capítulo 5). O cadastro técnico da Agito indica incorretamente 1 km.",
        "inscritos": rows
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Permite atualização depois da data limite")
    parser.add_argument("--dest", type=Path, default=DEST)
    args = parser.parse_args()
    if dt.datetime.now(dt.timezone.utc).date() > DATE_LIMIT and not args.force:
        print("Evento encerrado: sincronização automática desativada.")
        return
    result = build()
    dest = args.dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".tmp")
    tmp.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    tmp.replace(dest)
    print("Snapshot validado:", result["total"], "registros", result["totais_por_grupo"], "sem nome:", result["sem_nome"])

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Falha de sincronização; último snapshot preservado: {exc}", file=sys.stderr)
        raise SystemExit(1)
