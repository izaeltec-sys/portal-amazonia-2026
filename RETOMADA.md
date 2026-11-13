# RETOMADA — 3ª Corrida de Rua Portal da Amazônia 2026

**Atualizado em:** 30/10/2026  
**Repositório oficial:** `izaeltec-sys/portal-amazonia-2026`  
**Branch de referência:** `main`

> ## REGRA DE OURO
>
> **O GitHub é a fonte de verdade do estado atual do projeto.**
>
> Este arquivo existe para permitir retomada rápida quando um chat perder contexto.
> Ao iniciar um novo chat, **não assumir que este documento é mais novo que o GitHub**:
>
> 1. consultar o `HEAD` real de `main`;
> 2. ler este `RETOMADA.md`;
> 3. conferir `index.html`;
> 4. conferir `central/README.md`;
> 5. conferir `central/data/avisos.json`;
> 6. reconstruir os últimos commits relevantes.
>
> Se houver divergência, **o estado vivo do GitHub prevalece**.

---

## 1. Estado vigente

### Regulamento

O arquivo oficial do regulamento é sempre:

`/index.html`

**Não criar versões do arquivo com nomes como `regulamento_v1.2.html`.**
O nome publicado deve continuar sendo `index.html`.

Estado confirmado em 10/10/2026:

- **Versão oficial vigente: 1.3**
- publicação inicial: **26/08/2026**
- última atualização normativa: **30/10/2026**
- instrumento vigente mais recente: **Alteração nº 02/2026**

O controle de versão aparece **dentro do próprio regulamento**, na capa, rodapé e Histórico de Alterações.

### Histórico normativo já consolidado

**Versão 1.0 — 26/08/2026**
- publicação inicial do Regulamento Oficial.

**Versão 1.1 — 28/08/2026**
- **Adendo nº 01/2026**;
- inclusão da Campanha Solidária;
- cada participante inscrito deve entregar **1 kg de alimento não perecível por inscrição** na retirada do kit;
- alimento dentro da validade, em embalagem original, íntegra e lacrada.

**Versão 1.2 — 10/10/2026**
- **Alteração nº 01/2026**;
- definição do **SEST SENAT — Rua Mato Grosso, Vilhena/RO** como local de concentração, largada e chegada;
- publicação do **percurso oficial dos 5 km**;
- disponibilização do percurso por Strava, Google Maps e Garmin Connect;
- atualização do acesso direto às inscrições;
- atualização do procedimento/prazo para atleta de outra cidade que não tenha pessoa disponível para retirar o kit;
- atualização da Central do Atleta para refletir o novo estado normativo.

---

**Versão 1.3 — 30/10/2026**
- **Alteração nº 02/2026**;
- pequena modificação no percurso dos 5 km para melhorar a segurança e reduzir erros de trajeto;
- distância oficial de 5 km mantida;
- novo link do Google Maps; Strava e Garmin Connect mantidos;
- Central e avisos atualizados. O novo link foi fornecido pela Organização; a Organização esclareceu que pequenas diferenças visuais no Google Maps decorrem das limitações da plataforma; o percurso operacional é único e será indicado pela sinalização no dia da prova.

---

## 2. Regra editorial após publicação

Depois que o usuário disser que uma versão foi **publicada**, nenhuma mudança normativa pode ser feita silenciosamente.

Classificação adotada:

### Errata

Usar quando a correção **não altera a decisão ou regra**, por exemplo:

- erro de digitação;
- telefone digitado incorretamente;
- erro material de data;
- link incorreto;
- inconsistência puramente editorial.

Anotação preferida no ponto atingido:

**Corrigido pela Errata nº XX/2026, de DD/MM/2026.**

### Adendo

Usar quando houver **acréscimo complementar** que não substitua nem contradiga regra anterior.

Anotação preferida:

**Acrescido pelo Adendo nº XX/2026, de DD/MM/2026.**

### Alteração do Regulamento

Usar quando uma regra já existente for **modificada, substituída, ampliada ou restringida**.

Anotação preferida:

**Modificado pela Alteração nº XX/2026, de DD/MM/2026.**

### Fluxo obrigatório de alteração normativa

Ao alterar regra já publicada:

1. classificar como Errata, Adendo ou Alteração;
2. atualizar a redação atingida;
3. inserir a nota no próprio ponto alterado/acrescido/corrigido;
4. atualizar o número da versão quando aplicável;
5. atualizar a data da última atualização;
6. registrar no **Histórico de Alterações**;
7. atualizar a **Central do Atleta** se a mudança afetar consulta operacional;
8. publicar aviso do tipo `alteracao` em `central/data/avisos.json` quando necessário;
9. se a Central mudar, revisar o cache/service worker;
10. realizar commit com mensagem clara.

---

## 3. Regras importantes já consolidadas

Antes de alterar qualquer item abaixo, conferir o `index.html` atual.

### Evento

- evento: **3ª Corrida de Rua Portal da Amazônia — 2026**
- data: **15/11/2026**
- cidade: **Vilhena/RO**
- concentração: **06h00**
- início da sequência de largadas: **06h30**
- local: **SEST SENAT — Rua Mato Grosso, Vilhena/RO**
- prova principal: **5 km**
- Kids: participativa.

### Largadas

Sequência:

1. PCD;
2. Escolar;
3. geral dos 5 km.

Os pequenos intervalos são definidos pela Organização/equipe de cronometragem e não precisam ser fixados em segundos no regulamento.

### Limite operacional 5 km

- **1 hora contada da largada geral**;
- após esse período a Organização pode iniciar desmontagem de postos, sinalização e estruturas;
- **não implica desclassificação automática**.

### PCD

- PCD Masculino;
- PCD Feminino;
- inscrição gratuita;
- medalha para participantes;
- **troféu do 1º ao 5º lugar em cada naipe**.

### Kids

Participação **não competitiva**, sem classificação e sem pódio.

Distâncias:

- até 3 anos: 50 m;
- 4–6: 100 m;
- 7–9: 200 m;
- 10–11: 400 m;
- 12–13: 600 m.

### Menores nos 5 km

Atletas de 14 a 17 anos precisam apresentar Termo de Responsabilidade e Autorização.

O `index.html` contém gerador local do termo, impressão preenchida, termo em branco e versão anexada ao PDF integral.

### Premiação

- Elite/Geral: troféu 1º ao 5º;
- faixas etárias: troféu 1º ao 5º;
- Escolar: troféu 1º ao 5º;
- PCD: troféu 1º ao 5º;
- Kids: sem troféu/pódio competitivo;
- **sem premiação em dinheiro**.

---

## 4. Percurso e mapas

### Percurso oficial dos 5 km

- Strava: `https://www.strava.com/routes/3543613222716777324`
- Google Maps: `https://maps.app.goo.gl/vWJ9BCkSqAP2H5159`
- Garmin Connect: `https://connect.garmin.com/app/course/523157690`
- Garmin embed: `https://connect.garmin.com/embed/course/523157690`

O Garmin incorporado foi testado: o endereço normal recusava iframe e o endpoint `/embed/course/523157690` funcionou.

### Local do evento

- **SEST SENAT — Rua Mato Grosso, Vilhena/RO**
- Google Maps: `https://maps.app.goo.gl/LEY2Ur9a1TaQpM7q8`

### Retirada de kit

- **King Tênis**
- Av. Major Amarante, 3117, Centro, Vilhena/RO
- Google Maps: `https://maps.app.goo.gl/vhcoYYCzV59VRMYH6`

Os iframes de mapa devem ser ocultados na impressão do Regulamento.

---

## 5. Central do Atleta

Diretório:

`/central/`

A Central é uma camada de consulta rápida. **Não substitui o Regulamento**, que continua sendo a fonte normativa.

Estado vigente:

- alinhada ao **Regulamento 1.3**;
- mobile-first;
- aparência de interface de aplicativo;
- navegação interna por telas/hash;
- menu inferior;
- tela inicial enxuta;
- avisos;
- inscrição;
- programação;
- kit;
- Kids;
- percurso;
- dúvidas frequentes;
- acesso ao Regulamento integral;
- compartilhamento;
- suporte PWA/service worker.

Arquivos principais:

- `central/index.html`
- `central/README.md`
- `central/data/avisos.json`
- `central/service-worker.js`
- `central/manifest.webmanifest`
- `central/assets/icons/tabler/sprite.svg`

### Avisos

Tipos em `central/data/avisos.json`:

- `informacao`
- `aviso`
- `alteracao`

Mudança normativa deve primeiro ser formalizada no Regulamento. Depois a Central pode publicar aviso tipo `alteracao`.

### Estado operacional divulgado

- local: SEST SENAT;
- programação;
- retirada na King Tênis em 13 e 14/11;
- atleta de outra cidade sem pessoa para retirar o kit: contato com a Organização até **14h de 13/11/2026**;
- percurso oficial por Strava, Google Maps e Garmin;
- mapas do local do evento e da retirada;
- Garmin incorporado quando suportado pelo navegador.

### Inscrições

Existe caminho curto estável:

`/inscrever/`

Ele deve continuar encaminhando para a página oficial vigente de inscrição.

---

## 6. Commits que reconstroem o estado recente

Ao retomar, conferir estes commits e depois verificar se existem commits mais novos:

- `364ea46` — `test: atualiza regulamento 1.2 e testa percurso Garmin incorporado`
- `53d6566` — `feat: atualiza Central do Atleta para regulamento 1.2`
- `a76e5ca` — `feat: mantém navegação e incorpora mapa do local`
- `c13620a` — `feat: incorpora mapas do evento e retirada de kits`

No momento deste handoff, `c13620a` era o último commit funcional conhecido.
**Não assumir que continuará sendo o HEAD em chats futuros.**

---

### Atualização de usabilidade da Central — 11/10/2026

Sem alteração normativa do Regulamento 1.2:

- textos e ícones aumentados para melhorar a leitura em dispositivos móveis;
- atalho **Dúvidas** substitui **Inscrição** na grade de seis acessos rápidos;
- inscrições acessíveis em cartão inferior, ao lado da consulta ao Regulamento, mantendo o caminho `/inscrever/`;
- lembrete de **1 kg de alimento não perecível por inscrição** na tela inicial, com acesso à FAQ;
- FAQ reorganizada, começando pela entrega obrigatória do alimento na retirada do kit (norma já vigente desde o Adendo nº 01/2026);
- service worker atualizado para o cache `portal-central-v8`.

Commits posteriores ao último estado funcional do handoff:

- `cfbacec` — registra `RETOMADA.md`;
- `db653e1` — adiciona `PROMPT_NOVO_CHAT.md`;
- `e47ed2e` — atualiza o README de retomada;
- `0d2ed98` — melhora legibilidade, reorganiza os atalhos e destaca a FAQ;
- `eb143db` — atualiza o cache do service worker;
- `1eb837c` — atualiza `central/README.md` com as mudanças.

A lista é histórica e **não substitui a conferência do HEAD real de `main`** na próxima retomada.

---

### Esclarecimento de transferência de inscrição — 21/10/2026

Foi incorporado à FAQ da Central e aos avisos (`informacao`) esclarecimento fiel à regra vigente do **capítulo 10.2 do Regulamento 1.2**. Não houve alteração normativa.

- apenas o titular original solicita à cronometragem **Agito Esportes — (65) 99665-8832**;
- operacionalização após encerramento das inscrições em **31/10/2026**;
- pedido até **12/11/2026 às 12h**;
- taxa operacional com valor informado no atendimento, sem repasse à Organização;
- novo aviso em `central/data/avisos.json`, link para `../index.html#cancelamento`;
- cache elevado de `portal-central-v8` para `portal-central-v9`.

---

### Atualização do percurso — 30/10/2026

Alteração nº 02/2026 formalizada no `index.html`, versão 1.3. O Google Maps do percurso passou a `https://maps.app.goo.gl/vWJ9BCkSqAP2H5159`, com motivo de segurança e redução de erros e mesma distância de 5 km. Strava e Garmin seguem com os links anteriores. Um aviso `alteracao` foi publicado na Central e o cache passou para `portal-central-v10`. O PDF publicado na plataforma de inscrições poderá continuar desatualizado até que seu responsável o substitua; encaminhar solicitação de atualização.

---

## 7. Mídia e arte da Central do Atleta

Foi criada arte para divulgação da Central do Atleta.

Arquivo mais recente preservado no Projeto/Library:

**`Central do Atleta — Corrida Portal da Amazônia.png`**

Também permanecem versões anteriores:

- `Central do Atleta 2026.png`
- `Central do Atleta 2026(1).png`

A arte mais recente possui título CENTRAL DO ATLETA, cards de acesso rápido, bloco para QR Code, informações do evento e rodapé institucional.

### Regra obrigatória para qualquer nova mídia

Seguir integralmente o arquivo de diretrizes de mídia disponível no Projeto.

Assets **intocáveis**:

- logotipo oficial do evento;
- logotipo Kids oficial;
- logotipo da Polaco Cycling Team Eventos;
- `Rodapé.pdf`.

Nunca redesenhar, reconstruir, reinterpretar ou “melhorar” esses assets por IA.

O rodapé oficial é obrigatório nas artes do evento.

A IA adapta o layout aos arquivos oficiais, nunca os arquivos ao layout.

---

## 8. Regra de segurança para novos chats

Este projeto já sofreu perda de mensagens visíveis no chat.

Por isso:

**NUNCA usar a memória do chat como prova do estado atual.**

Em qualquer novo chat:

1. consultar GitHub;
2. confirmar HEAD de `main`;
3. ler `RETOMADA.md`;
4. conferir `index.html`;
5. conferir estado da Central;
6. verificar commits posteriores aos listados neste documento;
7. só então propor ou executar alterações.

Não substituir arquivos atuais por cópias locais antigas.

Se houver diferença entre uma lembrança do chat e o GitHub, **GitHub vence**.

---

## 9. Continuação

O novo chat deve reconstruir o estado real do GitHub e continuar a partir da próxima solicitação do usuário.

Quando houver trabalho no Regulamento, Central ou mídia:

- preservar o que já está publicado;
- classificar corretamente mudanças normativas;
- manter `index.html` como nome oficial do regulamento;
- manter a Central sincronizada com a versão vigente;
- atualizar este `RETOMADA.md` após mudanças significativas.

O prompt completo de retomada está em:

`PROMPT_NOVO_CHAT.md`

---

## Encerramento — estacionamento animado (12/11/2026)

O projeto da orientação animada de estacionamento foi **cancelado por decisão da Organização** em 12/11/2026, por complexidade desproporcional ao benefício. A branch histórica `feat/central-parking-google-maps` não foi mesclada; a Central publicada segue sem o módulo.

Recursos efetivamente encerrados/limpos no Vostro e Google Cloud:
- Prévia local Node.js em `localhost:8000` parada, diretório temporário de prévia (incluindo cópia local da chave) apagado.
- Chave dedicada da Maps JavaScript API excluída.
- Faturamento desvinculado do projeto dedicado `portal-amazonia-2026-mapas`, confirmado pelo Google Cloud.
- Projeto dedicado encerrado; Console informou exclusão programada após **12/12/2026**.
- Alerta/orçamento próprio de R$ 10/mês removido da conta de faturamento.
- **Não** foi encerrada a conta geral do Google Cloud, nem o projeto preexistente My First Project.

Alternativa operacional: orientação textual de estacionamento em Avisos/WhatsApp, sem mapa animado.

Nova oportunidade em avaliação: dashboard público de inscrições com dados já publicados pela Agito, via extração server-side e snapshot estático sanitizado na Central. **Atualização da Organização em 12/11/2026: incluir os nomes de Kids/Escolar que já constem na lista pública da Agito, para consulta pelos responsáveis; minimizar os outros campos e não copiar dados não divulgados.** Não confundir análise de viabilidade com funcionalidade publicada.

---

## Dashboard de inscritos — implementação em 12/11/2026

Branch de implementação: `feat/central-inscritos-dashboard`.

Categorias oficiais: **ADULTO (5 km), ESCOLAR (5 km), PCD (5 km), KIDS**. O Regulamento 1.3 (capítulo 5) define **Escolar 5 km**; o cadastro técnico da Agito informa erroneamente 1 km. Não extrapolar masculino/feminino para faixas etárias com marcador "Misto".

A API pública da Agito foi consultada em 9 páginas. Snapshot inicial: **895** inscrições confirmadas, Adulto 794, Escolar 29, PCD 9, Kids 63; duas sem nome na origem. Dados sanitizados em `central/inscritos/dados.json` (sem IDs internos, fotos, contato, CPF, nascimento, datas ou endereço).

O frontend `central/inscritos/index.html` disponibiliza pesquisa de nomes, filtros de faixa/cidade/equipe/naipe e dashboard por categoria e município. A página usa GitHub Raw para acessar o JSON mais recente sem depender de um rebuild do Pages a cada commit do GitHub Actions, com fallback local. `scripts/atualizar_inscritos.py` coleta/valida dados e `.github/workflows/atualizar-inscritos.yml` agenda execução horária até 17/11/2026.

Após publicação: verificar deploy GitHub Pages, teste em celular, execução manual do workflow, atualização automática e se a Agito continua acessível. Não usar informação de sexo inferido pelo nome. Para governança e operação, consultar `central/inscritos/README.md`.
