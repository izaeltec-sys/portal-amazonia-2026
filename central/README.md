# Central do Atleta

A pasta `central/` contém a Central do Atleta da 3ª Corrida de Rua Portal da Amazônia — 2026.

## Objetivo

A Central deve se comportar como uma interface de aplicativo, especialmente no celular, sem repetir o Regulamento inteiro na tela inicial.

Princípios:

- mobile-first;
- uma informação por tela;
- navegação curta por botões e menu inferior;
- Regulamento como fonte normativa;
- Central como camada de consulta rápida e comunicação operacional;
- evitar funcionalidades ou blocos que não entreguem benefício claro ao atleta.

## Estado vigente

A Central está alinhada ao **Regulamento oficial versão 1.3**, atualizado em **30/10/2026** pela Alteração nº 02/2026.

Informações operacionais destacadas atualmente:

- local do evento: **SEST SENAT — Rua Mato Grosso, Vilhena/RO**;
- percurso oficial dos 5 km disponível em Strava, Google Maps e Garmin Connect;
- Garmin Connect incorporado na tela de percurso quando suportado pelo navegador;
- retirada de kits na King Tênis em 13 e 14/11;
- atleta de outra cidade sem pessoa para retirar o kit deve contatar a Organização até **14h de 13/11/2026**;
- Regulamento integral continua sendo a fonte normativa.

## Ajuste de percurso — 30/10/2026

- Alteração nº 02/2026: pequeno ajuste no percurso para melhorar a segurança e reduzir possibilidade de erro, preservando os 5 km.
- Google Maps atualizado: `https://maps.app.goo.gl/vWJ9BCkSqAP2H5159`.
- Strava e Garmin Connect mantêm os links anteriores. Segundo a Organização, o Google Maps pode representar visualmente alguns pontos de maneira ligeiramente diferente por limitações da plataforma; o percurso é único e a orientação operacional no dia da prova é a sinalização da Organização.
- Aviso oficial destacado em `central/data/avisos.json`, Regulamento 1.3 em `/index.html#provas`.
- Cache atualizado para `portal-central-v10`.

## Navegação

A Central usa telas internas controladas por hash (`#inicio`, `#avisos`, `#evento`, `#duvidas`, etc.). Apenas a tela ativa fica visível.

A página inicial apresenta:

- logotipo oficial do evento integrado ao cabeçalho;
- dados básicos da prova;
- acessos rápidos para Avisos, Inscrição, Programação, Kit, Kids e Percurso;
- acesso direto ao Regulamento oficial.

## Legibilidade e acesso rápido — 11/10/2026

A Central recebeu uma atualização de acessibilidade visual voltada especialmente à leitura em celulares:

- fontes maiores nos cards, subtítulos, textos informativos, avisos, FAQ e navegação;
- ícones maiores nos atalhos e no menu inferior, preservando os Tabler Icons existentes;
- o atalho **Dúvidas** ocupa agora o lugar de **Inscrição** no acesso rápido da página inicial;
- **Inscrições oficiais** ganhou acesso próprio abaixo do **Regulamento oficial**, mantendo o endereço estável `../inscrever/`;
- há um lembrete na página inicial sobre a entrega de **1 kg de alimento não perecível por inscrição**, que abre as dúvidas;
- a pergunta do alimento é a primeira da FAQ, seguida das dúvidas operacionais mais recorrentes.

A obrigação do alimento não é uma norma nova: foi estabelecida pelo **Adendo nº 01/2026**, incorporado ao Regulamento 1.1 e mantido na versão 1.2. A Central apenas melhora a visibilidade e a consulta à regra.

O cache da Central passa a ser `portal-central-v8` para atualizar os assets em dispositivos que já usaram o aplicativo/site.

## Esclarecimento sobre transferência de inscrição — 21/10/2026

A Central passou a esclarecer em **Dúvidas frequentes** e no aviso tipo `informacao` de 21/10/2026 as regras já publicadas no **capítulo 10.2 do Regulamento oficial 1.2**, sem mudança normativa:

- somente o titular original pode solicitar a transferência;
- o pedido é direcionado ao responsável pela cronometragem da **Agito Esportes**, WhatsApp **(65) 99665-8832**;
- a transferência será operacionalizada após o encerramento das inscrições em **31/10/2026**;
- limite para solicitar: **12/11/2026, às 12h**;
- há taxa operacional, informada no atendimento, que não integra o valor da inscrição nem é destinada à Organização do evento.

O comunicado aponta para `../index.html#cancelamento`, preservando o Regulamento como referência normativa.
O cache de recursos essenciais foi elevado para `portal-central-v9`.

## Ícones

A interface utiliza uma seleção local de **Tabler Icons** em um sprite SVG:

`central/assets/icons/tabler/sprite.svg`

Os ícones são usados somente como elementos funcionais da interface. A identidade visual do evento e o logotipo oficial permanecem independentes e não são alterados pelos ícones.

A seleção atual inclui representações específicas para:

- Avisos;
- Inscrição;
- Programação;
- Kit;
- Kids;
- Percurso;
- Regulamento;
- navegação inferior;
- voltar e compartilhar.

Tabler Icons é distribuído sob licença MIT. A licença aplicável está preservada em:

`central/assets/icons/tabler/LICENSE`

## Cache / PWA

A Central mantém `manifest.webmanifest` e `service-worker.js` como suporte técnico para navegadores compatíveis, mas a interface não promete instalação de aplicativo nem força uma experiência que o navegador do atleta não ofereça.

O Service Worker mantém em cache a estrutura essencial da Central, o sprite de ícones e os assets principais. O arquivo `data/avisos.json` usa estratégia network-first para priorizar comunicados novos e utilizar cache somente como contingência.

## Avisos

Os comunicados são mantidos em `central/data/avisos.json`.

Tipos permitidos:

- `informacao`: explica ou destaca algo que já está oficialmente definido;
- `aviso`: orientação operacional que não altera o conteúdo do Regulamento;
- `alteracao`: Errata, Adendo ou alteração formal do Regulamento.

Estrutura básica:

```json
{
  "id": "2026-09-01-exemplo",
  "data": "2026-09-01",
  "tipo": "aviso",
  "titulo": "Título objetivo",
  "resumo": "Texto curto para aparecer no card.",
  "conteudo": "Texto exibido quando o atleta abre o aviso.",
  "link": "../index.html#secao",
  "rotuloLink": "Ver detalhes",
  "destaque": false
}
```

## Imagens nos avisos

A Central aceita uma arte diretamente dentro do JSON em Base64:

```json
{
  "imagem": {
    "mime": "image/jpeg",
    "base64": "/9j/4AAQSkZJRgABAQ...",
    "alt": "Descrição objetiva da arte"
  }
}
```

Também existe suporte opcional a arquivo externo:

```json
{
  "imagem": {
    "src": "./assets/aviso-exemplo.jpg",
    "alt": "Descrição objetiva da arte"
  }
}
```

### Recomendação para Base64

Base64 aumenta o tamanho do arquivo em aproximadamente 33%. Por isso, antes de converter uma arte:

- preferir JPG quando não houver transparência;
- reduzir a largura para algo entre 720 e 1080 px, conforme a necessidade;
- comprimir a imagem antes da conversão;
- tentar manter a imagem original abaixo de aproximadamente 150–250 KB;
- evitar guardar várias imagens pesadas no mesmo `avisos.json`.

Para poucas artes otimizadas, Base64 funciona bem. Se o volume crescer, arquivos separados passam a ser mais eficientes porque o navegador consegue armazená-los em cache individualmente.

## Logotipo oficial

O logotipo exibido no cabeçalho é reutilizado a partir do mesmo arquivo oficial já incorporado ao Regulamento, sem redesenho, reconstrução ou interpretação por IA.

## Regra editorial

Um aviso operacional não deve ser usado para alterar regra já publicada no Regulamento.

Quando o conteúdo modificar regra oficial, prazo, direito, obrigação, categoria, valor, condição de participação ou outro ponto normativo, a alteração deve primeiro ser formalizada no Regulamento como Errata, Adendo ou nova versão e registrada no Histórico de Alterações. Depois disso, a Central pode publicar o respectivo comunicado do tipo `alteracao`.

## Página principal existente

O arquivo `/index.html` continua sendo o Regulamento oficial. A Central permanece em `/central/` para não quebrar links já divulgados.

## Inscritos e Estatísticas — 12/11/2026

Nova seção em `central/inscritos/` com dashboard, busca de nomes e filtros por categoria, cidade, equipe e naipe informado. Os dados são copiados exclusivamente da lista pública da Agito, com identificação de fonte e horário de atualização.

Quatro grupos: **ADULTO 5 km**, **ESCOLAR 5 km**, **PCD 5 km** e **KIDS**. O capítulo 5 do Regulamento 1.3 confirma que a categoria Escolar corre 5 km, embora o cadastro técnico da Agito exponha 1 km. Não atribuir masculino/feminino à categoria original marcada como "Misto"; apenas exibir naipe quando declarado.

A Organização confirmou necessidade de **incluir os nomes de atletas Kids/Escolar**, permitindo verificação pelos responsáveis, com minimização dos demais dados. Consulta inicial: **895 inscrições confirmadas** (794 Adulto, 29 Escolar, 9 PCD, 63 Kids; 2 sem nome público).

O robô `scripts/atualizar_inscritos.py` é agendado via GitHub Actions, e o frontend usa o JSON da branch main via GitHub Raw (CORS habilitado), com fallback do próprio GitHub Pages. A atualização automática é por hora até 17/11/2026 e pode atrasar conforme o agendador do GitHub. Nenhuma chave, token privado ou banco de dados é necessário.

Leia `central/inscritos/README.md` antes de editar a rotina.

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
