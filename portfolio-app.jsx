// Main App
const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  accent: "#d4a86a",
  density: "comfortable",
  headlineFamily: "Newsreader",
  showGrid: true,
}; /*EDITMODE-END*/

const ACCENT_OPTIONS = [
  "#d4a86a", // warm gold (default)
  "#e8a36f", // amber
  "#9bb5d6", // slate blue
  "#a8c5a0", // sage
  "#d99a9a", // muted rose
];

const HEADLINE_OPTIONS = [
  "Newsreader",
  "Instrument Serif",
  "EB Garamond",
  "Geist",
];

function measureRoute(points) {
  return points.slice(1).reduce((total, point, index) => {
    const prev = points[index];
    return total + Math.hypot(point.x - prev.x, point.y - prev.y);
  }, 0);
}

function pointAtDistance(points, distance) {
  let remaining = Math.max(0, distance);
  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (remaining <= length) {
      const t = length === 0 ? 0 : remaining / length;
      return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      };
    }
    remaining -= length;
  }
  return points[points.length - 1];
}

function trailPoints(points, startDistance, endDistance) {
  const total = measureRoute(points);
  const start = Math.max(0, Math.min(total, startDistance));
  const end = Math.max(start, Math.min(total, endDistance));
  const result = [pointAtDistance(points, start)];
  let walked = 0;

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const segmentStart = walked;
    const segmentEnd = walked + length;

    if (segmentEnd > start && segmentStart < end) {
      if (segmentEnd <= end) result.push(to);
      else result.push(pointAtDistance(points, end));
    }

    walked = segmentEnd;
  }

  return result;
}

function trailSegments(points, startDistance, endDistance, count = 9) {
  const total = measureRoute(points);
  const start = Math.max(0, Math.min(total, startDistance));
  const end = Math.max(start, Math.min(total, endDistance));
  const length = end - start;
  if (length <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const segmentStart = start + (length * index) / count;
    const segmentEnd = start + (length * (index + 1)) / count;
    const emphasis = (index + 1) / count;
    return {
      points: trailPoints(points, segmentStart, segmentEnd),
      opacity: 0.06 + Math.pow(emphasis, 1.7) * 0.72,
      strokeWidth: 0.28 + emphasis * 1.35,
    };
  }).filter((segment) => segment.points.length > 1);
}

function SignalLayer() {
  const [viewport, setViewport] = useState({ width: 1200, height: 900 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    let frame;
    let last = 0;
    const animate = (now) => {
      if (now - last > 33) {
        setTick(now);
        last = now;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const col = viewport.width / 12;
  const row = Math.max(32, Math.min(48, viewport.height / 18));
  const signals = [
    {
      name: "a",
      duration: 18000,
      offset: 0,
      trail: Math.max(170, viewport.width * 0.16),
      points: [
        { x: -2 * col, y: 3 * row },
        { x: 0 * col, y: 3 * row },
        { x: 0 * col, y: 5 * row },
        { x: 2 * col, y: 5 * row },
        { x: 2 * col, y: 7 * row },
        { x: 4 * col, y: 7 * row },
        { x: 4 * col, y: 9 * row },
        { x: 6 * col, y: 9 * row },
        { x: 6 * col, y: 11 * row },
        { x: 10 * col, y: 11 * row },
        { x: 10 * col, y: 13 * row },
        { x: 14 * col, y: 13 * row },
      ],
    },
    {
      name: "b",
      duration: 21600,
      offset: -7000,
      trail: Math.max(150, viewport.width * 0.14),
      points: [
        { x: 14 * col, y: 12 * row },
        { x: 12 * col, y: 12 * row },
        { x: 12 * col, y: 10 * row },
        { x: 10 * col, y: 10 * row },
        { x: 10 * col, y: 8 * row },
        { x: 8 * col, y: 8 * row },
        { x: 8 * col, y: 6 * row },
        { x: 6 * col, y: 6 * row },
        { x: 6 * col, y: 4 * row },
        { x: 2 * col, y: 4 * row },
        { x: 2 * col, y: 2 * row },
        { x: -2 * col, y: 2 * row },
      ],
    },
    {
      name: "c",
      duration: 25200,
      offset: -13000,
      trail: Math.max(130, viewport.width * 0.12),
      points: [
        { x: -1 * col, y: 16 * row },
        { x: 1 * col, y: 16 * row },
        { x: 1 * col, y: 14 * row },
        { x: 3 * col, y: 14 * row },
        { x: 3 * col, y: 12 * row },
        { x: 5 * col, y: 12 * row },
        { x: 5 * col, y: 10 * row },
        { x: 7 * col, y: 10 * row },
        { x: 7 * col, y: 8 * row },
        { x: 11 * col, y: 8 * row },
        { x: 11 * col, y: 6 * row },
        { x: 14 * col, y: 6 * row },
      ],
    },
    {
      name: "d",
      duration: 23400,
      offset: -18000,
      trail: Math.max(140, viewport.width * 0.13),
      points: [
        { x: 13 * col, y: 1 * row },
        { x: 11 * col, y: 1 * row },
        { x: 11 * col, y: 3 * row },
        { x: 9 * col, y: 3 * row },
        { x: 9 * col, y: 5 * row },
        { x: 7 * col, y: 5 * row },
        { x: 7 * col, y: 7 * row },
        { x: 5 * col, y: 7 * row },
        { x: 5 * col, y: 9 * row },
        { x: 3 * col, y: 9 * row },
        { x: 3 * col, y: 11 * row },
        { x: -2 * col, y: 11 * row },
      ],
    },
  ];

  return (
    <svg className="signal-layer" aria-hidden="true">
      {signals.map((signal) => {
        const total = measureRoute(signal.points);
        const elapsed =
          (((tick + signal.offset) % signal.duration) + signal.duration) %
          signal.duration;
        const distance = (elapsed / signal.duration) * total;
        const dot = pointAtDistance(signal.points, distance);
        const segments = trailSegments(
          signal.points,
          distance - signal.trail,
          distance,
        );

        return (
          <g key={signal.name}>
            {segments.map((segment, index) => (
              <polyline
                key={index}
                className={`signal-trail signal-trail--${signal.name}`}
                points={segment.points
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ")}
                style={{
                  opacity: segment.opacity,
                  strokeWidth: segment.strokeWidth,
                }}
              />
            ))}
            <circle
              className={`signal-dot signal-dot--${signal.name}`}
              cx={dot.x}
              cy={dot.y}
              r="3.25"
            />
          </g>
        );
      })}
    </svg>
  );
}

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");
  const scrollFx = useRef({ lastY: 0, lastT: performance.now(), raf: null });
  const data = window.PORTFOLIO_DATA;

  useEffect(() => {
    const root = document.documentElement;
    const updateScrollFx = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const y = window.scrollY;
      const now = performance.now();
      const progress = Math.min(1, Math.max(0, y / max));
      const elapsed = Math.max(16, now - scrollFx.current.lastT);
      const velocity = Math.min(
        3,
        Math.abs(y - scrollFx.current.lastY) / elapsed,
      );
      const blur = 8 + progress * 8 + velocity * 5;

      root.style.setProperty("--scroll-progress", progress.toFixed(3));
      root.style.setProperty("--scroll-blur", `${blur.toFixed(2)}px`);
      root.style.setProperty(
        "--scroll-lift",
        `${(progress * 28).toFixed(1)}px`,
      );
      root.style.setProperty(
        "--scroll-glow-y",
        `${(18 + progress * 32).toFixed(1)}%`,
      );
      root.style.setProperty(
        "--frost-opacity",
        (0.64 + progress * 0.16).toFixed(3),
      );
      root.style.setProperty(
        "--frost-shift",
        `${(progress * -18).toFixed(1)}px`,
      );

      scrollFx.current.lastY = y;
      scrollFx.current.lastT = now;
    };

    const scheduleScrollFx = () => {
      if (scrollFx.current.raf) return;
      scrollFx.current.raf = requestAnimationFrame(() => {
        scrollFx.current.raf = null;
        updateScrollFx();
      });
    };

    const onScroll = () => {
      scheduleScrollFx();
      setScrolled(window.scrollY > 40);

      const nearPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;

      if (nearPageBottom) {
        setActive("contact");
        return;
      }

      const sections = [
        "about",
        "research",
        "cv",
        "education",
        "work",
        "writings",
        "contact",
      ];
      let cur = "about";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 220) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleScrollFx);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleScrollFx);
      if (scrollFx.current.raf) cancelAnimationFrame(scrollFx.current.raf);
    };
  }, []);

  // Reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { rootMargin: "-50px" },
    );
    document
      .querySelectorAll(
        ".section, .hero, .footer, .feat, .pub, .project, .cv-row",
      )
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Apply tweaks to root
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tweaks.accent);
    r.style.setProperty(
      "--headline-font",
      `'${tweaks.headlineFamily}', 'Instrument Serif', Georgia, serif`,
    );
    r.dataset.density = tweaks.density;
    r.dataset.grid = tweaks.showGrid ? "on" : "off";
  }, [tweaks]);

  const nav = [
    { id: "about", label: "About" },
    { id: "research", label: "Publications" },
    { id: "cv", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "work", label: "Artifacts" },
    { id: "writings", label: "Writings" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div
      className={`root ${scrolled ? "is-scrolled" : ""}`}
      data-screen-label="Portfolio"
    >
      <SignalLayer />

      <aside className="rail visible">
        <div className="rail-inner">
          <a href="#top" className="rail-logo serif">
            Akhil Theerthala
          </a>
          <ul className="rail-list">
            {nav.map((n) => {
              const isActive = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={`rail-item ${isActive ? "active" : ""}`}
                  >
                    <span
                      className="rail-tick"
                      style={
                        isActive
                          ? { background: tweaks.accent, width: "24px" }
                          : {}
                      }
                    ></span>
                    <span className="rail-text">{n.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a href={`mailto:${data.email}`} className="rail-foot mono dim">
            {data.email}
          </a>
        </div>
      </aside>

      <main>
        <Hero data={data} accent={tweaks.accent} />
        <About data={data} accent={tweaks.accent} />
        <Publications data={data} accent={tweaks.accent} />
        <Experience data={data} accent={tweaks.accent} />
        <Education data={data} accent={tweaks.accent} />
        <Projects data={data} accent={tweaks.accent} />
        <Writings data={data} accent={tweaks.accent} />
      </main>

      <FooterBlock data={data} accent={tweaks.accent} />

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Accent">
            <window.TweakColor
              label="Accent color"
              value={tweaks.accent}
              options={ACCENT_OPTIONS}
              onChange={(v) => setTweak("accent", v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Type">
            <window.TweakSelect
              label="Headline family"
              value={tweaks.headlineFamily}
              options={HEADLINE_OPTIONS}
              onChange={(v) => setTweak("headlineFamily", v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Layout">
            <window.TweakRadio
              label="Density"
              value={tweaks.density}
              options={["compact", "comfortable"]}
              onChange={(v) => setTweak("density", v)}
            />
            <window.TweakToggle
              label="Baseline grid"
              value={tweaks.showGrid}
              onChange={(v) => setTweak("showGrid", v)}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
