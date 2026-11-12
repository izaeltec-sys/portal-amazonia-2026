"use strict";
(function () {
  var config = window.PORTAL_PARKING_CONFIG || {};
  var params = new URLSearchParams(location.search);
  var editing = params.get("editor") === "1";
  var recording = params.get("gravar") === "1";
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var mapElement = document.getElementById("map");
  var fallback = document.getElementById("fallback");
  var status = document.getElementById("status");
  var caption = document.getElementById("message");
  var legend = document.getElementById("legend");
  var replayBtn = document.getElementById("replay");
  var editor = document.getElementById("editor");
  var map, redLine, greenLines = [], editorLines = [];
  var playing = false, frameId = 0, startTime = 0, lastFrame = 0, stepShown = -1;
  var frameMs = 48, totalMs = 14000, pointerTouched = false;
  var editMode = "red", greenIndex = 0, editRed = [], editGreens = [];
  var center = { lat: Number(config.center && config.center.lat), lng: Number(config.center && config.center.lng) };

  function validPoint(p) {
    return !!p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)) &&
      Math.abs(Number(p.lat) - center.lat) < 0.02 && Math.abs(Number(p.lng) - center.lng) < 0.02;
  }
  function validPath(p) {
    return Array.isArray(p) && p.length >= 2 && p.length <= 100 && p.every(validPoint);
  }
  function safeCenter() {
    return Number.isFinite(center.lat) && Number.isFinite(center.lng) &&
      center.lat > -13.5 && center.lat < -12 && center.lng > -61 && center.lng < -59;
  }
  var approved = !!config.approved && safeCenter() &&
    config.redRoad && validPath(config.redRoad.path) &&
    Array.isArray(config.sideRoads) && config.sideRoads.length > 0 &&
    config.sideRoads.every(function (r) { return r && validPath(r.path); });
  function notice(text) {
    status.textContent = text;
    status.classList.add("show");
  }
  function message(title, subtitle, kind) {
    caption.className = "message" + (kind ? " " + kind : "");
    caption.querySelector("strong").textContent = title;
    caption.querySelector("small").textContent = subtitle;
  }
  function captionForStep(step) {
    if (step === stepShown) return;
    stepShown = step;
    if (step === 0) message("Estacionamento com atenção", "Veja a região da largada e planeje sua chegada.");
    if (step === 1) message("RUA DA LARGADA", "Evite estacionar na Rua Mato Grosso.", "red");
    if (step === 2) message("DÊ PREFERÊNCIA ÀS RUAS LATERAIS", "Utilize somente vias públicas e locais permitidos.", "green");
    if (step === 3) message("Chegue com antecedência", "Ajude a manter livre a área da largada e chegada.");
  }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function zoomTo(level) {
    if (typeof map.moveCamera === "function") map.moveCamera({ zoom: level, center: center });
    else map.setZoom(level);
  }
  function stopForInteraction() {
    if (!playing) return;
    stop();
    replayBtn.hidden = false;
    message("Mapa liberado para explorar", "Navegue, amplie ou use Repetir animação para assistir novamente.");
  }
  function stop() {
    playing = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }
  function showStatic() {
    stop();
    redLine.setOptions({ strokeOpacity: 0.86, strokeWeight: 8, visible: true });
    greenLines.forEach(function (line) { line.setOptions({ strokeOpacity: 0.9, visible: true, icons: [] }); });
    captionForStep(3);
    replayBtn.hidden = false;
  }
  function showFrame(now) {
    if (!playing) return;
    frameId = requestAnimationFrame(showFrame);
    if (now - lastFrame < frameMs) return;
    lastFrame = now;
    var elapsed = (now - startTime) % totalMs;
    var isEnd = elapsed >= 12500;
    var overview = Number(config.overviewZoom) || 15.5;
    var detail = Number(config.detailZoom) || 17.6;
    var zoom = elapsed < 2600 ? overview + (detail - overview) * smooth(elapsed / 2600) :
      isEnd ? detail - (detail - overview) * smooth((elapsed - 12500) / 1500) : detail;
    zoomTo(zoom);
    var step = elapsed < 2600 ? 0 : elapsed < 5900 ? 1 : elapsed < 10300 ? 2 : 3;
    captionForStep(step);
    var redVisible = elapsed >= 2600 && !isEnd;
    var greenVisible = elapsed >= 5900 && !isEnd;
    var pulse = 0.5 + 0.5 * Math.sin(now / 210);
    redLine.setOptions({
      visible: redVisible,
      strokeOpacity: redVisible ? 0.56 + 0.40 * pulse : 0,
      strokeWeight: redVisible ? 7 + 3 * pulse : 8
    });
    greenLines.forEach(function (line, index) {
      if (!greenVisible) {
        line.setOptions({ visible: false });
        return;
      }
      var arrowOffset = ((now / 55 + index * 19) % 92) + "%";
      line.setOptions({
        visible: true,
        strokeOpacity: 0.9,
        icons: [{
          icon: { path: google.maps.SymbolPath.CIRCLE,
            strokeColor: "#fff", fillColor: "#fff", fillOpacity: 1, strokeWeight: 1, scale: 4 },
          offset: arrowOffset
        }]
      });
    });
  }
  function play() {
    if (!approved || !map || editing) return;
    stop();
    if (reducedMotion) {
      showStatic();
      return;
    }
    stepShown = -1;
    lastFrame = 0;
    replayBtn.hidden = true;
    zoomTo(Number(config.overviewZoom) || 15.5);
    redLine.setVisible(false);
    greenLines.forEach(function (line) { line.setVisible(false); });
    playing = true;
    startTime = performance.now();
    frameId = requestAnimationFrame(showFrame);
  }
  function renderEditor() {
    editorLines.forEach(function (line) { line.setMap(null); });
    editorLines = [];
    if (editRed.length >= 2) {
      editorLines.push(new google.maps.Polyline({ map: map, path: editRed,
        strokeColor: "#c93645", strokeWeight: 7, strokeOpacity: 0.9 }));
    }
    editGreens.forEach(function (points) {
      if (points.length < 2) return;
      editorLines.push(new google.maps.Polyline({ map: map, path: points,
        strokeColor: "#17845a", strokeWeight: 7, strokeOpacity: 0.9 }));
    });
    document.getElementById("editorStatus").textContent =
      "Vermelha: " + editRed.length + " pontos • Laterais: " +
      editGreens.length + " segmentos • Modo atual: " + (editMode === "red" ? "Rua Mato Grosso" : "lateral " + (greenIndex + 1));
    document.getElementById("editRed").classList.toggle("active", editMode === "red");
    document.getElementById("editGreen").classList.toggle("active", editMode === "green");
    document.getElementById("geometry").value = JSON.stringify({
      approved: false,
      center: center,
      redRoad: { label: "Rua Mato Grosso — largada/chegada", path: editRed },
      sideRoads: editGreens.filter(function (points) { return points.length >= 2; })
        .map(function (points) { return { path: points }; })
    }, null, 2);
  }
  function initEditor() {
    editor.classList.add("show");
    editRed = config.redRoad && Array.isArray(config.redRoad.path) ? config.redRoad.path.slice() : [];
    editGreens = Array.isArray(config.sideRoads) ? config.sideRoads.map(function (r) { return r.path.slice(); }) : [];
    map.addListener("click", function (ev) {
      if (!ev.latLng) return;
      var point = { lat: Number(ev.latLng.lat().toFixed(7)), lng: Number(ev.latLng.lng().toFixed(7)) };
      if (!validPoint(point)) return;
      if (editMode === "red") {
        if (editRed.length < 100) editRed.push(point);
      } else {
        if (!editGreens[greenIndex]) editGreens[greenIndex] = [];
        if (editGreens[greenIndex].length < 100) editGreens[greenIndex].push(point);
      }
      renderEditor();
    });
    document.getElementById("editRed").addEventListener("click", function () { editMode = "red"; renderEditor(); });
    document.getElementById("editGreen").addEventListener("click", function () {
      editMode = "green"; if (!editGreens.length) { editGreens.push([]); greenIndex = 0; }
      renderEditor();
    });
    document.getElementById("newGreen").addEventListener("click", function () {
      if (editGreens.length >= 8) { notice("Máximo de oito trechos laterais por orientação."); return; }
      editMode = "green"; editGreens.push([]); greenIndex = editGreens.length - 1; renderEditor();
    });
    document.getElementById("undoPoint").addEventListener("click", function () {
      if (editMode === "red") editRed.pop();
      else if (editGreens[greenIndex]) editGreens[greenIndex].pop();
      renderEditor();
    });
    document.getElementById("export").addEventListener("click", async function () {
      renderEditor();
      var value = document.getElementById("geometry").value;
      try { await navigator.clipboard.writeText(value); notice("JSON copiado. Valide as vias públicas e o condomínio antes de aprovar."); }
      catch (e) { document.getElementById("geometry").focus(); document.getElementById("geometry").select(); notice("Selecione e copie o JSON para conferência."); }
    });
    renderEditor();
  }
  function mapsReady() {
    try {
      if (!window.google || !google.maps || !safeCenter()) throw Error("Mapa ou coordenadas indisponíveis.");
      map = new google.maps.Map(mapElement, {
        center: center, zoom: Number(config.overviewZoom) || 15.5,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: true,
        scaleControl: false, clickableIcons: false, gestureHandling: "greedy",
        isFractionalZoomEnabled: true, backgroundColor: "#e2e8e1"
      });
      new google.maps.Marker({ position: center, map: map, title: "SEST SENAT — área do evento" });
      fallback.hidden = true;
      if (editing) {
        initEditor();
        notice("Modo de conferência local: o traçado ainda não está aprovado para orientação pública.");
        return;
      }
      if (!approved) throw Error("Trechos não aprovados.");
      redLine = new google.maps.Polyline({ map: map, path: config.redRoad.path,
        strokeColor: "#c93645", strokeOpacity: 0.0, strokeWeight: 8, zIndex: 20, visible: false });
      greenLines = config.sideRoads.map(function (road) {
        return new google.maps.Polyline({ map: map, path: road.path,
          strokeColor: "#17845a", strokeOpacity: 0.0, strokeWeight: 8, zIndex: 15, visible: false });
      });
      mapElement.addEventListener("pointerdown", stopForInteraction, { passive: true });
      mapElement.addEventListener("wheel", stopForInteraction, { passive: true });
      map.addListener("dragstart", stopForInteraction);
      replayBtn.hidden = false;
      play();
    } catch (e) {
      if (!editing) fallback.hidden = false;
      notice("A animação aguarda configuração da API e validação das vias públicas. O Google Maps abaixo permanece interativo.");
      message("Orientação de estacionamento", "Evite a Rua Mato Grosso e prefira vias públicas laterais permitidas.");
    }
  }
  window.portalParkingMapReady = mapsReady;
  window.gm_authFailure = function () {
    fallback.hidden = false;
    notice("Google Maps JavaScript API não autorizada. Confira a chave, o faturamento e as restrições de domínio.");
  };
  replayBtn.addEventListener("click", play);
  document.getElementById("recordButton").addEventListener("click", function () {
    var u = new URL(location.href);
    u.searchParams.delete("editor");
    u.searchParams.set("gravar", "1");
    location.href = u.toString();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && playing) { stop(); replayBtn.hidden = false; }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key.toLowerCase() === "r" && !editing && approved) play();
  });
  if (recording && !editing) document.body.classList.add("record");
  if (!safeCenter()) {
    notice("Coordenadas de referência inválidas. Consulte o local pelo Google Maps.");
    return;
  }
  var key = String(config.googleMapsApiKey || "").trim();
  if (!key || key === "YOUR_API_KEY") {
    notice(editing ?
      "O editor geográfico precisa de chave Maps JavaScript API restrita ao domínio do projeto. Nenhuma chave foi configurada." :
      "Prévia interativa. A animação será ativada após configurar a API e validar os trechos públicos. Evite estacionar na Rua Mato Grosso.");
    return;
  }
  if (!editing && !approved) {
    notice("Linhas vermelhas e verdes ainda não foram aprovadas. O mapa real permanece disponível sem indicações geográficas não verificadas.");
    return;
  }
  var script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.referrerPolicy = "origin";
  script.src = "https://maps.googleapis.com/maps/api/js?key=" +
    encodeURIComponent(key) + "&v=weekly&loading=async&callback=portalParkingMapReady";
  script.onerror = function () {
    fallback.hidden = false;
    notice("Falha ao carregar a Maps JavaScript API. Utilize o mapa incorporado ou abra o Google Maps.");
  };
  document.head.appendChild(script);
  setTimeout(function () {
    if (!map) notice("O mapa avançado não respondeu. Verifique as permissões e a disponibilidade da API.");
  }, 12000);
})();
