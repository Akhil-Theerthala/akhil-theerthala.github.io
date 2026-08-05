// Main App
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  accent: "#c8a66b",
  density: "comfortable",
  headlineFamily: "Newsreader",
}; /*EDITMODE-END*/

const ACCENT_OPTIONS = ["#c8a66b"];

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

  const [active, setActive] = useState("about");
  const data = window.PORTFOLIO_DATA;

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll(
        "#about, #research, #cv, #education, #work, #writings, #contact",
      ),
    );
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        });
        const current = Array.from(visible.values()).sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
        )[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
    <div className="root" data-screen-label="Portfolio">
      <CalibrationField />

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
                    aria-current={isActive ? "location" : undefined}
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

      <main id="main-content">
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
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
