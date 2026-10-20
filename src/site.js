import {
  MapView,
  clip,
  cssColours,
  escape,
  loadMap,
  mulberry,
  roundRect,
  showAreaTooltip,
  showTooltip,
  sourceHref,
  withAlpha,
  workOf,
} from "./map.js";

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

$(".theme-toggle")?.addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  themeColour();
  dispatchEvent(new Event("themechange"));
});

/* ---------- Ground spotlight ---------- */

// The background grid brightens around a mouse pointer.
const ground = $(".ground");
if (ground && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frame = 0;
  let x = 0;
  let y = 0;
  addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame || reducedMotion()) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        ground.style.setProperty("--mx", `${x}px`);
        ground.style.setProperty("--my", `${y}px`);
        ground.classList.add("lit");
      });
    },
    { passive: true },
  );
  html.addEventListener("pointerleave", () => ground.classList.remove("lit"));
}

/* ---------- Navigation ---------- */

const nav = $(".site-nav");
const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 12);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Below 980px the section links live in a panel under the header.
const menuToggle = $(".nav-toggle");
if (nav && menuToggle) {
  const isOpen = () => nav.classList.contains("menu-open");
  const setMenu = (open) => {
    nav.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };
  menuToggle.addEventListener("click", () => setMenu(!isOpen()));
  nav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-links a")) setMenu(false);
  });
  document.addEventListener("click", (event) => {
    if (isOpen() && !event.target.closest(".site-nav")) setMenu(false);
  });
  addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  // Past the phone layout the links return to the bar, so the panel closes.
  matchMedia("(min-width: 981px)").addEventListener("change", (event) => event.matches && setMenu(false));
}

// The header's "Email me" is gold only while no other email button is on
// screen: the hero's on the way in, the contact block's at the end.
const navCta = $(".site-nav .nav-cta");
const emailBlocks = $$(".hero-actions, .contact-actions");
if (navCta && emailBlocks.length) {
  const visible = new Set();
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      navCta.classList.toggle("btn-primary", visible.size === 0);
    },
    { rootMargin: "-72px 0px 0px 0px" },
  );
  emailBlocks.forEach((block) => watcher.observe(block));
}

if (page === "home") {
  const links = new Map($$(".nav-links a").map((link) => [link.dataset.section, link]));
  // Every section is watched, so the hero and Education clear the highlight.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link, id) =>
          id === entry.target.id
            ? link.setAttribute("aria-current", "true")
            : link.removeAttribute("aria-current"),
        );
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$("main > section[id]").forEach((section) => observer.observe(section));
}

/* ---------- Reveal ---------- */

const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in");
      revealer.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -8% 0px" },
);
$$(".reveal").forEach((element) => revealer.observe(element));

/* ---------- Copy buttons ---------- */

// The clipboard API needs a secure context and permission; a selected
// textarea with execCommand covers the rest.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = Object.assign(document.createElement("textarea"), { value: text });
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  }
}

$$("[data-copy]").forEach((button) => {
  const label = button.textContent;
  button.addEventListener("click", async () => {
    if (await copyText(button.dataset.copy)) {
      button.textContent = button.dataset.copiedLabel || "Copied";
      button.dataset.copied = "true";
    } else {
      button.textContent = "Couldn't copy";
    }
    setTimeout(() => {
      button.textContent = label;
      delete button.dataset.copied;
    }, 1800);
  });
});

/* ---------- Pages ---------- */

const mapReady = $("canvas[data-map], canvas[data-constellation]")
  ? loadMap(root).catch((error) => {
      console.warn("Map unavailable:", error);
      return null;
    })
  : Promise.resolve(null);

mapReady.then((data) => {
  if (!data) return;
  $$('canvas[data-map="ambient"]').forEach((canvas) => ambient(canvas, data));
  $$("canvas[data-constellation]").forEach((canvas) => constellation(canvas, data));
  if (page === "home") home(data);
  const mini = $('canvas[data-map="mini"]');
  if (mini) miniMap(mini, data);
});

if (page === "home") {
  $$("[data-dvd]").forEach(densityDiversity);
  $$("[data-sparkle]").forEach(sparkle);
}

if (page === "article" || page === "artifact") article();

/* ---------- Homepage map ---------- */

function home(data) {
  const canvas = $('canvas[data-map="hero"]');
  const tooltip = $(".map-stage .map-tooltip");
  const wide = () => innerWidth > 980;
  const view = new MapView(canvas, data, {
    idle: true,
    frame: true,
    inset: (w, h) =>
      wide()
        ? { left: w * 0.46, top: h * 0.1, right: Math.max(48, (w - 1312) / 2 + 16), bottom: h * 0.17 }
        : { left: 24, top: 28, right: 24, bottom: 28 },
    onHover: (index, touch) => showTooltip(tooltip, view, index, touch),
    onHoverArea: (area) => showAreaTooltip(tooltip, view, area),
  });

  $$("[data-kind]").forEach((chip) =>
    chip.addEventListener("click", () => {
      const on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", String(on));
      const kinds = new Set($$("[data-kind]").filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.kind));
      view.setKinds(kinds);
    }),
  );

  // "Show on map" buttons scroll back up and light that work.
  let focusTimer;
  $$("[data-show-source]").forEach((button) =>
    button.addEventListener("click", () => {
      const work = workOf(data, button.dataset.showSource);
      if (work < 0) return;
      $("#top").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      view.focus(work);
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => view.focus(-1), 6000);
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

function miniMap(canvas, data) {
  const work = workOf(data, canvas.dataset.source);
  const readout = canvas.closest(".side-map").querySelector(".mini-readout");
  const resting = readout.innerHTML;
  const view = new MapView(canvas, data, {
    labels: "none",
    animateIn: false,
    drag: false,
    focusWork: work,
    onHover: (w, touch) => {
      if (w < 0) {
        readout.innerHTML = resting;
        return;
      }
      const hovered = data.works[w];
      // This page's own work does not open, so it gets no click hint.
      const hint = w === work ? "" : ` <span style="color:var(--muted)">${touch ? "Tap again to open." : "Click to open."}</span>`;
      readout.innerHTML = `<b><i style="background:${view.colours.area[hovered.area]}"></i>${escape(hovered.title)}</b>${escape(data.areas[hovered.area].name)}.${hint}`;
    },
    // This page's own work stays put instead of reloading the page.
    onOpen: (opened) => opened === data.works[work],
  });

  const nearby = $(`[data-nearby="${CSS.escape(canvas.dataset.source)}"] ol`);
  if (nearby && work >= 0) {
    const own = data.works[work];
    // The curated links first, then the works that share this one's area.
    const related = [...own.links, ...data.works.map((_, w) => w).filter((w) => w !== work && data.works[w].area === own.area)];
    nearby.innerHTML = [...new Set(related)]
      .slice(0, 4)
      .map((w) => data.works[w])
      .map((other) => `<li><a href="${escape(sourceHref(root, other))}"><i style="background:${view.colours.area[other.area]}"></i><span>${escape(other.title)}</span></a></li>`)
      .join("");
  }
}

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

/* ---------- Decorative fields built from the same map ---------- */

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

// The whole map as a quiet field behind the contact card and the 404 page.
function ambient(canvas, data) {
  let running = false;
  const draw = (now = 0) => {
    const { ctx, w, h } = fitCanvas(canvas);
    const colours = cssColours();
    const colour = getComputedStyle(canvas.parentElement).color;
    const t = now * 0.00025;
    ctx.clearRect(0, 0, w, h);
    data.points.forEach(([x, y, , cluster], i) => {
      const px = w * (0.04 + x * 0.92) + Math.sin(t + i) * 3;
      const py = h * (0.06 + y * 0.88) + Math.cos(t * 1.2 + i) * 3;
      ctx.globalAlpha = i % 9 === 0 ? 0.55 : 0.2;
      ctx.fillStyle = i % 9 === 0 && cluster >= 0 ? colours.area[cluster] : colour;
      ctx.beginPath();
      ctx.arc(px, py, i % 9 === 0 ? 2.6 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (running) requestAnimationFrame(draw);
  };
  draw();
  if (!reducedMotion()) {
    new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) requestAnimationFrame(draw);
    }).observe(canvas);
  }
  addEventListener("themechange", () => draw());
  addEventListener("resize", () => draw());
}

// An essay's passages drawn as a constellation, each joined to its nearest neighbour.
function constellation(canvas, data) {
  const id = canvas.dataset.constellation;
  const index = data.sources.findIndex((source) => source.id === id);
  const points = data.points.filter((point) => point[2] === index);
  if (!points.length) return;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const draw = () => {
    const { ctx, w, h } = fitCanvas(canvas);
    const colours = cssColours();
    const pad = 28;
    const place = ([x, y]) => [
      pad + ((x - minX) / (maxX - minX || 1)) * (w - pad * 2),
      pad + ((y - minY) / (maxY - minY || 1)) * (h - pad * 2),
    ];
    const placed = points.map((point) => [...place(point), point[3]]);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = withAlpha(colours.ink, 0.14);
    ctx.lineWidth = 1;
    ctx.beginPath();
    placed.forEach(([x, y], i) => {
      let best = -1;
      let distance = Infinity;
      placed.forEach(([ox, oy], j) => {
        const d = Math.hypot(ox - x, oy - y);
        if (j !== i && d < distance) {
          distance = d;
          best = j;
        }
      });
      if (best >= 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(placed[best][0], placed[best][1]);
      }
    });
    ctx.stroke();
    placed.forEach(([x, y, cluster]) => {
      ctx.fillStyle = cluster >= 0 ? colours.area[cluster] : colours.accent;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  draw();
  addEventListener("themechange", draw);
  addEventListener("resize", draw);
}

// 150 teams, one of them first.
function sparkle(element) {
  const canvas = $("canvas", element);
  const random = mulberry(3);
  const dots = Array.from({ length: 150 }, () => [random(), random(), random() * Math.PI * 2]);
  let running = false;
  const draw = (now = 0) => {
    const { ctx, w, h } = fitCanvas(canvas);
    const colours = cssColours();
    const colour = getComputedStyle(element).color;
    ctx.clearRect(0, 0, w, h);
    dots.forEach(([x, y, phase], i) => {
      const winner = i === 0;
      ctx.globalAlpha = winner ? 1 : 0.18 + 0.12 * Math.sin(now * 0.002 + phase);
      ctx.fillStyle = winner ? colours.kind.role : colour;
      ctx.beginPath();
      ctx.arc(winner ? w * 0.78 : x * w, winner ? h * 0.24 : y * h, winner ? 7 : 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (running) requestAnimationFrame(draw);
  };
  draw();
  if (!reducedMotion()) {
    new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) requestAnimationFrame(draw);
    }).observe(canvas);
  }
  addEventListener("themechange", () => draw());
}

// The same 7,500 questions asked about 7,500 images, or ten each about 750.
// Each square stands for 25 images and each dot for 25 questions, so both
// modes draw the same 300 dots: one per square, or ten per square in 30.
function densityDiversity(element) {
  const canvas = $("canvas", element);
  const readout = $("[data-readout]", element);
  const cols = 20;
  const rows = 15;
  const random = mulberry(11);
  // The 30 dense squares, spread evenly: one in each block of ten.
  const denseCells = [];
  for (let by = 0; by < rows; by += 5) {
    for (let bx = 0; bx < cols; bx += 2) {
      denseCells.push((by + Math.floor(random() * 5)) * cols + bx + Math.floor(random() * 2));
    }
  }
  const isDense = new Set(denseCells);
  let mode = "diverse";
  let from = 0;
  let to = 0;
  let start = 0;

  function frame(now) {
    const { ctx, w, h } = fitCanvas(canvas);
    // Before layout the canvas has no size; the resize observer below redraws once it does.
    if (!w || !h) return;
    const colours = cssColours();
    const t = reducedMotion() ? 1 : Math.min(1, (now - start) / 900);
    const e = 1 - Math.pow(1 - t, 3);
    const d = from + (to - from) * e;
    const gap = Math.max(3, w / 140);
    const size = Math.min((w - gap * (cols - 1)) / cols, (h - gap * (rows - 1)) / rows);
    const ox = (w - (size * cols + gap * (cols - 1))) / 2;
    const oy = (h - (size * rows + gap * (rows - 1))) / 2;
    const cell = (index) => [ox + (index % cols) * (size + gap), oy + Math.floor(index / cols) * (size + gap)];
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < cols * rows; i++) {
      const [x, y] = cell(i);
      const used = isDense.has(i);
      ctx.fillStyle = withAlpha(colours.ink, used ? 0.07 + 0.07 * d : 0.07 * (1 - d) + 0.018 * d);
      roundRect(ctx, x, y, size, size, Math.min(5, size / 5));
      ctx.fill();
      if (used && d > 0.01) {
        ctx.strokeStyle = withAlpha(colours.accent, 0.5 * d);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const r = Math.max(1.3, size / 11);
    ctx.fillStyle = colours.accent;
    for (let i = 0; i < 300; i++) {
      const [ax, ay] = cell(i);
      const [bx, by] = cell(denseCells[Math.floor(i / 10)]);
      const slot = i % 10;
      const tx = bx + size * (0.2 + 0.15 * (slot % 5));
      const ty = by + size * (slot < 5 ? 0.36 : 0.64);
      const x = ax + size / 2 + (tx - ax - size / 2) * d;
      const y = ay + size / 2 + (ty - ay - size / 2) * d;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (t < 1) requestAnimationFrame(frame);
  }

  $$("[data-mode]", element).forEach((button) =>
    button.addEventListener("click", () => {
      if (button.dataset.mode === mode) return;
      $$("[data-mode]", element).forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      mode = button.dataset.mode;
      from = to;
      to = mode === "dense" ? 1 : 0;
      start = performance.now();
      readout.innerHTML = mode === "dense"
        ? "<b>750</b> images, <b>10</b> questions each"
        : "<b>7,500</b> images, <b>1</b> question each";
      requestAnimationFrame(frame);
    }),
  );
  requestAnimationFrame(frame);
  addEventListener("themechange", () => requestAnimationFrame(frame));
  new ResizeObserver(() => requestAnimationFrame(frame)).observe(canvas);
}
