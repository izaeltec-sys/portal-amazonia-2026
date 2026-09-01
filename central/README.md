# Central do Atleta

A pasta `central/` contém a Central do Atleta da 3ª Corrida de Rua Portal da Amazônia — 2026.

## Objetivo

A Central deve se comportar como uma interface de aplicativo, especialmente no celular. A tela inicial não deve repetir o Regulamento inteiro nem exibir grandes blocos de texto.

Princípios:

- mobile-first;
- uma informação por tela;
- navegação curta por botões e menu inferior;
- destaque apenas para o aviso mais importante;
- Regulamento como fonte normativa;
- Central como camada de consulta rápida e comunicação operacional.

## Navegação

A Central usa telas internas controladas por hash (`#inicio`, `#avisos`, `#evento`, `#duvidas`, etc.). Apenas a tela ativa fica visível.

A página inicial apresenta:

- logotipo oficial do evento integrado ao cabeçalho;
- dados básicos da prova;
- acesso à inscrição;
- um aviso em destaque;
- atalhos para assuntos específicos;
- opção discreta para adicionar a Central à tela inicial do celular.

## Acesso pela tela inicial / PWA

A Central possui `manifest.webmanifest` e `service-worker.js` para permitir experiência em modo standalone quando o navegador/dispositivo oferecer suporte.

A comunicação com o atleta deve usar **“Adicionar à tela inicial”**, e não “Instalar aplicativo”, para evitar a impressão de que existe download pela Play Store ou App Store.

Antes de qualquer prompt nativo, a Central explica que:

- não é necessário procurar o evento novamente pelo navegador;
- não há redirecionamento para a Play Store;
- o acesso é criado diretamente a partir da Central;
- no iPhone, o fluxo pode exigir Safari → Compartilhar → Adicionar à Tela de Início.

O navegador Android ainda pode usar a palavra “Instalar” no diálogo nativo; por isso a explicação aparece antes desse diálogo.

## Cache

O Service Worker mantém em cache apenas a estrutura essencial da Central e seus assets principais. O arquivo `data/avisos.json` usa estratégia network-first para priorizar comunicados novos e utilizar cache somente como contingência.

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

Para poucas artes otimizadas, Base64 funciona bem e simplifica a publicação. Se o volume crescer muito, arquivos separados passam a ser mais eficientes porque o navegador consegue armazená-los em cache individualmente.

## Logotipo oficial

A Central mantém uma cópia otimizada do arquivo oficial em `central/assets/logo-horizontal.jpg`, usada apenas para carregamento e encaixe do cabeçalho. A arte do logotipo não deve ser redesenhada, reconstruída ou reinterpretada.

Os ícones da experiência instalada também são derivados exclusivamente dos arquivos oficiais do evento, com redimensionamento/composição técnica para os formatos exigidos pelo navegador.

## Regra editorial

Um aviso operacional não deve ser usado para alterar regra já publicada no Regulamento.

Quando o conteúdo modificar regra oficial, prazo, direito, obrigação, categoria, valor, condição de participação ou outro ponto normativo, a alteração deve primeiro ser formalizada no Regulamento como Errata, Adendo ou nova versão e registrada no Histórico de Alterações. Depois disso, a Central pode publicar o respectivo comunicado do tipo `alteracao`.

## Página principal existente

O arquivo `/index.html` continua sendo o Regulamento oficial. A Central permanece em `/central/` para não quebrar links já divulgados.
