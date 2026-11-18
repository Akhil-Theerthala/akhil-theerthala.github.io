import { MapView, clip, escape, loadMap, showAreaTooltip, showTooltip, sourceHref } from "./map.js";

window.__siteReady = true;

const html = document.documentElement;
const root = html.dataset.root || "";
const page = html.dataset.page;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ---------- Theme ---------- */

const themeColour = () =>
  $('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(html).getPropertyValue("--bg").trim());
themeColour();

// The page follows the system setting. The switch stores an override, which
// is dropped as soon as the system and the override agree again.
const OVERRIDE = "theme-override";
const scheme = matchMedia("(prefers-color-scheme: dark)");
const systemTheme = () => (scheme.matches ? "dark" : "light");
const override = () => {
  try {
    const value = localStorage.getItem(OVERRIDE);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};
const keep = (theme) => {
  try {
    if (theme === systemTheme()) localStorage.removeItem(OVERRIDE);
    else localStorage.setItem(OVERRIDE, theme);
  } catch {}
};

function applyTheme(next) {
  // Every colour changes at once. Each element's own transitions are held for
  // the swap, so nothing smears: the fade, where there is one, is of the page
  // as a whole.
  html.classList.add("no-transitions");
  html.dataset.theme = next;
  themeColour();
  dispatchEvent(new Event("themechange"));
  void html.offsetWidth;
  requestAnimationFrame(() => html.classList.remove("no-transitions"));
}

function setTheme(next) {
  if (html.dataset.theme === next) return;
  // The page cross-fades from one theme to the other as a single picture.
  // Without view transitions, or with reduced motion, it swaps at once.
  if (!document.startViewTransition || reducedMotion()) return applyTheme(next);
  document.startViewTransition(() => applyTheme(next));
}

$(".theme-toggle")?.addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  keep(next);
  setTheme(next);
});

scheme.addEventListener("change", () => {
  const chosen = override();
  if (chosen) keep(chosen);
  setTheme(override() || systemTheme());
});

/* ---------- Pages ---------- */

if (page === "home") {
  roles();
  workTable();
  homeMap();
  regions();
}

if (page === "map") {
  loadMap(root)
    .then(mapPage)
    .catch((error) => console.warn("Map unavailable:", error));
}

if (page === "article" || page === "artifact") article();

/* ---------- Home: roles open in place ---------- */

function roles() {
  $$(".what > button[aria-controls]").forEach((button) =>
    button.addEventListener("click", () => {
      button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true"));
    }),
  );
}

/* ---------- Home: the projects' table under the map ---------- */

function openWorkTable(open) {
  const section = $("#work");
  const button = $(".disclose button", section);
  if (!section || !button) return;
  section.dataset.table = open ? "open" : "closed";
  button.setAttribute("aria-expanded", String(open));
  button.firstChild.textContent = button.firstChild.textContent.replace(/^(Show|Hide)/, open ? "Hide" : "Show");
}

// A row inside the closed table has to be shown before the page can go to it.
function goTo(target, smooth = true) {
  if (target.closest("#work-table")) openWorkTable(true);
  target.scrollIntoView({ behavior: smooth && !reducedMotion() ? "smooth" : "auto", block: "center" });
  const row = target.closest("[data-row]");
  if (!row) return;
  row.classList.add("flash");
  setTimeout(() => row.classList.toggle("flash", false), 1800);
}

function workTable() {
  const button = $("#work .disclose button");
  if (!button) return;
  button.addEventListener("click", () => openWorkTable(button.getAttribute("aria-expanded") !== "true"));
  // Links from the map page and from search land on rows that may be closed.
  const fromHash = () => {
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && target.closest("#work-table")) goTo(target, false);
  };
  addEventListener("hashchange", fromHash);
  fromHash();
}

/* ---------- Home: the map in Selected work ---------- */

function homeMap() {
  const canvas = $('canvas[data-map="home"]');
  if (!canvas) return;
  const tooltip = $(".map-tooltip", canvas.parentElement);
  const hideTooltip = () => tooltip.classList.toggle("on", false);
  const start = (data) => {
    const view = new MapView(canvas, data, {
      inset: (w) =>
        w > 720
          ? { left: 44, top: 40, right: 44, bottom: 48 }
          : { left: 20, top: 24, right: 20, bottom: 30 },
      onHover: (index, touch) => showTooltip(tooltip, view, index, touch),
      onHoverArea: (area) => showAreaTooltip(tooltip, view, area),
      onDragStart: hideTooltip,
      // Works on this page open in place; the rest go to their own page.
      onOpen: (work) => {
        const target = work.href.startsWith("#") && document.getElementById(work.href.slice(1));
        if (!target) return false;
        hideTooltip();
        goTo(target);
        history.replaceState(null, "", work.href);
        return true;
      },
    });
  };
  // The map's data is fetched once the section is near.
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadMap(root)
        .then(start)
        .catch((error) => console.warn("Map unavailable:", error));
    },
    { rootMargin: "800px 0px" },
  ).observe(canvas);
}

/* ---------- Home: layout regions ---------- */

// One box per labelled region, one per table row, and the column edges, all
// measured from the page itself. Nothing here comes from a model.
function regions() {
  const sheet = $("#sheet");
  const layer = $(".regions", sheet);
  const toggle = $("#regions-switch");
  if (!layer || !toggle) return;
  const PAD = 6;

  function build() {
    const base = sheet.getBoundingClientRect();
    const parts = [];
    let i = 0;
    const add = (className, rect, grow, label, atEnd) => {
      const box = document.createElement("div");
      box.className = className;
      box.style.cssText = `left:${rect.left - base.left - grow}px;top:${rect.top - base.top - grow}px;width:${rect.width + grow * 2}px;height:${rect.height + grow * 2}px;--i:${i}`;
      parts.push(box);
      if (label) {
        const tag = document.createElement("span");
        tag.className = atEnd ? "rt end" : "rt";
        tag.textContent = label;
        tag.style.cssText = `left:${(atEnd ? rect.right + grow : rect.left - grow) - base.left}px;top:${rect.top - base.top - grow - 20}px;--i:${i}`;
        parts.push(tag);
      }
      i += 1;
    };
    $$("[data-region]", sheet).forEach((element) => {
      const rect = element.getBoundingClientRect();
      // A closed table has no box to draw.
      if (!rect.width && !rect.height) return;
      // A figure's tag sits at its far corner, clear of the heading above it.
      if (element.dataset.region !== "table") return add("rg", rect, PAD, element.dataset.region, element.dataset.region === "figure");
      const rows = $$("[data-row]", element);
      const heads = $$('[role="columnheader"]', element);
      const stacked = getComputedStyle(rows[0]).gridTemplateColumns.split(" ").length < 2;
      const cols = stacked ? 1 : heads.length;
      add("rg", rect, PAD, `table, ${rows.length} rows by ${cols} ${cols === 1 ? "column" : "columns"}`, true);
      rows.forEach((row) => add("rg row", row.getBoundingClientRect(), 0));
      if (stacked) return;
      heads.slice(1).forEach((head) => {
        const line = document.createElement("div");
        line.className = "rc";
        line.style.cssText = `left:${head.getBoundingClientRect().left - 12 - base.left}px;top:${rect.top - base.top - PAD}px;height:${rect.height + PAD * 2}px;--i:${i}`;
        parts.push(line);
      });
    });
    layer.replaceChildren(...parts);
  }

  let touched = false;
  const show = (on) => {
    sheet.dataset.regions = on ? "on" : "off";
    toggle.setAttribute("aria-checked", String(on));
  };
  toggle.addEventListener("click", () => {
    touched = true;
    show(toggle.getAttribute("aria-checked") !== "true");
  });

  new ResizeObserver(build).observe(sheet);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    build();
    // The one staged moment: the page is read once per visit, then left alone.
    let seen = false;
    try {
      seen = sessionStorage.getItem("regions-intro") === "seen";
      sessionStorage.setItem("regions-intro", "seen");
    } catch {}
    if (seen || reducedMotion()) return;
    setTimeout(() => !touched && show(true), 450);
    setTimeout(() => !touched && show(false), 3600);
  });
}

/* ---------- The map page ---------- */

function mapPage(data) {
  const canvas = $('canvas[data-map="page"]');
  const tooltip = $(".map-stage .map-tooltip");
  const view = new MapView(canvas, data, {
    idle: true,
    inset: (w, h) =>
      w > 720
        ? { left: 56, top: h * 0.1, right: 56, bottom: h * 0.1 }
        : { left: 24, top: 28, right: 24, bottom: 28 },
    onHover: (index, touch) => showTooltip(tooltip, view, index, touch),
    onHoverArea: (area) => showAreaTooltip(tooltip, view, area),
    onDragStart: () => tooltip.classList.toggle("on", false),
  });

  $$("[data-kind]").forEach((chip) =>
    chip.addEventListener("click", () => {
      const on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", String(on));
      const kinds = new Set($$("[data-kind]").filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.kind));
      view.setKinds(kinds);
    }),
  );

  search(view, data);
}

function search(view, data) {
  const input = $("#map-search-input");
  const list = $("#map-search-results");
  if (!input) return;
  let results = [];
  let selected = -1;

  const terms = (query) =>
    query.toLowerCase().split(/[^a-z0-9.+-]+/).filter((term) => term.length > 1);

  function run() {
    const words = terms(input.value);
    if (!words.length) {
      results = [];
      view.setMatches(null);
      list.hidden = true;
      return;
    }
    results = data.points
      .map(([, , sourceIndex, , passage], index) => {
        const source = data.sources[sourceIndex];
        const text = passage.toLowerCase();
        const title = source.title.toLowerCase();
        let score = 0;
        for (const word of words) {
          const inText = text.includes(word);
          const inTitle = title.includes(word);
          if (!inText && !inTitle) return null;
          score += (inText ? 1 : 0) + (inTitle ? 2 : 0);
        }
        return { index, score, source };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
    view.setMatches(results.map((result) => data.points[result.index][6]).filter((work) => work >= 0));
    selected = -1;
    render(words);
  }

  // A window of the passage around the first match.
  function excerpt(text, words) {
    const lower = text.toLowerCase();
    const at = Math.min(...words.map((word) => lower.indexOf(word)).filter((i) => i >= 0), Infinity);
    if (!Number.isFinite(at) || at < 80) return clip(text, 180);
    const start = text.lastIndexOf(" ", at - 50) + 1;
    return `…${clip(text.slice(start), 170)}`;
  }

  function highlight(text, words) {
    let out = escape(text);
    for (const word of words) {
      out = out.replace(new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
    }
    return out;
  }

  function render(words) {
    list.hidden = false;
    if (!results.length) {
      list.innerHTML = `<li class="empty">Nothing on the map mentions that. Try a broader word.</li>`;
      return;
    }
    // One result per source keeps the list varied.
    const seen = new Set();
    const top = results.filter((result) => !seen.has(result.source.id) && seen.add(result.source.id)).slice(0, 6);
    list.innerHTML = top
      .map((result, i) => {
        const [, , , area, passage, anchor] = data.points[result.index];
        const colour = area >= 0 ? view.colours.area[area] : view.colours.muted;
        return `<li role="option" id="result-${i}"><a href="${escape(sourceHref(root, result.source, anchor))}" data-index="${result.index}"><b><i style="background:${colour}"></i>${escape(result.source.title)}</b><span>${highlight(excerpt(passage, words), words)}</span></a></li>`;
      })
      .join("");
    const works = new Set(results.map((result) => data.points[result.index][6]).filter((work) => work >= 0)).size;
    list.insertAdjacentHTML("beforeend", `<li class="empty">${results.length} matching passage${results.length === 1 ? "" : "s"} in ${works} work${works === 1 ? "" : "s"}, highlighted on the map</li>`);
  }

  input.addEventListener("input", run);
  input.addEventListener("keydown", (event) => {
    const links = $$("a", list);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selected = (selected + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links.forEach((link, i) => link.setAttribute("aria-selected", String(i === selected)));
      input.setAttribute("aria-activedescendant", `result-${selected}`);
    } else if (event.key === "Enter" && links.length) {
      event.preventDefault();
      (links[selected] || links[0]).click();
    } else if (event.key === "Escape") {
      input.value = "";
      run();
    }
  });
  list.addEventListener("mouseover", (event) => {
    const link = event.target.closest("a[data-index]");
    if (link) view.focus(data.points[Number(link.dataset.index)][6]);
  });
  list.addEventListener("mouseleave", () => view.focus(-1));
  addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
      event.preventDefault();
      input.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".map-search")) list.hidden = true;
  });
  input.addEventListener("focus", () => input.value && run());
}

/* ---------- Article and artifact pages ---------- */

function flash(target) {
  target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
  target.classList.add("flash");
  setTimeout(() => target.classList.remove("flash"), 1800);
  history.replaceState(null, "", `#${target.id}`);

  // Essay images have no fixed size, so they shift the page as they load.
  // Keep the passage centred until they settle or the reader scrolls.
  const prose = target.closest(".prose");
  if (!prose) return;
  const observer = new ResizeObserver(() => target.scrollIntoView({ block: "center" }));
  const stop = () => {
    observer.disconnect();
    ["wheel", "touchstart", "keydown"].forEach((type) => removeEventListener(type, stop));
  };
  setTimeout(() => observer.observe(prose), 600);
  setTimeout(stop, 4000);
  ["wheel", "touchstart", "keydown"].forEach((type) => addEventListener(type, stop, { passive: true }));
}

function article() {
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && target.id.startsWith("p-")) setTimeout(() => flash(target), 300);

  const links = $$(".toc a");
  if (!links.length) return;
  const byId = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const first = document.getElementById(byId.keys().next().value);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Above the first heading, nothing in the contents is current.
        if (entry.target === first && !entry.isIntersecting && entry.boundingClientRect.top > 0) {
          links.forEach((link) => link.classList.remove("active"));
        }
        if (!entry.isIntersecting) continue;
        links.forEach((link) => link.classList.remove("active"));
        byId.get(entry.target.id)?.classList.add("active");
      }
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );
  byId.forEach((_, id) => {
    const heading = document.getElementById(id);
    if (heading) observer.observe(heading);
  });
}
