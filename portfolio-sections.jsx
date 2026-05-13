// Section components for the portfolio

const { useMemo, useState: _useState } = React;

// ───────── Hero ─────────
function Hero({ data, accent }) {
  const aboutParagraphs = data.longIntro?.length
    ? data.longIntro
    : [data.intro];

  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-left">
          <h1 className="hero-title">{data.name}</h1>

          <div className="hero-lede">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="hero-actions">
            <a
              href="data/Akhil_Theerthala_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Download CV <span className="arrow">↓</span>
            </a>
            <a href={`mailto:${data.email}`} className="btn btn-ghost">
              Get in touch
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="portrait-wrap">
            <img
              src="profile_photo.png"
              alt="Akhil Theerthala"
              className="portrait"
            />
          </div>
        </div>
      </div>

      <div className="hero-notes">
        {data.now.map((item, i) => (
          <div className="note-card" key={i}>
            <div className="note-kicker" style={{ color: accent }}>
              {item.label}
            </div>
            <div className="note-text">{item.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── About ─────────
function About({ data, accent }) {
  return (
    <section className="section about-section" id="about">
      <SectionHead
        label="§ 00"
        title="About"
        sub="A short version. The CV expands on it."
      />
      <div className="about-grid">
        <div className="about-body">
          {data.longIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="about-actions">
            <a
              href="data/Akhil_Theerthala_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Download CV <span className="arrow">↓</span>
            </a>
            <a href={`mailto:${data.email}`} className="btn btn-ghost">
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────── Selected Work (Publications) ─────────
function Publications({ data, accent }) {
  const publicationsByYear = useMemo(() => {
    const grouped = {};
    data.publications.forEach((publication) => {
      (grouped[publication.year] = grouped[publication.year] || []).push(
        publication,
      );
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [data.publications]);

  return (
    <section className="section" id="research">
      <SectionHead
        label="§ 02"
        title="Publications"
        sub="Research work done so far."
      />

      <div className="pubs">
        {publicationsByYear.map(([year, publications]) => (
          <div className="pub-group" key={year}>
            <div className="pub-group-side">
              <div className="pub-year serif">{year}</div>
            </div>

            <div className="pub-group-main">
              {publications.map((p, i) => (
                <article className="pub" key={`${year}-${i}`}>
                  <div className="pub-venue mono">{p.venue}</div>
                  <h3 className="pub-title serif">{p.title}</h3>
                  <p className="pub-authors mono">
                    {p.authors.map((a, j) => (
                      <span key={j}>
                        {a === "A. Theerthala" ? (
                          <strong style={{ color: "var(--ink)" }}>{a}</strong>
                        ) : (
                          a
                        )}
                        {j < p.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="pub-abstract">{p.abstract}</p>
                  <div className="pub-foot">
                    <div className="tag-row">
                      {p.tags.map((t, j) => (
                        <span className="tag" key={j}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="pub-links">
                      {p.arxiv && (
                        <a
                          href={p.arxiv}
                          target="_blank"
                          rel="noreferrer"
                          className="link-arrow"
                          style={{ color: accent }}
                        >
                          arXiv <span className="arrow">↗</span>
                        </a>
                      )}
                      {p.file && (
                        <a
                          href={p.file}
                          target="_blank"
                          rel="noreferrer"
                          className="link-arrow"
                          style={{ color: accent }}
                        >
                          PDF <span className="arrow">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── Projects ─────────
function Projects({ data, accent }) {
  return (
    <section className="section" id="work">
      <SectionHead
        label="§ 03"
        title="Open Source"
        sub="Datasets, models, and small tools — built in the open."
      />

      <div className="projects">
        {data.projects.map((p, i) => (
          <a
            className="project"
            href={p.href}
            target="_blank"
            rel="noreferrer"
            key={i}
          >
            <div className="project-head">
              <span className="project-kicker mono dim">{p.kicker}</span>
              <span className="project-year mono dim">{p.year}</span>
            </div>
            <h3 className="project-title serif">{p.title}</h3>
            <p className="project-desc">{p.desc}</p>
            <div className="project-foot">
              <span
                className="project-metric serif-italic"
                style={{ color: accent }}
              >
                {p.metric}
              </span>
              <span className="arrow project-arrow">→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ───────── Experience ─────────
function Experience({ data, accent }) {
  return (
    <section className="section" id="cv">
      <SectionHead
        label="§ 01"
        title="Experience"
        sub="A short version. The long one is a PDF — top of the page."
      />
      <div className="cv">
        {data.experience.map((e, i) => (
          <div className="cv-row" key={i}>
            <div className="cv-date mono dim">{e.date}</div>
            <div className="cv-body">
              <h3 className="cv-title">{e.title}</h3>
              <p className="cv-org">{e.org}</p>
              <p className="cv-desc">{e.desc}</p>
              {e.tags && (
                <div className="tag-row" style={{ marginTop: "0.75rem" }}>
                  {e.tags.map((t, j) => (
                    <span className="tag" key={j}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="cv-marker" style={{ background: accent }}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── Writings ─────────
function Writings({ data, onOpen, accent }) {
  const [filter, setFilter] = useState("All");
  const cats = useMemo(() => {
    const set = new Set(data.writings.map((w) => w.category));
    return ["All", ...Array.from(set)];
  }, [data.writings]);

  const filtered = useMemo(() => {
    return filter === "All"
      ? data.writings
      : data.writings.filter((w) => w.category === filter);
  }, [data.writings, filter]);

  const byYear = useMemo(() => {
    const map = {};
    filtered.forEach((w) => {
      (map[w.year] = map[w.year] || []).push(w);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const featured = data.writings.filter((w) => w.featured).slice(0, 3);

  return (
    <section className="section" id="writings">
      <SectionHead
        label="§ 04"
        title="Writings"
        sub={`${data.writings.length} essays on ML, reasoning, and the parts of the lifecycle nobody writes about.`}
      />

      <div className="featured">
        {featured.map((w, i) => (
          <div className="feat" key={i} onClick={() => onOpen(w)}>
            <div className="feat-head">
              <span className="mono dim">{w.date}</span>
              <span className="mono dim">{w.category}</span>
            </div>
            <h3 className="feat-title serif">{w.title}</h3>
            <p className="feat-excerpt">{w.excerpt}</p>
            <span className="feat-link mono" style={{ color: accent }}>
              Read essay →
            </span>
          </div>
        ))}
      </div>

      <div className="writings-tools">
        <div className="filter-row">
          {cats.map((c) => (
            <button
              key={c}
              className={`chip ${filter === c ? "active" : ""}`}
              style={filter === c ? { borderColor: accent, color: accent } : {}}
              onClick={() => setFilter(c)}
            >
              {c}{" "}
              <span className="dim">
                {c === "All"
                  ? data.writings.length
                  : data.writings.filter((w) => w.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="archive">
        {byYear.map(([y, list]) => (
          <div className="year-block" key={y}>
            <div className="year-label serif">{y}</div>
            <div className="year-list">
              {list.map((w, i) => (
                <button className="item" key={i} onClick={() => onOpen(w)}>
                  <span className="item-num mono dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="item-title">{w.title}</span>
                  <span className="item-cat mono dim">{w.category}</span>
                  <span className="item-date mono dim">{w.date}</span>
                  <span className="item-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── Footer ─────────
function FooterBlock({ data, accent }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer-head">
        <p className="footer-eyebrow mono dim">§ 05 · Contact</p>
        <h2 className="footer-title serif">
          Always up for a good{" "}
          <span className="serif-italic" style={{ color: accent }}>
            conversation
          </span>
          .
        </h2>
        <p className="footer-sub">
          Open to research collaborations, reading-group invitations, and any
          well-formed question about reasoning, finance LLMs, or document AI.
        </p>
        <a href={`mailto:${data.email}`} className="footer-mail serif">
          {data.email} <span className="arrow">→</span>
        </a>
      </div>

      <div className="footer-socials">
        {data.socials.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="social-btn"
          >
            <span className="social-label">{s.label}</span>
            <span className="social-handle mono dim">{s.handle}</span>
            <span className="social-arrow">↗</span>
          </a>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 Akhil Theerthala</span>
        <span>Hyderabad, India</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

// ───────── Shared bits ─────────
function SectionHead({ label, title, sub }) {
  return (
    <div className="sec-head">
      <span className="sec-label mono dim">{label}</span>
      <h2
        className="sec-title serif"
        dangerouslySetInnerHTML={{ __html: title }}
      ></h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}

Object.assign(window, {
  Hero,
  About,
  Publications,
  Projects,
  Experience,
  Writings,
  FooterBlock,
  SectionHead,
});
