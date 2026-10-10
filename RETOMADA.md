# RETOMADA — 3ª Corrida de Rua Portal da Amazônia 2026

**Atualizado em:** 10/10/2026  
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

- **Versão oficial vigente: 1.2**
- publicação inicial: **26/08/2026**
- última atualização normativa: **10/10/2026**
- instrumento vigente mais recente: **Alteração nº 01/2026**

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
- Google Maps: `https://maps.app.goo.gl/aUVzgD4Tn5YR8m439`
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

- alinhada ao **Regulamento 1.2**;
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
