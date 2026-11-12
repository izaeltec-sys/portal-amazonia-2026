# Orientação animada de estacionamento — módulo experimental

> **Status: implementado em branch de preparação, NÃO pronto para publicação.**
>
> A versão pública da Central em main não foi modificada. O mapa padrão já é interativo por iframe; a animação Google Maps JavaScript API **não será ativada** até existirem chave restrita e trechos validados.

## Origem e objetivo

3ª Corrida de Rua Portal da Amazônia 2026 — 15/11/2026, SEST SENAT Zona Leste, Vilhena.

Mensagem oficial de orientação (não cria nova regra de trânsito):
- deixar a **Rua Mato Grosso** livre de veículos estacionados na área da largada e chegada;
- dar preferência às **ruas laterais públicas**, onde estacionamento for permitido;
- **não sugerir** estacionamento no condomínio atrás do local do evento;
- chegar com antecedência e obedecer sinalização e autoridades.

A referência geográfica do SEST SENAT Zona Leste foi validada por redirecionamento do mapa oficial: **-12.7189583, -60.1019988**. A nomenclatura de ruas em fontes cartográficas diverge (dados OpenStreetMap da área também apresentam "Rua 5004"); a geometria da Rua Mato Grosso e o domínio público das laterais **não foram comprovados**. Por isso nenhuma linha é ativada por padrão.

## Arquivos

- \`index.html\`: página mobile-first responsiva para mapa, legenda, gravação e editor.
- \`config.js\`: chave do Google Maps, coordenadas, geometrias e \`approved\`.
- \`parking.js\`: Google Maps JavaScript API, loop de 14 s, polylines e editor de trechos.

Integração preparada na branch:
- link em \`central/index.html\` na tela **Avisos**;
- link na tela **Evento**;
- incremento do cache PWA em \`central/service-worker.js\`.
- sem mudanças no regulamento oficial ou links existentes do percurso.

## Por que Google Maps JavaScript API

É a única das opções avaliadas que entrega de maneira consistente: mapa real do Google, interpolação de zoom, polylines geográficas associadas às ruas, pulsação vermelha, indicação verde e mapa totalmente interativo após interrupção ou conclusão da animação.

O mapa incorporado por iframe não oferece API de overlays geográficos animados com o mesmo controle. A Static API não oferece interação nativa; imagem + CSS sobreposta descola do mapa durante pan/zoom, a menos que seja usado um sistema cartográfico com coordenadas.

## Requisitos Google Cloud (etapa anterior à ativação)

1. Criar um projeto Google Cloud **isolado** para este evento, com faturamento Google Maps Platform habilitado.
2. Em \`APIs & Services > Library\`, habilitar **Maps JavaScript API**. Não são necessárias Places API, Routes API, Geocoding API nem Static API para o código atual.
3. Criar uma **API key de navegador** em \`APIs & Services > Credentials\`.
4. Em **Application restrictions**, selecionar **Websites (HTTP referrers)**; autorizar somente \`https://izaeltec-sys.github.io/*\` (e o domínio próprio exato, se houver). Por causa da política de Referer em navegadores modernos, a origem pode ser enviada sem o caminho. Uma chave dedicada à aplicação é indispensável.
5. Em **API restrictions**, selecionar **Restrict key** e autorizar **somente Maps JavaScript API**.
6. Configurar alertas do faturamento e limite baixo de cota diária para o Maps JavaScript API, caso a quota correspondente esteja disponível. Sugestão operacional inicial para uso isolado: **250 carregamentos/dia**, reavaliando a demanda. A quota é o mecanismo de contenção; alertas de orçamento NÃO bloqueiam cobranças. Aplique margem de segurança se precisar manter o volume dentro da franquia.
7. Somente depois de confirmar essas restrições, inserir a chave web em \`config.js\`. Ela será necessariamente visível ao navegador: isso é normal para chave web restrita. **Nunca guardar credenciais privadas, service account ou chave irrestrita no repositório.**
8. Verificar no Google Cloud \`Metrics / Quotas\` se a utilização bate com as visitas reais. Manter somente uma instância do mapa por visualização, nunca recarregar a API a cada loop.

**Custo conforme tabela oficial consultada em 11/11/2026:** Dynamic Maps — 10.000 carregamentos faturáveis gratuitos por mês para o SKU; primeira faixa excedente de US$ 7 por mil carregamentos. Consulte a tabela vigente antes da ativação. O faturamento e a franquia são calculados conforme o SKU e a conta de faturamento, podendo ser compartilhados com outros projetos.
- Preços: https://developers.google.com/maps/billing-and-pricing/pricing
- Segurança: https://developers.google.com/maps/api-security-best-practices
- Controle de gastos: https://developers.google.com/maps/billing-and-pricing/manage-costs

## Como conferir os trechos com o mapa real

1. Configure a chave restrita em \`config.js\`, **mas mantenha \`approved:false\`**.
2. Execute o site em host HTTP(S) autorizado pela chave (preferencialmente um domínio de prévia autorizado e uma chave de desenvolvimento dedicada; a branch do GitHub não é publicada automaticamente pelo Pages).
3. Abra \`/central/estacionamento/?editor=1\`. O editor cria linhas temporárias **somente no navegador**.
4. Selecione **Linha vermelha** e clique no traçado da Rua Mato Grosso correspondente à área que precisa ficar livre.
5. Selecione **Rua lateral**, clique em vias públicas comprovadas; use **Nova lateral** para cada segmento separado. Não inclua ruas privadas, entradas, área atrás do evento nem o condomínio.
6. Clique **Copiar JSON**. Revise visualmente e presencialmente os segmentos com a organização/órgão de trânsito antes de inseri-los em \`config.js\`. O módulo não prova o status público de uma via.
7. Após aprovação, complete \`redRoad.path\` e \`sideRoads\`, defina \`approved:true\`.
8. Com geometria aprovada e chave ativa, abra \`/central/estacionamento/\`; a animação começa automaticamente. Se o usuário tocar/deslocar/usar zoom, o loop para e o mapa fica livre. O botão **Repetir animação** reinicia a orientação.

**Não utilizar coordenadas de exemplo como verdade cartográfica.** A configuração inicial tem trechos vazios precisamente para não sugerir estacionar no condomínio ou em locais proibidos.

## Animação e gravação

- Duração programada: **14 segundos** em loop. Zoom até a região; vermelho pulsante para a via da largada; laterais públicas em verde com indicação direcional; mensagem final de chegada antecipada; transição de zoom de retorno.
- Otimizada para celular, sem frameworks e sem recarregar o Google Maps em cada ciclo.
- Acesse \`?gravar=1\` ou toque em **Gravar tela**: oculta botões e detalhes de navegação para gravação vertical. A gravação em si é feita pela ferramenta do iPhone/Android. Não há exportação automática de vídeo no site.
- A interação interrompe a animação e oferece **Repetir animação**.
- Com \`prefers-reduced-motion\`, a animação é substituída por indicação estática das linhas verificadas.
- Nunca ocultar a atribuição do Google ou de outros provedores no vídeo.
- **Direitos de uso:** o Google geralmente permite gravações de caráter informativo/instrucional com atribuição; se o material for classificado como vídeo promocional/propaganda, as diretrizes Geo do Google podem exigir aprovação prévia. Verificar antes de divulgar como publicidade. Preferir mapa padrão (não satélite) e manter créditos visíveis.
- https://about.google/brand-resource-center/products-and-services/geo-guidelines/
- https://developers.google.com/maps/documentation/javascript/policies

## Estados de segurança

- Sem chave: mostra mapa real de localização por iframe e orientação textual genérica; **sem linhas geográficas não aprovadas**.
- Chave válida mas \`approved:false\`: permanece no mapa por iframe; o editor abre somente em \`?editor=1\`.
- Chave/config inválida: retorna ao mapa incorporado com mensagem clara, sem tentar camuflar falha.
- Com chave e geometrias aprovadas: mostra animação e disponibiliza navegação manual.
- Sem internet: o mapa não funciona; o módulo não promete uso offline.
- O recurso **não usa imagens de satélite copiadas, tiles baixados ou mapa redesenhado por IA**.

## Aceite antes de mesclar em main

- [ ] Confirmar trechos da Rua Mato Grosso livres de estacionamento com a organização.
- [ ] Confirmar documentalmente ou em campo todas as laterais indicadas como públicas.
- [ ] Revisar a exclusão do condomínio.
- [ ] Criar chave API web restrita ao domínio e somente Maps JavaScript API.
- [ ] Configurar orçamento, alertas, monitoramento e cota.
- [ ] Testar Android e iPhone (touch, zoom, acessibilidade, 9:16 e retorno ao app).
- [ ] Verificar que atribuições do Google ficam visíveis durante a gravação.
- [ ] Verificar licença/autorização do uso do vídeo nas redes.
- [ ] Mesclar a branch em main; testar site público; só depois publicar aviso operacional em \`central/data/avisos.json\`.
