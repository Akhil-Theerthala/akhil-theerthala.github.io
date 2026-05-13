// Main App
const { useState, useEffect, useMemo } = React;

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

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const [reader, setReader] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const data = window.PORTFOLIO_DATA;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["top", "cv", "research", "work", "writings", "contact"];
      let cur = "top";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 220) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
    { id: "top", label: "About" },
    { id: "cv", label: "Experience" },
    { id: "research", label: "Publications" },
    { id: "work", label: "Open Source" },
    { id: "writings", label: "Writings" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="root" data-screen-label="Portfolio">
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
        <Experience data={data} accent={tweaks.accent} />
        <Publications data={data} accent={tweaks.accent} />
        <Projects data={data} accent={tweaks.accent} />
        <Writings data={data} accent={tweaks.accent} onOpen={setReader} />
      </main>

      <FooterBlock data={data} accent={tweaks.accent} />

      {reader && (
        <ArticleReader
          article={reader}
          accent={tweaks.accent}
          onClose={() => setReader(null)}
        />
      )}

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
