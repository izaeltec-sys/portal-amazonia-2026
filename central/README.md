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

## Navegação

A Central usa telas internas controladas por hash (`#inicio`, `#avisos`, `#evento`, `#duvidas`, etc.). Apenas a tela ativa fica visível.

A página inicial apresenta:

- logotipo oficial do evento integrado ao cabeçalho;
- dados básicos da prova;
- acessos rápidos para Avisos, Inscrição, Programação, Kit, Kids e Percurso;
- acesso direto ao Regulamento oficial.

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
