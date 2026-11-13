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
