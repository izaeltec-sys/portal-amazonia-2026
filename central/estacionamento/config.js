/*
 * Orientação de estacionamento — 3ª Corrida de Rua Portal da Amazônia 2026
 *
 * O marcador central foi confirmado pelo link oficial do SEST SENAT Zona Leste:
 * https://maps.app.goo.gl/LEY2Ur9a1TaQpM7q8
 *
 * NÃO ativar "approved" até conferir no local:
 * 1) os pontos exatos da Rua Mato Grosso reservada à largada/chegada;
 * 2) as vias laterais efetivamente públicas e adequadas para estacionar;
 * 3) que NENHUMA linha verde entre no condomínio atrás da área do evento.
 *
 * A chave web da Maps JavaScript API é pública por natureza.
 * Configurar antes as restrições HTTP referer e API no Google Cloud Console.
 * Não inserir chave sem restrições nem qualquer credencial privada.
 */
window.PORTAL_PARKING_CONFIG = {
  googleMapsApiKey: "",
  approved: false,
  center: { lat: -12.7189583, lng: -60.1019988 },
  overviewZoom: 15.5,
  detailZoom: 17.6,
  googleMapsLocationUrl: "https://maps.app.goo.gl/LEY2Ur9a1TaQpM7q8",
  // Desenhar as linhas geográficas no editor ?editor=1 e conferir no local.
  // Exemplo de formato: [{lat: -12.7180, lng: -60.1020}, ...].
  redRoad: { label: "Rua Mato Grosso — largada/chegada", path: [] },
  sideRoads: []
};
