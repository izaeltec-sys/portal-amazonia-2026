# Central do Atleta

A pasta `central/` contém a página auxiliar de informações da 3ª Corrida de Rua Portal da Amazônia — 2026.

## Objetivo

Concentrar em um único endereço:

- acesso ao Regulamento oficial;
- avisos e atualizações;
- programação;
- informações de inscrição;
- retirada de kits;
- Corrida Kids;
- dúvidas frequentes;
- canais oficiais.

O Regulamento continua sendo a fonte normativa. A Central funciona como camada de consulta rápida e comunicação operacional.

## Avisos

Os comunicados são mantidos em `central/data/avisos.json`.

Tipos permitidos:

- `informacao`: explica ou destaca algo que já está oficialmente definido;
- `aviso`: orientação operacional que não altera o conteúdo do Regulamento;
- `alteracao`: Errata, Adendo ou alteração formal do Regulamento.

Estrutura de cada item:

```json
{
  "id": "2026-09-01-exemplo",
  "data": "2026-09-01",
  "tipo": "aviso",
  "titulo": "Título objetivo",
  "resumo": "Descrição curta do comunicado.",
  "link": "../index.html#secao",
  "rotuloLink": "Ver detalhes",
  "destaque": false
}
```

## Regra editorial

Um aviso operacional não deve ser usado para alterar regra já publicada no Regulamento.

Quando o conteúdo modificar regra oficial, prazo, direito, obrigação, categoria, valor, condição de participação ou outro ponto normativo, a alteração deve primeiro ser formalizada no Regulamento como Errata, Adendo ou nova versão e registrada no Histórico de Alterações. Depois disso, a Central pode publicar o respectivo comunicado do tipo `alteracao`.

## Página principal existente

O arquivo `/index.html` continua sendo o Regulamento oficial e não foi movido nesta implementação. A Central fica em `/central/`, evitando quebrar links já divulgados.
