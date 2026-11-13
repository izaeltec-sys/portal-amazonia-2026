"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const groups = ["ADULTO", "ESCOLAR", "PCD", "KIDS"];
  const pretty = { ADULTO: "Adulto · 5 km", ESCOLAR: "Escolar · 5 km", PCD: "PCD · 5 km", KIDS: "Kids" };
  const state = { rows: [], grupo: "TODOS", categoria: "TODAS", cidade: "TODAS", equipe: "TODAS", naipe: "TODOS", busca: "", show: 30 };
  const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
  const normalize = text => String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const show = (el, visible) => { el.hidden = !visible; };
  const fmt = value => Number(value || 0).toLocaleString("pt-BR");

  function node(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = String(text);
    return e;
  }
  function fieldOptions(id, entries, allLabel, current) {
    const select = $(id);
    select.replaceChildren();
    const all = node("option", "", allLabel);
    all.value = "TODAS";
    select.appendChild(all);
    entries.forEach(value => {
      const o = node("option", "", value);
      o.value = value;
      select.appendChild(o);
    });
    select.value = entries.includes(current) ? current : "TODAS";
    return select.value;
  }
  function refreshOptions() {
    const byGroup = state.rows.filter(r => state.grupo === "TODOS" || r.grupo === state.grupo);
    const unique = key => [...new Set(byGroup.map(r => r[key]).filter(Boolean))].sort(collator.compare);
    state.categoria = fieldOptions("categoryFilter", unique("categoria"), "Todas as faixas / categorias", state.categoria);
    state.cidade = fieldOptions("cityFilter", unique("cidade"), "Todas as cidades", state.cidade);
    state.equipe = fieldOptions("teamFilter", unique("equipe"), "Todas as equipes", state.equipe);
  }
  function currentRows() {
    const term = normalize(state.busca);
    return state.rows.filter(r => {
      if (state.grupo !== "TODOS" && r.grupo !== state.grupo) return false;
      if (state.categoria !== "TODAS" && r.categoria !== state.categoria) return false;
      if (state.cidade !== "TODAS" && r.cidade !== state.cidade) return false;
      if (state.equipe !== "TODAS" && r.equipe !== state.equipe) return false;
      if (state.naipe !== "TODOS" && r.naipe !== state.naipe) return false;
      if (term && !normalize([r.nome, r.categoria, r.cidade, r.uf, r.equipe].join(" ")).includes(term)) return false;
      return true;
    });
  }
  function countBy(rows, key) {
    const map = new Map();
    rows.forEach(r => {
      const label = String(r[key] || "").trim();
      if (label) map.set(label, (map.get(label) || 0) + 1);
    });
    return [...map].sort((a, b) => b[1] - a[1] || collator.compare(a[0], b[0]));
  }
  function drawBars(target, items, maxBars, clickable) {
    target.replaceChildren();
    if (!items.length) {
      target.appendChild(node("p", "muted small", "Sem dados para os filtros escolhidos."));
      return;
    }
    const max = Math.max(...items.map(x => x[1]), 1);
    const limit = maxBars ? items.slice(0, maxBars) : items;
    limit.forEach(([label, count]) => {
      const item = node(clickable ? "button" : "div", "bar-item");
      if (clickable) {
        item.type = "button";
        item.title = "Filtrar pela categoria " + label;
        item.addEventListener("click", () => {
          state.categoria = label;
          $("categoryFilter").value = label;
          state.show = 30;
          render();
          $("resultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      const top = node("div", "bar-line");
      top.append(node("span", "bar-label", label), node("strong", "bar-number", fmt(count)));
      const track = node("div", "bar-track");
      const fill = node("div", "bar-fill");
      fill.style.width = ((count / max) * 100).toFixed(1) + "%";
      track.appendChild(fill);
      item.append(top, track);
      target.appendChild(item);
    });
  }
  function renderStats() {
    const all = state.rows;
    $("totalCount").textContent = fmt(all.length);
    const main = $("groupCards");
    main.replaceChildren();
    const counts = Object.fromEntries(groups.map(g => [g, 0]));
    all.forEach(r => counts[r.grupo]++);
    groups.forEach(g => {
      const card = node("button", "stat");
      card.type = "button";
      card.setAttribute("aria-pressed", state.grupo === g ? "true" : "false");
      card.setAttribute("aria-label", "Filtrar " + pretty[g] + ": " + fmt(counts[g]) + " inscrições");
      if (state.grupo === g) card.classList.add("selected");
      card.append(node("span", "stat-name", pretty[g]), node("strong", "stat-number", fmt(counts[g])), node("span", "stat-foot", "inscrições"));
      card.addEventListener("click", () => {
        state.grupo = state.grupo === g ? "TODOS" : g;
        state.categoria = "TODAS"; state.cidade = "TODAS"; state.equipe = "TODAS";
        state.show = 30;
        refreshOptions(); render();
      });
      main.appendChild(card);
    });
    $("allGroups").setAttribute("aria-pressed", state.grupo === "TODOS" ? "true" : "false");
  }
  function entryCard(r) {
    const card = node("article", "athlete");
    card.setAttribute("role", "listitem");
    const top = node("div", "athlete-top");
    const name = node("h3", "athlete-name", r.nome);
    if (r.sem_nome) name.classList.add("unknown");
    const tag = node("span", "athlete-type", r.grupo);
    top.append(name, tag);
    const category = node("div", "athlete-category", pretty[r.grupo] + " · " + r.categoria);
    const detail = node("div", "athlete-meta");
    const city = [r.cidade, r.uf].filter(Boolean).join(" / ");
    if (city) detail.appendChild(node("span", "", city));
    if (r.equipe) detail.appendChild(node("span", "", "Equipe: " + r.equipe));
    if (r.naipe !== "Não informado") detail.appendChild(node("span", "", r.naipe));
    card.append(top, category);
    if (detail.childNodes.length) card.appendChild(detail);
    return card;
  }
  function render() {
    renderStats();
    const rows = currentRows();
    const container = $("list");
    container.replaceChildren();
    rows.slice(0, state.show).forEach(r => container.appendChild(entryCard(r)));
    $("resultCount").textContent = fmt(rows.length) + " inscriç" + (rows.length === 1 ? "ão encontrada" : "ões encontradas");
    show($("noMatches"), rows.length === 0);
    show($("loadMore"), rows.length > state.show);
    $("loadMore").textContent = "Mostrar mais " + Math.min(rows.length - state.show, 30) + " atletas";
    drawBars($("categoryBars"), countBy(rows, "categoria"), 0, true);
    drawBars($("cityBars"), countBy(rows, "cidade"), 8, false);
    $("breakdownHint").textContent = state.grupo === "TODOS"
      ? "Todos os grupos e suas subcategorias na Agito."
      : "Subcategorias do grupo " + pretty[state.grupo] + ".";
    $("naipeHelp").textContent = "A Agito identifica parte das faixas etárias como “Misto”. Isso significa que o sexo não foi informado no registro público, e não uma alteração nas regras da prova.";
    $("clearFilters").disabled = state.grupo === "TODOS" && state.categoria === "TODAS" &&
      state.cidade === "TODAS" && state.equipe === "TODAS" && state.naipe === "TODOS" && !state.busca;
  }
  function reset() {
    state.grupo = "TODOS"; state.categoria = "TODAS"; state.cidade = "TODAS";
    state.equipe = "TODAS"; state.naipe = "TODOS"; state.busca = ""; state.show = 30;
    $("nameSearch").value = ""; $("genderFilter").value = "TODOS";
    refreshOptions(); render();
  }
  function wire() {
    $("allGroups").addEventListener("click", reset);
    $("clearFilters").addEventListener("click", reset);
    $("nameSearch").addEventListener("input", e => { state.busca = e.target.value; state.show = 30; render(); });
    const options = [["categoryFilter", "categoria"], ["cityFilter", "cidade"], ["teamFilter", "equipe"], ["genderFilter", "naipe"]];
    options.forEach(([id, key]) => $(id).addEventListener("change", e => {
      state[key] = e.target.value; state.show = 30; render();
    }));
    $("loadMore").addEventListener("click", () => { state.show += 30; render(); });
  }
  function validate(data) {
    if (!data || data.versao !== 1 || !Array.isArray(data.inscritos) ||
        !Number.isInteger(data.total) || data.total !== data.inscritos.length || !data.atualizado_em)
      throw new Error("Dados de inscrições incompletos.");
    const counts = Object.fromEntries(groups.map(g => [g, 0]));
    for (const r of data.inscritos) {
      if (!r || !groups.includes(r.grupo) || typeof r.nome !== "string" || typeof r.categoria !== "string")
        throw new Error("Registro inválido.");
      counts[r.grupo]++;
    }
    for (const g of groups) {
      if (counts[g] !== data.totais_por_grupo[g]) throw new Error("Contagem divergente: " + g);
    }
    return data;
  }
  async function init() {
    wire();
    try {
      // Commits via GITHUB_TOKEN podem não disparar um novo build do GitHub Pages.
      // O GitHub Raw expõe o JSON atualizado com CORS=* e cache de cerca de 5 min.
      // Um snapshot no próprio Pages serve como fallback quando necessário.
      const sources = [
        "https://raw.githubusercontent.com/izaeltec-sys/portal-amazonia-2026/main/central/inscritos/dados.json",
        "./dados.json"
      ];
      let data = null;
      let lastError = null;
      for (const url of sources) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 7000);
        try {
          const response = await fetch(url, { cache: "no-store", signal: controller.signal });
          if (!response.ok) throw new Error("HTTP " + response.status);
          data = validate(await response.json());
          break;
        } catch (error) {
          lastError = error;
        } finally {
          clearTimeout(timer);
        }
      }
      if (!data) throw (lastError || new Error("Sem dados disponíveis"));
      state.rows = data.inscritos;
      refreshOptions();
      const date = new Date(data.atualizado_em);
      $("lastUpdate").textContent = Number.isNaN(+date) ? "Atualização não informada" :
        "Atualizado em " + date.toLocaleString("pt-BR", {
          timeZone: "America/Porto_Velho", day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        }) + " (horário de Rondônia)";
      $("missingNames").textContent = data.sem_nome
        ? data.sem_nome + " inscrição(ões) sem nome disponível na listagem original da Agito; incluídas nas contagens."
        : "";
      $("loading").hidden = true;
      $("dashboard").hidden = false;
      render();
    } catch (err) {
      $("loading").hidden = true;
      $("error").hidden = false;
      $("errorReason").textContent = "Não foi possível carregar a cópia da lista de inscritos. Tente novamente ou consulte a lista oficial da Agito.";
    }
  }
  init();
})();