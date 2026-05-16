// Section components for the portfolio

const { useMemo, useState } = React;

// ───────── Hero ─────────
function Hero({ data, accent }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-left">
          <h1 className="hero-title">{data.name}</h1>
          <p className="hero-role mono">{data.currentRole || data.role}</p>
          <p className="hero-agenda">{data.intro}</p>

          <div className="hero-actions">
            <a href={`mailto:${data.email}`} className="btn btn-ghost">
              Get in touch
            </a>
            <a
              href="data/Akhil_Theerthala_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Download CV <span className="arrow">↗</span>
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
    </section>
  );
}

// ───────── About ─────────
function About({ data, accent }) {
  return (
    <section className="section about-section" id="about">
      <SectionHead
        label="§ 01"
        title="About"
        sub="Professional context, current work, and research orientation."
      />
      <div className="about-grid">
        <div className="about-body">
          <p className="about-kicker mono" style={{ color: accent }}>
            {data.currentRole || data.role} · {data.location}
          </p>
          {data.longIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="about-side">
          <details className="about-panel">
            <summary className="about-panel-title serif">
              Research interests
            </summary>
            <div className="about-focus-list">
              {data.researchFocus.map((item, i) => (
                <article className="about-focus-item" key={i}>
                  <span
                    className="about-focus-num mono"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </details>

          {data.researchProfiles?.length > 0 && (
            <details className="about-panel profile-links">
              <summary className="about-panel-title serif">
                Research profiles
              </summary>
              <div className="profile-link-grid">
                {data.researchProfiles.map((profile, i) => (
                  <a
                    key={i}
                    href={profile.href}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link"
                  >
                    <span className="profile-link-label">{profile.label}</span>
                    <span className="profile-link-handle mono dim">
                      {profile.handle}
                    </span>
                    <span className="profile-link-arrow">↗</span>
                  </a>
                ))}
              </div>
            </details>
          )}
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
      <SectionHead label="§ 02" title="Publications" />

      <div className="pubs">
        {publicationsByYear.map(([year, publications]) => (
          <div className="pub-group" key={year}>
            <div className="pub-group-side">
              <div className="pub-year serif">{year}</div>
            </div>

            <div className="pub-group-main">
              {publications.map((p, i) => (
                <article className="pub" key={`${year}-${i}`}>
                  <div className="pub-venue mono">
                    {p.status ? `${p.status} · ` : ""}
                    {p.venue}
                  </div>
                  <h3 className="pub-title serif">{p.title}</h3>
                  {p.authors?.length > 0 && (
                    <p className="pub-authors mono">
                      {p.authors.map((a, j) => (
                        <span key={j}>
                          {a === "A. Theerthala" || a === "Akhil Theerthala" ? (
                            <strong style={{ color: "var(--ink)" }}>{a}</strong>
                          ) : (
                            a
                          )}
                          {j < p.authors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}
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
        label="§ 05"
        title="Research Artifacts"
        sub="Datasets, models, benchmarks, and tools that make the research concrete."
      />

      <div className="projects">
        {data.projects.map((p, i) => {
          const Tag = p.href ? "a" : "article";
          const linkProps = p.href
            ? { href: p.href, target: "_blank", rel: "noreferrer" }
            : {};
          return (
            <Tag className="project" key={i} {...linkProps}>
              <div className="project-head">
                <span className="project-kicker mono dim">{p.kicker}</span>
                <span className="project-year mono dim">{p.year}</span>
              </div>
              <h3 className="project-title serif">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              {p.stats?.length > 0 && (
                <div className="project-stats">
                  {p.stats.map((stat, j) => (
                    <div className="project-stat" key={j}>
                      <span className="project-stat-value serif">
                        {stat.value}
                      </span>
                      <span className="project-stat-label mono">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="project-foot">
                <span
                  className="project-metric serif-italic"
                  style={{ color: accent }}
                >
                  {p.metric}
                </span>
                {p.href && <span className="arrow project-arrow">→</span>}
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

// ───────── Experience ─────────
function Experience({ data, accent }) {
  return (
    <section className="section" id="cv">
      <SectionHead
        label="§ 03"
        title="Experience"
        sub="Industry research and applied ML contributions, written as problem-method-evaluation-impact."
      />

      <div className="cv">
        {data.workExperience.map((e, i) => (
          <div className="cv-row" key={i}>
            <div className="cv-date mono dim">{e.date}</div>
            <div className="cv-body">
              <h3 className="cv-title">{e.title}</h3>
              <p className="cv-org">{e.org}</p>
              {Array.isArray(e.desc) ? (
                <ul className="cv-desc-list">
                  {e.desc.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="cv-desc">{e.desc}</p>
              )}
            </div>
            <div className="cv-marker" style={{ background: accent }}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── Education ─────────
function Education({ data, accent }) {
  return (
    <section className="section" id="education">
      <SectionHead
        label="§ 04"
        title="Education"
        sub="Formal training and affiliations."
      />

      <div className="cv cv--compact">
        {data.education.map((e, i) => (
          <div className="cv-row" key={i}>
            <div className="cv-date">{e.date}</div>
            <div className="cv-body">
              <h3 className="cv-title">{e.title}</h3>
              <p className="cv-org">{e.org}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────── Writings ─────────
function getWritingHref(article) {
  return `writing.html?file=${encodeURIComponent(article.file)}`;
}

function Writings({ data, accent }) {
  const [filter, setFilter] = useState("All");
  const categoryOrder = [
    "Research Notes",
    "Technical Essays",
    "Older Learning Notes",
  ];
  const cats = useMemo(() => {
    const set = new Set(data.writings.map((w) => w.category));
    const ordered = categoryOrder.filter((category) => set.has(category));
    const remaining = Array.from(set).filter(
      (category) => !ordered.includes(category),
    );
    return ["All", ...ordered, ...remaining];
  }, [data.writings]);

  const filtered = useMemo(() => {
    return filter === "All"
      ? data.writings
      : data.writings.filter((w) => w.category === filter);
  }, [data.writings, filter]);

  const byCategory = useMemo(() => {
    const map = {};
    filtered.forEach((w) => {
      (map[w.category] = map[w.category] || []).push(w);
    });
    return Object.entries(map).sort((a, b) => {
      const ai = categoryOrder.indexOf(a[0]);
      const bi = categoryOrder.indexOf(b[0]);
      if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [filtered]);

  const featured = data.writings.filter((w) => w.featured);

  return (
    <section className="section" id="writings">
      <SectionHead
        label="§ 06"
        title="Writings"
        sub="Curated research notes first, technical essays second, older learning notes archived for completeness."
      />

      <div className="featured">
        {featured.map((w, i) => (
          <a className="feat" key={i} href={getWritingHref(w)}>
            <div className="feat-head">
              <span className="mono dim">{w.date}</span>
              <span className="mono dim">{w.category}</span>
            </div>
            <h3 className="feat-title serif">{w.title}</h3>
            <p className="feat-excerpt">{w.excerpt}</p>
            <span className="feat-link mono" style={{ color: accent }}>
              Read essay →
            </span>
          </a>
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
        {byCategory.map(([category, list]) => (
          <div className="year-block" key={category}>
            <div className="year-label serif">{category}</div>
            <div className="year-list">
              {list.map((w, i) => (
                <a className="item" key={i} href={getWritingHref(w)}>
                  <span className="item-num mono dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="item-title">{w.title}</span>
                  <span className="item-cat mono dim">{w.category}</span>
                  <span className="item-date mono dim">{w.date}</span>
                  <span className="item-arrow">→</span>
                </a>
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
        <p className="footer-eyebrow mono dim">§ 07 · Contact</p>
        <h2 className="footer-title serif">
          Contact and{" "}
          <span className="serif-italic" style={{ color: accent }}>
            collaboration
          </span>
          .
        </h2>
        <p className="footer-sub">
          Open to research collaborations, reading-group invitations, and
          concrete questions about reliable AI systems in finance and document
          intelligence.
        </p>
        {data.collaborationInterests?.length > 0 && (
          <ul className="collab-list">
            {data.collaborationInterests.map((item, i) => (
              <li key={i}>
                <span
                  className="collab-dot"
                  style={{ background: accent }}
                ></span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <a href={`mailto:${data.email}`} className="footer-mail serif">
          {data.email} <span className="arrow">→</span>
        </a>
      </div>

      <div className="footer-socials">
        {(data.contactLinks || data.socials).map((s, i) => (
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
  Education,
  Writings,
  FooterBlock,
  SectionHead,
});
