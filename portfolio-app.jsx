// Main App
const { useState, useEffect } = React;

const APPROVED_ACCENT = "#c8a66b";

function App() {
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
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top),
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
        ".section, .hero, .footer, .feat, .pub, .cv-row",
      )
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const nav = [
    { id: "about", label: "About" },
    { id: "cv", label: "Experience" },
    { id: "work", label: "Artifacts" },
    { id: "research", label: "Publications" },
    { id: "writings", label: "Writings" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div
      className="root"
      data-density="comfortable"
      data-screen-label="Portfolio"
    >
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
                          ? { background: APPROVED_ACCENT, width: "24px" }
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
        <Hero data={data} accent={APPROVED_ACCENT} />
        <About data={data} accent={APPROVED_ACCENT} />
        <Experience data={data} accent={APPROVED_ACCENT} />
        <Projects data={data} accent={APPROVED_ACCENT} />
        <Publications data={data} accent={APPROVED_ACCENT} />
        <Writings data={data} accent={APPROVED_ACCENT} />
        <Education data={data} accent={APPROVED_ACCENT} />
      </main>

      <FooterBlock data={data} accent={APPROVED_ACCENT} />
    </div>
  );
}

window.App = App;

if (typeof document !== "undefined") {
  const root = document.getElementById("root");
  if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, <App />);
  else ReactDOM.createRoot(root).render(<App />);
}
