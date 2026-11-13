#!/usr/bin/env python3
"""Sincroniza inscrições públicas do RaceTagPro com complemento opcional da Agito.

Fonte autoritativa para nome COMPLETO, sexo, categoria, número e município:
  RaceTagPro — data/105VZVH/event.json e results.json (publicados no site oficial).
Origem complementar para equipe/UF: listagem pública Agito, apenas em associação
inequívoca por primeiro nome, grupo, faixa e município. Não tenta associar registros
ambíguos nem deduz sexo pelo nome.

Não replica IDs internos, contato, CPF, aniversário, fotos, posições ou resultados.
Falhas de validação preservam integralmente o último snapshot.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

AGITO_API = "https://agitoesportes.com.br/api"
SLUG = "3-corrida-de-rua-portal-da-amazonia"
AGITO_EVENT_ID = "6162cb4f-b415-4670-98ac-18f316a3e941"
RACETAG_EVENT_ID = "105VZVH"
RACETAG_BASE = "https://old.agitoesportes.com.br/racetagpro/data"
DEST = Path(__file__).resolve().parents[1] / "central" / "inscritos" / "dados.json"
DATE_LIMIT = dt.date(2026, 11, 17)
PAGE_SIZE = 100
MAX_PAGES = 60

HEADERS = {
    "Accept": "application/json,text/plain,*/*",
    "User-Agent": "Mozilla/5.0 (compatible; PortalAmazonia2026/1.0; public-race-list-sync)",
    "Referer": "https://old.agitoesportes.com.br/"
}

def load(url: str, expected: type):
    last = None
    for attempt in range(4):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=25) as response:
                if response.status != 200 or "json" not in response.headers.get("Content-Type", ""):
                    raise ValueError("Resposta não JSON ou HTTP inesperado")
                result = json.load(response)
                if not isinstance(result, expected):
                    raise ValueError("Formato inesperado")
                return result
        except (HTTPError, URLError, OSError, TimeoutError, ValueError) as exc:
            last = exc
            if attempt < 3:
                time.sleep(1 + attempt * 2)
    raise RuntimeError(f"Consulta pública indisponível: {type(last).__name__}") from last

def clean(v, limit=105):
    if not isinstance(v, str):
        return ""
    v = unicodedata.normalize("NFC", v)
    v = re.sub(r"[\x00-\x1f\x7f-\x9f]", " ", v)
    return re.sub(r"\s+", " ", v).strip()[:limit]

def norm(v):
    v = unicodedata.normalize("NFD", clean(v, 150).upper())
    v = "".join(c for c in v if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", v).strip()

def group(route):
    if route == "5KM": return "5KM"
    if route == "PCD": return "PCD"
    if route == "ESCOLAR": return "ESCOLAR"
    if re.fullmatch(r"KIDS \d+ A \d+ ANOS", route): return "KIDS"
    raise ValueError(f"Modalidade inesperada: {route}")

def faixa(grupo, category):
    if grupo in ("PCD", "ESCOLAR"): return "Geral"
    match = re.fullmatch(r"[FM]-(\d+)-(\d+)", category)
    if not match:
        raise ValueError(f"Faixa desconhecida: {category}")
    lower, upper = map(int, match.groups())
    if grupo == "5KM":
        return "Geral" if (lower, upper) == (14, 99) else (
            "60+" if (lower, upper) == (60, 99) else f"{lower}-{upper}"
        )
    if grupo == "KIDS":
        if (lower, upper) not in {(1, 3), (4, 6), (7, 9), (10, 11), (12, 13)}:
            raise ValueError(f"Faixa Kids inesperada: {category}")
        return f"{lower}-{upper}"
    raise ValueError("Grupo inválido")

def race_rows():
    event = load(f"{RACETAG_BASE}/{RACETAG_EVENT_ID}/event.json", dict)
    results = load(f"{RACETAG_BASE}/{RACETAG_EVENT_ID}/results.json", list)
    if event.get("id") != RACETAG_EVENT_ID or not 100 <= len(results) <= 20000:
        raise ValueError("Evento RaceTagPro incorreto ou lista vazia")
    routes = {x["i"]: x["n"] for x in event.get("routes", [])}
    categories = {x["i"]: x for x in event.get("categories", [])}
    municipalities = {
        (x["i"], x["r"], x["g"]): x["n"]
        for x in event.get("teams", [])
    }
    if len(routes) < 8 or len(categories) < 25 or len(municipalities) < 30:
        raise ValueError("Metadados RaceTagPro incompletos")

    rows = []
    seen_numbers = set()
    for result in results:
        if not isinstance(result, dict):
            raise ValueError("Registro RaceTagPro malformado")
        bib = result.get("n")
        gender = result.get("g")
        cid = result.get("c")
        rid = result.get("r")
        tid = result.get("t")
        if not isinstance(bib, int) or bib <= 0 or bib in seen_numbers:
            raise ValueError("Número de peito inválido ou duplicado")
        seen_numbers.add(bib)
        if gender not in ("F", "M") or rid not in routes or cid not in categories:
            raise ValueError("Sexo, modalidade ou categoria não identificados")
        meta = categories[cid]
        if meta.get("g") != gender:
            raise ValueError("Sexo divergente entre atleta e categoria")
        category = clean(meta.get("n"), 50)
        name = clean(result.get("nm"), 130)
        municipality = clean(municipalities.get((tid, rid, gender)), 65)
        if not name or " " not in name or not municipality:
            raise ValueError("Nome completo ou município ausente")
        g = group(routes[rid])
        row = {
            "nome": name,
            "grupo": g,
            "categoria": category,
            "faixa": faixa(g, category),
            "naipe": "Feminino" if gender == "F" else "Masculino",
            "cidade": municipality.title(),  # Somente para exibição; correspondência usa norm().
            "uf": "",
            "equipe": "",
            "sem_nome": False,
            "numero": bib
        }
        rows.append(row)
    return rows

def agito_rows():
    all_rows = []
    total = None
    for page in range(1, MAX_PAGES + 1):
        query = urlencode({"search_term": "", "page": page, "limit": PAGE_SIZE})
        data = load(f"{AGITO_API}/inscriptions/{SLUG}/public-list?{query}", dict)
        if not isinstance(data.get("event"), dict) or data["event"].get("id") != AGITO_EVENT_ID:
            raise ValueError("Evento complementar divergente")
        count = data.get("registers")
        if not isinstance(count, int) or count < 1 or count > 20000:
            raise ValueError("Quantidade complementar inválida")
        if total is None: total = count
        if count != total: raise ValueError("Quantidade complementar mudou durante coleta")
        batch = data.get("inscriptions")
        if not isinstance(batch, list) or len(batch) > PAGE_SIZE:
            raise ValueError("Página complementar inválida")
        for record in batch:
            members = record.get("members")
            category = record.get("category", {})
            if not isinstance(members, list) or len(members) != 1 or not isinstance(category, dict):
                raise ValueError("Registro complementar inválido")
            m = members[0]
            if not isinstance(m, dict) or record.get("status") != "confirmed":
                raise ValueError("Inscrição complementar inválida")
            cat = clean(category.get("name"), 50).upper()
            if cat == "ESCOLAR": grupo, age = "ESCOLAR", "Geral"
            elif cat.startswith("PCD"): grupo, age = "PCD", "Geral"
            elif cat.startswith("KIDS "): grupo, age = "KIDS", cat[5:]
            elif cat.startswith("5KM "): grupo, age = "5KM", "Geral"
            elif re.fullmatch(r"\d{2}-\d{2}|\d{2}\+", cat):
                grupo, age = "5KM", cat
            else: raise ValueError(f"Categoria complementar desconhecida: {cat}")
            all_rows.append({
                "primeiro": norm(m.get("name")).split(" ")[0],
                "grupo": grupo, "faixa": age,
                "cidade": norm(m.get("city")),
                "uf": clean(m.get("uf"), 2).upper(),
                "equipe": clean(m.get("team"), 90)
            })
        if len(all_rows) >= total: break
        if not batch: raise ValueError("Paginação complementar incompleta")
        time.sleep(0.1)
    if len(all_rows) != total: raise ValueError("Coleta complementar parcial")
    return all_rows

def enrich(rows, source):
    """Atribui equipe/UF somente em chaves 1:1; nunca associa primeiro nome ambíguo."""
    primary = defaultdict(list)
    other = defaultdict(list)
    for row in rows:
        key = (norm(row["nome"]).split(" ")[0], row["grupo"], row["faixa"], norm(row["cidade"]))
        primary[key].append(row)
    for row in source:
        key = (row["primeiro"], row["grupo"], row["faixa"], row["cidade"])
        other[key].append(row)
    matched = 0
    for key, target in primary.items():
        if len(target) != 1 or len(other[key]) != 1:
            continue
        supplement = other[key][0]
        target[0]["equipe"] = supplement["equipe"]
        target[0]["uf"] = supplement["uf"]
        matched += 1
    return matched

def build():
    rows = race_rows()
    # Complemento opcional; a lista principal RaceTagPro continua funcional
    # mesmo se a Agito mudar a API ou temporariamente bloquear consultas.
    matched = 0
    try:
        extra = agito_rows()
        if len(extra) == len(rows):
            matched = enrich(rows, extra)
        else:
            print("Aviso: totais das fontes divergem; complemento ignorado.", file=sys.stderr)
    except (ValueError, RuntimeError) as exc:
        print(f"Aviso: complemento de equipes indisponível: {exc}", file=sys.stderr)
    counts = Counter(r["grupo"] for r in rows)
    if set(counts) != {"5KM", "PCD", "KIDS", "ESCOLAR"}:
        raise ValueError(f"Grupos inesperados: {counts}")
    sexes = Counter(r["naipe"] for r in rows)
    if sum(sexes.values()) != len(rows) or not {"Feminino", "Masculino"} <= set(sexes):
        raise ValueError("Sexo individual incompleto")
    rows.sort(key=lambda r: (r["grupo"], r["faixa"], norm(r["nome"]), r["numero"]))
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    print(f"RaceTagPro {len(rows)} registros, {dict(sexes)}, complemento inequívoco {matched}.")
    return {
        "versao": 3,
        "atualizado_em": now,
        "origem": "RaceTagPro — listagem pública da Agito Esportes",
        "fonte": "https://old.agitoesportes.com.br/racetagpro/#/3-corrida-de-rua-portal-da-amazonia",
        "fonte_complementar": "https://agitoesportes.com.br/event/3-corrida-de-rua-portal-da-amazonia/inscriptions",
        "total": len(rows),
        "sem_nome": 0,
        "totais_por_grupo": {g: counts[g] for g in ("5KM", "PCD", "KIDS", "ESCOLAR")},
        "totais_por_sexo": {g: sexes[g] for g in ("Feminino", "Masculino")},
        "aviso_escolar": "Escolar disputa 5 km conforme Regulamento 1.3; RaceTagPro confirma 5 km.",
        "inscritos": rows
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Permite atualização após prazo")
    parser.add_argument("--dest", type=Path, default=DEST)
    args = parser.parse_args()
    if dt.datetime.now(dt.timezone.utc).date() > DATE_LIMIT and not args.force:
        print("Evento encerrado: sincronização automática desativada.")
        return
    result = build()
    args.dest.parent.mkdir(parents=True, exist_ok=True)
    temp = args.dest.with_suffix(".tmp")
    temp.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    temp.replace(args.dest)
    print("Snapshot validado", result["total"], result["totais_por_grupo"], result["totais_por_sexo"])

if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print(f"Sincronização falhou; último snapshot preservado: {exc}", file=sys.stderr)
        raise SystemExit(1)
