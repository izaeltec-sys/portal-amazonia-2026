# PROMPT — NOVO CHAT / PORTAL DA AMAZÔNIA 2026

Retome o projeto **3ª Corrida de Rua Portal da Amazônia — 2026** pelo estado vivo do GitHub.

**Repositório oficial:** `izaeltec-sys/portal-amazonia-2026`  
**Branch de referência:** `main`

Este novo chat substitui um chat anterior que começou a perder mensagens e ficou desatualizado.

## Fonte de verdade

**Não use memória de chats anteriores para determinar o estado atual.**

Antes de qualquer alteração:

1. consulte o GitHub oficial;
2. confirme o `HEAD` real de `main`;
3. leia integralmente `RETOMADA.md`;
4. confira o `index.html` atual;
5. leia `central/README.md`;
6. confira `central/data/avisos.json`;
7. verifique os commits recentes posteriores aos citados no `RETOMADA.md`;
8. reconstrua o estado real antes de responder ou modificar arquivos.

Se houver divergência entre este prompt, memória, conversas anteriores e GitHub, **o GitHub prevalece**.

## Estado esperado no momento da transferência

O estado conhecido no encerramento do chat anterior era:

- Regulamento oficial em **versão 1.2**;
- publicação inicial em 26/08/2026;
- Adendo nº 01/2026 incorporado na versão 1.1;
- Alteração nº 01/2026 incorporada em 10/10/2026;
- local oficial: **SEST SENAT — Rua Mato Grosso, Vilhena/RO**;
- percurso oficial de 5 km publicado em Strava, Google Maps e Garmin Connect;
- mapas do evento e da retirada de kits incorporados;
- Central do Atleta atualizada para acompanhar o Regulamento 1.2;
- arte de divulgação da Central do Atleta já produzida e preservada no Projeto/Library;
- PCD com troféu do **1º ao 5º lugar** masculino e feminino.

Confirme tudo no GitHub antes de assumir como vigente.

## Regulamento

O Regulamento publicado deve continuar sendo sempre:

`index.html`

O controle de versão é feito **dentro do documento**, nunca mudando o nome do arquivo.

Depois que uma versão foi publicada, nenhuma mudança normativa pode ser silenciosa:

- correção material → **Errata**;
- acréscimo complementar → **Adendo**;
- mudança de regra existente → **Alteração do Regulamento**.

Padrões textuais:

- `Corrigido pela Errata nº XX/2026, de DD/MM/2026.`
- `Acrescido pelo Adendo nº XX/2026, de DD/MM/2026.`
- `Modificado pela Alteração nº XX/2026, de DD/MM/2026.`

Qualquer mudança normativa deve atualizar, quando aplicável:

- redação afetada;
- nota da alteração no ponto atingido;
- versão;
- data de atualização;
- Histórico de Alterações;
- Central do Atleta;
- aviso oficial em `central/data/avisos.json`;
- cache/service worker da Central.

## Central do Atleta

A Central está em:

`central/`

Ela é camada de consulta rápida e operacional. O Regulamento continua sendo a fonte normativa.

Não transformar a Central em cópia integral do Regulamento.

Preservar:

- mobile-first;
- navegação curta;
- telas internas;
- menu inferior;
- avisos;
- programação;
- kit;
- Kids;
- percurso;
- dúvidas;
- acesso ao Regulamento.

## Mídia

Para qualquer criação ou alteração de mídia, seguir integralmente as **Diretrizes de Mídia e Identidade Visual** disponíveis no Projeto.

São assets intocáveis:

- logotipo oficial do evento;
- logotipo Kids;
- logotipo da Polaco Cycling Team Eventos;
- `Rodapé.pdf`.

Nunca redesenhar, reconstruir ou reinterpretar esses assets por IA.

O rodapé oficial deve estar presente nas artes do evento.

## Forma de trabalho

O usuário é o organizador e tomador de decisão.

Pode implementar diretamente no GitHub quando o usuário pedir a mudança.

Antes de concluir uma alteração relevante:

1. confira o estado final no GitHub;
2. confirme que não houve regressão;
3. atualize `RETOMADA.md` se o estado do projeto tiver mudado de forma significativa.

Ao iniciar este chat, faça apenas a reconstrução do estado, informe de forma breve o `HEAD`, a versão oficial vigente e os principais componentes encontrados, e aguarde/execute a próxima demanda do usuário.
