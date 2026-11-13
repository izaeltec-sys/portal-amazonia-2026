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
