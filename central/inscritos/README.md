# Inscritos e Estatísticas — Central do Atleta

Módulo leve, sem serviços de mapa, banco de dados ou dependências JavaScript externas.

## Como funciona

- Página: /central/inscritos/
- Frontend responsivo: index.html e dashboard.js
- Snapshot JSON sanitizado: dados.json
- Extração validada: scripts/atualizar_inscritos.py
- Sincronização automática: .github/workflows/atualizar-inscritos.yml
- Fonte pública: https://agitoesportes.com.br/event/3-corrida-de-rua-portal-da-amazonia/inscriptions

A API pública da Agito possui bloqueio CORS para outros domínios. Por isso, o navegador **não** consulta a API diretamente. O GitHub Actions faz a consulta server-side, valida paginação e evento, remove campos não utilizados e publica somente um JSON estático no repositório. O frontend consulta primeiro o JSON público em raw.githubusercontent.com (CORS liberado; cache de aproximadamente 5 minutos) e usa a cópia do GitHub Pages como fallback. Isso evita depender de um novo build do Pages a cada commit do GITHUB_TOKEN.

Atualização programada: uma vez por hora (cron às XX:23), até 17/11/2026 UTC inclusive. Após essa data, o script não consulta mais a Agito sem a opção --force. O agendamento do GitHub não é pontual e pode atrasar; a Central exibe a data do último snapshot bem-sucedido.

Se a API ficar indisponível, a consulta falha com código de erro e não substitui o último snapshot válido. Se a estrutura mudar, a automação também falha explicitamente, sem inferir novos dados.

**Observação:** o serviço consultado é público, mas não há contrato de API documentado. A continuidade da sincronização depende de a Agito manter o endpoint e permitir seu uso.

## Categorias oficiais

Quatro grupos de destaque:

- ADULTO — 5 km, com subdivisões originais de faixa etária.
- ESCOLAR — 5 km.
- PCD — 5 km.
- KIDS — distâncias de acordo com faixa etária.

A categoria Escolar aparece com distância 1 km no cadastro técnico da Agito; o capítulo 5 do Regulamento oficial 1.3 confirma a distância correta de **5 km**. Nossa página usa o Regulamento para esse rótulo, preservando ESCOLAR como categoria original da inscrição. A Agito deve corrigir o cadastro, mas não alteramos registros de terceiros.

Múltiplas faixas etárias adultas estão marcadas gender_type: Misto pela API. **Não inferimos sexo pelo nome**: o filtro Masculino/Feminino só é usado para inscrições cujo cadastro de categoria identifica explicitamente esse naipe; as demais ficam com "Não informado".

A categoria técnica ESCOLAR e o grupo KIDS são separados, ainda que ambos possam incluir menores.

## Contagem de referência na implantação

Primeiro snapshot: **895 inscrições confirmadas**:
- Adulto: 794
- Escolar: 29
- PCD: 9
- Kids: 63
- Nomes indisponíveis na origem: 2 registros, preservados nas contagens.

Essas contagens são dados da consulta inicial, não valores fixados no frontend. A página lê os totais e linhas do dados.json a cada abertura.

## Privacidade e minimização

A Agito expõe publicamente, para cada participante, nome, cidade, UF, equipe e categoria. A Organização solicitou manter os nomes de atletas Kids/Escolar na Central para permitir verificação por responsáveis.

**O dashboard republica uma seleção desses dados** no site da Central, não é mera consulta local. Foram excluídos identificadores internos da Agito, user_id, IDs de inscrição, responsible, fotos, CPF, nascimento, endereço, email, telefone e datas de inscrição. Não há upload, autenticação nem armazenamento de pesquisas no navegador.

Considerar a adequação da divulgação dos nomes de menores e da categoria PCD à LGPD e às condições da Agito. Se necessário, retirar a listagem nominal de menores, mantendo estatísticas agregadas; esse ponto deve ser tratado com a organização responsável.

Não usar esses dados para envio comercial, campanhas direcionadas ou correlação de perfis.

## Operação

Para atualizar manualmente em ambiente com Python 3.12+ e rede:
python scripts/atualizar_inscritos.py

Para consultar após o prazo programado:
python scripts/atualizar_inscritos.py --force

Para iniciar o workflow após o merge na main: GitHub → Actions → **Atualizar inscritos da Agito** → Run workflow.

Para parar a atualização automática, remover a configuração schedule da rotina ou desabilitar o workflow em Actions.

Publicação GitHub Pages: merge na main; conferir /central/inscritos/ e os links em /central/. O fluxo usa permissões contents: write para que o bot faça commits de dados. Se a configuração de segurança do repositório bloquear a escrita do GITHUB_TOKEN, a página seguirá com o snapshot inicial até ajuste autorizado.

Validar layout e acessibilidade no celular, buscas com acentos, contagens e resposta de erro antes de divulgar o recurso.

---

## Revisão do painel — 12/11/2026 (v2)

A Organização pediu filtros **em etapas**, sem misturar as categorias técnicas da Agito:

1. Grupo principal: **5 KM, PCD, KIDS, ESCOLAR**. A antiga chave `ADULTO` passa a `5KM` no JSON v2. As opções da Agito `5KM FEMININO` e `5KM MASCULINO` integram o grupo **5 KM**; não são faixas etárias.
2. Sexo: **Todos, Masculino, Feminino, Não informado**. Sem inferências por nomes. No primeiro snapshot de 895 inscrições, o grupo 5 KM tem **794**, dos quais 40 masculinos declarados, 49 femininos declarados e **705 sem informação** porque as demais categorias têm `gender_type: Misto`. Não interpretar ausência de informação como categoria competitiva ou sexo.
3. Faixa etária: selecionada após grupo e sexo, com opções derivadas de `faixa` normalizada; para 5 KM MASCULINO/FEMININO, a faixa técnica é **Geral (sem faixa)**; para KIDS, as faixas são 1-3, 4-6, 7-9, 10-11 e 12-13; Escolar/PCD sem divisão de faixas na listagem pública.
4. Cidade, equipe e nome são filtros auxiliares; os gráficos e contagens acompanham os filtros.

Frontend redesenhado como dashboard mobile-first, com gráfico de distribuição por grupo, indicadores de participantes, municípios/equipes, gráficos por faixa e lista nominal. Mantido o princípio de não recriar logotipos oficiais.

**Termo de menores:** existe no Regulamento oficial em `/index.html#termo`. Criados atalhos na home da Central, no menu Evento, na FAQ e na página de inscritos. Aplica-se a atletas **de 14 a 17 anos inscritos nos 5 km**, **não** aos participantes da Corrida Kids. O formulário permanece o original do Regulamento.

A API de listagem pública só retorna os campos de membros `user_id`, `responsible`, `name`, `city`, `uf`, `team` e `has_photo`: **não há sexo individual** nos registros de faixas mistas. Para dividir integralmente masculino/feminino, é necessário um export autorizado da empresa com essa coluna e avaliação da base legal; não é possível obter separação real somente dessa API pública.

O JSON agora usa `versao:2`, chave `faixa` e grupo `5KM`. A sincronização via GitHub Actions foi adaptada para esse esquema. Não publicar HTML v2 com JSON v1 de forma isolada. Testar a atualização horária e o PWA após o merge.

---

## Atualização RaceTagPro — 12/11/2026

A Organização identificou que o RaceTagPro publica a relação completa dos atletas por **Feminino** e **Masculino**, inclusive por faixa etária. A aplicação usa dados JSON estáticos públicos:

- `https://old.agitoesportes.com.br/racetagpro/data/events.json` — identificador do evento `105VZVH`;
- `https://old.agitoesportes.com.br/racetagpro/data/105VZVH/event.json` — rotas, categorias, sexo e municípios;
- `https://old.agitoesportes.com.br/racetagpro/data/105VZVH/results.json` — nomes completos, número de peito, categoria, modalidade e sexo (campo `g`).

**Verificação:** 895 atletas, todos com nome completo, número único e sexo informado: **514 femininos / 381 masculinos**; nos 5 KM, **473 femininos / 321 masculinos**. Os grupos totalizam **5 KM 794, PCD 9, KIDS 63, ESCOLAR 29**. O RaceTagPro confirma a modalidade Escolar como **5 km**.

O snapshot foi atualizado para **`versao:3`**, preservando o esquema das quatro categorias, mais `numero` (número de peito). Sexo e faixas agora vêm diretamente das categorias e do registro de cada atleta da RaceTagPro. Sem inferência por nome.

**Complemento da API nova da Agito:** o endpoint `public-list` retorna em muitos registros apenas o primeiro nome, porém possui informação de equipe e UF. Para não associar pessoas erroneamente, o sincronizador somente complementa `equipe` e `uf` quando a combinação **primeiro nome normalizado + grupo + faixa + município** é única nas DUAS bases. Em associação ambígua, equipe/UF permanecem vazias. Na coleta inicial foram 674 associações inequívocas, com 341 equipes não vazias. Não misturar identificadores internos entre fornecedores.

A interface agora oferece filtros completos **Todos / Masculino / Feminino** em todos os grupos; foi removida a opção "Não informado", que só refletia a limitação da API nova. As fontes estão creditadas no painel. A rotina horária lê RaceTagPro primeiro; se o complemento Agito não responder, mantém os dados principais do RaceTagPro. Se o RaceTagPro falhar, não sobrescreve o snapshot anterior.

**ATENÇÃO:** o RaceTagPro está servindo uma listagem **de resultados/inscritos** em `results.json`; esse conteúdo pode mudar depois da realização do evento. A sincronização já tem data limite 17/11/2026; acompanhe qualquer alteração de estrutura ou possível exposição de resultados não homologados. Nunca usar o painel para classificação de resultados.

**Histórico:** o texto anterior sobre "705 com sexo não informado" refere-se apenas à API nova. Ele foi superado pela descoberta do RaceTagPro e não descreve o status atual do painel.

---

## Ajuste dos gráficos — 12/11/2026

- Corrigido descompasso entre JS (`bar-row`) e CSS (`bar-line`): os rótulos e totais são exibidos em colunas separadas, com o total alinhado à direita e acessibilidade mantida.
- Gráfico da esquerda passa a exibir primeiro as **quatro categorias** (5 KM, PCD, Kids, Escolar) com suas contagens; depois as **faixas etárias apenas das categorias 5 KM e Kids**. Escolar e PCD deixam de ser misturados na faixa genérica `Geral`.
- Barras de categoria e faixa continuam interativas, inclusive com filtros de sexo, cidade/equipe e navegação para a lista de atletas.
- Dados do RaceTagPro/snapshot v3, Regulamento e logos não foram alterados. Atualizado cache PWA v14.
- Testado com 895 registros: PCD (9), Escolar (29), Kids 12-13 (18), 5 KM 30-34 (152), Feminino (514); HTML IDs únicos, JS sintaticamente válido e rótulos/quantidades com classes corretas.
