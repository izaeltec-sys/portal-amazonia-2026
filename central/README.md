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

- logotipo oficial do evento;
- dados básicos da prova;
- botão de inscrição;
- botão do Regulamento;
- um aviso em destaque;
- atalhos para assuntos específicos.

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

O logotipo exibido pela Central é o mesmo arquivo oficial já incorporado ao Regulamento. A Central o reutiliza sem redesenho, reconstrução ou alteração de identidade.

## Regra editorial

Um aviso operacional não deve ser usado para alterar regra já publicada no Regulamento.

Quando o conteúdo modificar regra oficial, prazo, direito, obrigação, categoria, valor, condição de participação ou outro ponto normativo, a alteração deve primeiro ser formalizada no Regulamento como Errata, Adendo ou nova versão e registrada no Histórico de Alterações. Depois disso, a Central pode publicar o respectivo comunicado do tipo `alteracao`.

## Página principal existente

O arquivo `/index.html` continua sendo o Regulamento oficial. A Central permanece em `/central/` para não quebrar links já divulgados.
