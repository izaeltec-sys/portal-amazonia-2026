"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const fmt = n => Number(n || 0).toLocaleString("pt-BR");
  const groups = ["5KM", "PCD", "KIDS", "ESCOLAR"];
  const labels = { "5KM": "5 KM", PCD: "PCD · 5 km", KIDS: "Kids", ESCOLAR: "Escolar · 5 km" };
  const colors = { "5KM": "#07583e", PCD: "#c69b39", KIDS: "#49a078", ESCOLAR: "#8d9e85" };
  const state = { rows: [], grupo: "ALL", sexo: "ALL", faixa: "ALL", cidade: "ALL", equipe: "ALL", busca: "", show: 24 };
  const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
  const normalize = v => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const money = n => Number(n || 0);
  const create = (tag, cls, content) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content != null) el.textContent = String(content);
    return el;
  };
  const show = (id, visible) => { $(id).hidden = !visible; };

  function groupRows() {
    return state.rows.filter(r => state.grupo === "ALL" || state.grupo === r.grupo);
  }
  function genderRows() {
    return groupRows().filter(r => state.sexo === "ALL" || r.naipe === state.sexo);
  }
  function filteredRows() {
    const q = normalize(state.busca);
    return genderRows().filter(r => {
      if (state.faixa !== "ALL" && r.faixa !== state.faixa) return false;
      if (state.cidade !== "ALL" && r.cidade !== state.cidade) return false;
      if (state.equipe !== "ALL" && r.equipe !== state.equipe) return false;
      if (q && !normalize([r.nome, r.cidade, r.uf, r.equipe, r.faixa].join(" ")).includes(q)) return false;
      return true;
    });
  }
  function countBy(rows, key) {
    const counts = new Map();
    for (const r of rows) {
      const label = String(r[key] || "").trim();
      if (label) counts.set(label, (counts.get(label) || 0) + 1);
    }
    return [...counts].sort((a,b) => b[1] - a[1] || collator.compare(a[0], b[0]));
  }
  function updateSelect(id, values, allLabel, key) {
    const el = $(id);
    const choices = [...new Set(values.filter(Boolean))].sort(collator.compare);
    el.replaceChildren();
    const all = create("option", "", allLabel);
    all.value = "ALL";
    el.append(all);
    for (const v of choices) {
      const option = create("option", "", v === "Geral" ? "Geral (sem faixa)" : v);
      option.value = v;
      el.append(option);
    }
    if (!choices.includes(state[key])) state[key] = "ALL";
    el.value = state[key];
    if (id === "ageFilter") {
      el.disabled = choices.length < 2;
      $("ageFilterHint").textContent = choices.length < 2
        ? "Sem divisão de faixas neste grupo."
        : "Faixas válidas para o grupo e sexo selecionados.";
    }
  }
  function updateOptions() {
    const source = genderRows();
    updateSelect("ageFilter", source.map(r => r.faixa), "Todas as faixas etárias", "faixa");
    updateSelect("cityFilter", source.map(r => r.cidade), "Todas as cidades", "cidade");
    updateSelect("teamFilter", source.map(r => r.equipe), "Todas as equipes", "equipe");
  }
  function setGroup(group) {
    state.grupo = group;
    state.sexo = "ALL"; state.faixa = "ALL"; state.cidade = "ALL"; state.equipe = "ALL";
    state.show = 24;
    updateOptions();
    render();
  }
  function setGender(gender) {
    state.sexo = gender;
    state.faixa = "ALL"; state.cidade = "ALL"; state.equipe = "ALL";
    state.show = 24;
    updateOptions();
    render();
  }
  function clear() {
    state.busca = "";
    $("nameSearch").value = "";
    setGroup("ALL");
  }

  function renderGroupCards() {
    $("totalCount").textContent = fmt(state.rows.length);
    $("donutMobileTotal").textContent = fmt(state.rows.length);
    const counts = Object.fromEntries(groups.map(g=>[g,0]));
    for (const r of state.rows) counts[r.grupo] += 1;
    const container = $("groupCards");
    container.replaceChildren();
    for (const group of groups) {
      const card = create("button", "stat-card" + (group === state.grupo ? " selected" : ""));
      card.type = "button";
      card.style.setProperty("--group-color", colors[group]);
      card.setAttribute("aria-pressed", String(state.grupo === group));
      card.setAttribute("aria-label", "Filtrar " + labels[group] + ": " + counts[group] + " inscritos");
      const top = create("span", "stat-kicker", labels[group]);
      const bottom = create("span", "stat-value", fmt(counts[group]));
      const small = create("span", "stat-caption", group === "5KM" ? "Prova principal" : "Inscritos confirmados");
      card.append(top, bottom, small);
      card.addEventListener("click", () => setGroup(state.grupo === group ? "ALL" : group));
      container.append(card);
    }
    $("allGroups").setAttribute("aria-pressed", String(state.grupo === "ALL"));
    const degrees = [];
    let pos = 0;
    for (const group of groups) {
      const end = pos + counts[group] / Math.max(1, state.rows.length) * 360;
      degrees.push(colors[group] + " " + pos.toFixed(2) + "deg " + end.toFixed(2) + "deg");
      pos = end;
    }
    $("donut").style.background = "conic-gradient(" + degrees.join(",") + ")";
    const legend = $("donutLegend");
    legend.replaceChildren();
    for (const group of groups) {
      const row = create("button", "legend-item" + (state.grupo === group ? " selected" : ""));
      row.type = "button";
      const dot = create("i", "legend-dot"); dot.style.backgroundColor = colors[group];
      row.append(dot, create("span", "legend-name", labels[group]), create("strong", "legend-number", fmt(counts[group])));
      row.addEventListener("click", () => setGroup(state.grupo === group ? "ALL" : group));
      legend.append(row);
    }
  }
  function renderGender() {
    const rows = groupRows();
    const counts = { Masculino: 0, Feminino: 0 };
    for (const r of rows) if (counts[r.naipe] !== undefined) counts[r.naipe] += 1;
    const options = [
      ["ALL", "Todos", rows.length],
      ["Masculino", "Masculino", counts.Masculino],
      ["Feminino", "Feminino", counts.Feminino]
    ];
    const target = $("genderOptions");
    target.replaceChildren();
    for (const [value,label,count] of options) {
      const button = create("button", "gender-chip" + (state.sexo === value ? " selected" : ""));
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.sexo === value));
      button.append(create("span", "", label), create("b", "", fmt(count)));
      button.addEventListener("click", () => setGender(value));
      target.append(button);
    }
    $("genderHelp").textContent = "Sexo de todos os inscritos confirmado pelo RaceTagPro da Agito: " + fmt(counts.Feminino) + " femininos e " + fmt(counts.Masculino) + " masculinos neste grupo.";
  }
  function drawBars(target, pairs, limit, onSelect) {
    target.replaceChildren();
    if (!pairs.length) {
      target.append(create("p", "muted", "Nenhum registro com os filtros escolhidos."));
      return;
    }
    const max = Math.max(1, ...pairs.map(x => x[1]));
    const list = limit ? pairs.slice(0, limit) : pairs;
    for (const [label, num] of list) {
      const clickable = typeof onSelect === "function";
      const item = create(clickable ? "button" : "div", "bar-item");
      if (clickable) {
        item.type = "button";
        item.title = "Filtrar por " + label;
        item.setAttribute("aria-label", "Filtrar por " + label + ": " + fmt(num) + " atletas");
        item.addEventListener("click", () => {
          onSelect(label);
          $("resultsTitle").scrollIntoView({behavior: "smooth", block: "start"});
        });
      }
      // A classe deve corresponder ao CSS: bar-line e bar-number.
      // Rótulo e quantidade ficam em colunas independentes, inclusive no celular.
      const caption = create("div", "bar-line");
      caption.append(
        create("span", "bar-label", label === "Geral" ? "Geral (sem faixa)" : label),
        create("strong", "bar-number", fmt(num))
      );
      const track = create("div", "bar-track");
      const fill = create("div", "bar-fill");
      fill.style.width = (100 * num / max).toFixed(2) + "%";
      track.append(fill);
      item.append(caption, track);
      target.append(item);
    }
  }
  function setAgeBar(group, faixa) {
    // A opção "Geral" nunca deve somar Escolar e PCD como se fossem a
    // mesma categoria: o grupo é selecionado primeiro.
    if (state.grupo !== group) {
      state.grupo = group;
      state.cidade = "ALL";
      state.equipe = "ALL";
    }
    state.faixa = faixa;
    state.show = 24;
    updateOptions();
    render();
  }
  function renderInsights(rows) {
    $("filteredMetric").textContent = fmt(rows.length);
    $("filteredDescription").textContent = rows.length === state.rows.length
      ? "Todas as inscrições"
      : "Correspondem aos filtros";
    const cities = countBy(rows, "cidade");
    $("citiesMetric").textContent = fmt(cities.length);
    const teams = countBy(rows, "equipe");
    $("teamsMetric").textContent = fmt(teams.length);
    drawBars($("cityBars"), cities, 7);

    // Em "Todos", as quatro modalidades aparecem separadamente e no topo
    // do gráfico, incluindo Escolar e PCD. Ao filtrar, as quantidades
    // acompanham os filtros de sexo, faixa, cidade e equipe.
    const byGroup = new Map(groups.map(g => [g, 0]));
    for (const r of rows) byGroup.set(r.grupo, byGroup.get(r.grupo) + 1);
    const categoryPairs = groups
      .filter(g => byGroup.get(g) > 0)
      .map(g => [labels[g], byGroup.get(g)]);
    drawBars($("categoryBars"), categoryPairs, 0, label => {
      const group = groups.find(g => labels[g] === label);
      if (group) setGroup(group);
    });

    // Faixas só existem nas modalidades 5 KM e KIDS; Escolar e PCD
    // permanecem identificadas no resumo acima, nunca em "Geral" agregado.
    const ageCounts = new Map();
    const ageMeta = new Map();
    for (const r of rows) {
      if (r.grupo !== "5KM" && r.grupo !== "KIDS") continue;
      const label = state.grupo === "ALL"
        ? (r.grupo === "5KM" ? "5 KM · " : "Kids · ") + r.faixa
        : r.faixa;
      ageCounts.set(label, (ageCounts.get(label) || 0) + 1);
      ageMeta.set(label, { group: r.grupo, faixa: r.faixa });
    }
    const agePairs = [...ageCounts].sort((a, b) =>
      b[1] - a[1] || collator.compare(a[0], b[0])
    );
    const hasAges = agePairs.length > 0;
    $("ageBarsTitle").hidden = !hasAges;
    $("ageBars").hidden = !hasAges;
    drawBars($("ageBars"), agePairs, 0, label => {
      const target = ageMeta.get(label);
      if (target) setAgeBar(target.group, target.faixa);
    });

    $("ageChartTitle").textContent = state.grupo === "ALL"
      ? "Categorias e faixas etárias"
      : "Distribuição · " + labels[state.grupo];
    $("ageChartDescription").textContent = hasAges
      ? "Toque em uma categoria ou faixa etária para filtrar os atletas."
      : "Esta categoria não tem subdivisão de faixas na lista pública.";
    $("categoryBarsTitle").textContent = state.grupo === "ALL"
      ? "Categorias da prova"
      : "Categoria selecionada";
    $("ageBarsTitle").textContent = state.grupo === "ALL"
      ? "Faixas etárias · 5 KM e KIDS"
      : "Faixas etárias";
  }
  function athleteCard(r) {
    const card = create("article","athlete-card");
    card.setAttribute("role","listitem");
    const title = create("h3","athlete-name",r.nome);
    if(r.sem_nome) title.classList.add("missing");
    const group = create("span","group-pill",labels[r.grupo]);
    const top = create("div","athlete-top"); top.append(title,group);
    const details = create("div","athlete-details");
    const faixa = r.faixa === "Geral" ? "Geral" : "Faixa " + r.faixa;
    details.append(create("span","",faixa));
    details.append(create("span","",r.naipe));
    const city = [r.cidade,r.uf].filter(Boolean).join(" / ");
    if(city) details.append(create("span","",city));
    if(r.equipe) details.append(create("span","","Equipe: "+r.equipe));
    if(r.numero) details.append(create("span","","Nº "+r.numero));
    card.append(top,details);
    return card;
  }
  function renderList(rows) {
    $("resultCount").textContent = fmt(rows.length) + " " + (rows.length===1?"inscrito encontrado":"inscritos encontrados");
    const list=$("list");list.replaceChildren();
    rows.slice(0,state.show).forEach(r=>list.append(athleteCard(r)));
    show("noMatches",rows.length===0);
    show("loadMore",rows.length>state.show);
    $("loadMore").textContent="Mostrar mais "+Math.min(24,rows.length-state.show)+" inscritos";
  }
  function render() {
    renderGroupCards();
    renderGender();
    const rows=filteredRows();
    renderInsights(rows);
    renderList(rows);
    const clearDisabled=state.grupo==="ALL"&&state.sexo==="ALL"&&state.faixa==="ALL"&&state.cidade==="ALL"&&state.equipe==="ALL"&&!state.busca;
    $("clearFilters").disabled=clearDisabled;
    $("activeSummary").textContent=[
      state.grupo==="ALL"?"Todos os grupos":labels[state.grupo],
      state.sexo==="ALL"?"Todos os sexos":state.sexo,
      state.faixa==="ALL"?"Todas as faixas":state.faixa==="Geral"?"Geral":state.faixa
    ].join(" · ");
  }
  function wire() {
    $("allGroups").addEventListener("click",()=>setGroup("ALL"));
    $("clearFilters").addEventListener("click",clear);
    $("nameSearch").addEventListener("input",e=>{state.busca=e.target.value;state.show=24;render()});
    for (const [id,key] of [["ageFilter","faixa"],["cityFilter","cidade"],["teamFilter","equipe"]]) {
      $(id).addEventListener("change",e=>{state[key]=e.target.value;state.show=24;render()});
    }
    $("loadMore").addEventListener("click",()=>{state.show+=24;render()});
  }
  function validate(data) {
    if(!data||data.versao!==3||!Array.isArray(data.inscritos)||data.inscritos.length!==data.total||
       !Number.isInteger(data.total)||!data.atualizado_em)throw Error("Snapshot incompleto");
    const actual=Object.fromEntries(groups.map(g=>[g,0]));
    for(const r of data.inscritos){
      if(!r||!groups.includes(r.grupo)||typeof r.nome!=="string"||typeof r.faixa!=="string"||
         !["Masculino","Feminino"].includes(r.naipe))throw Error("Inscrito inválido");
      if(!Number.isInteger(r.numero)||r.numero<1)throw Error("Número de peito inválido");
      actual[r.grupo]+=1;
    }
    for(const g of groups)if(actual[g]!==data.totais_por_grupo[g])throw Error("Contagens divergentes");
    if(!data.totais_por_sexo || data.totais_por_sexo.Feminino + data.totais_por_sexo.Masculino !== data.total) throw Error("Total por sexo divergente");
    return data;
  }
  async function init() {
    wire();
    const sources=[
      "https://raw.githubusercontent.com/izaeltec-sys/portal-amazonia-2026/main/central/inscritos/dados.json",
      "./dados.json"
    ];
    let data;
    for(const url of sources){
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),6500);
      try{
        const r=await fetch(url,{cache:"no-store",signal:controller.signal});
        if(!r.ok)throw Error("Falha HTTP "+r.status);
        data=validate(await r.json());
        break;
      }catch(e){ /* segunda fonte serve como fallback */ }
      finally{clearTimeout(timeout)}
    }
    show("loading",false);
    if(!data){
      show("error",true);
      return;
    }
    state.rows=data.inscritos;
    updateOptions();
    const date=new Date(data.atualizado_em);
    $("lastUpdate").textContent=Number.isNaN(+date)?"Atualização não informada":
      "RaceTagPro (Agito) atualizado em "+date.toLocaleString("pt-BR",{
        timeZone:"America/Porto_Velho",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"
      })+" (RO)";
    $("missingNames").textContent=data.sem_nome
      ? fmt(data.sem_nome)+" inscrição(ões) não possuem nome público na Agito, mas estão incluídas nas estatísticas."
      : "";
    show("dashboard",true);
    render();
  }
  init();
})();