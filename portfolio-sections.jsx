// Section components for the portfolio

const { useEffect, useMemo, useState } = React;

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
            <picture>
              <source
                type="image/webp"
                srcSet="assets/media/profile-480.webp 480w, assets/media/profile-960.webp 960w"
                sizes="(max-width: 720px) 0px, (max-width: 1280px) 348px, 420px"
              />
              <img
                src="profile_photo.png"
                width="960"
                height="995"
                decoding="async"
                fetchPriority="high"
                alt="Akhil Theerthala"
                className="portrait"
              />
            </picture>
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

function PublicationCitation({ publication }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!status) return undefined;
    const reset = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(reset);
  }, [status]);

  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied`);
    } catch {
      setStatus(`Copy failed. Select the ${label.toLowerCase()} text below.`);
    }
  };

  if (!publication.citation || !publication.bibtex) return null;

  return (
    <details className="citation">
      <summary className="citation-summary">
        <span>Citation</span>
        <span className="citation-doi mono">DOI {publication.doi}</span>
      </summary>
      <div className="citation-body">
        <div className="citation-actions">
          <button
            type="button"
            onClick={() => copy(publication.citation, "Citation")}
          >
            Copy citation
          </button>
          <button
            type="button"
            onClick={() => copy(publication.bibtex, "BibTeX")}
          >
            Copy BibTeX
          </button>
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noreferrer"
          >
            Open DOI <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="citation-record">
          <p className="citation-label mono">Plain citation</p>
          <pre className="citation-text">{publication.citation}</pre>
        </div>
        <div className="citation-record">
          <p className="citation-label mono">BibTeX</p>
          <pre className="citation-text citation-text--bibtex">
            {publication.bibtex}
          </pre>
        </div>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </div>
    </details>
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
      <SectionHead title="Publications" />

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
                  <PublicationCitation publication={p} />
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
function ArtifactEvidence({ evidence }) {
  if (!evidence) return null;

  return (
    <aside className={`artifact-evidence artifact-evidence--${evidence.kind}`}>
      <div className="artifact-evidence-head">
        <span className="artifact-evidence-mark" aria-hidden="true">
          ✓
        </span>
        <p className="artifact-evidence-label mono">{evidence.label}</p>
      </div>
      <p className="artifact-evidence-caption">{evidence.caption}</p>

      {evidence.metrics?.length > 0 && (
        <dl className="artifact-metrics">
          {evidence.metrics.map((metric) => (
            <div className="artifact-metric" key={metric.label}>
              <dt className="mono">{metric.label}</dt>
              <dd className="serif">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {evidence.schema?.length > 0 && (
        <div className="artifact-schema">
          <p className="artifact-evidence-label mono">Record schema</p>
          <code>{evidence.schema.join("  ·  ")}</code>
        </div>
      )}

      {evidence.stages?.length > 0 && (
        <ol className="artifact-flow" aria-label="Pipeline stages">
          {evidence.stages.map((stage, index) => (
            <li key={stage}>
              <span className="artifact-flow-index mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{stage}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function Projects({ data, accent }) {
  return (
    <section className="section" id="work">
      <SectionHead
        title="Research Artifacts"
        sub="Datasets, models, benchmarks, and tools that make the research concrete."
      />

      <div className="projects">
        {data.projects.map((project, index) => (
          <article
            className={`project ${index === 0 ? "project--featured" : "project--supporting"}`}
            key={project.title}
          >
            <div className="project-narrative">
              <div className="project-head">
                <span className="project-kicker mono dim">
                  {project.kicker}
                </span>
                <span className="project-year mono dim">{project.year}</span>
              </div>
              <h3 className="project-title serif">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <div className="project-links" aria-label={`${project.title} links`}>
                {(project.links || []).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-arrow"
                    style={{ color: accent }}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
            <ArtifactEvidence evidence={project.evidence} />
          </article>
        ))}
      </div>
    </section>
  );
}

// ───────── Experience ─────────
function EmphasizedText({ text, tokens = [] }) {
  const matches = tokens
    .map((token) => ({ token, index: text.indexOf(token) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) return text;

  const parts = [];
  let cursor = 0;
  matches.forEach(({ token, index }) => {
    if (index < cursor) return;
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<strong key={`${token}-${index}`}>{token}</strong>);
    cursor = index + token.length;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function ExperienceEntry({ experience }) {
  return (
    <article className="cv-row">
      <div className="cv-date mono dim">{experience.date}</div>
      <div className="cv-body">
        <h3 className="cv-title">{experience.title}</h3>
        <p className="cv-org">{experience.org}</p>
        <p className="cv-summary">{experience.summary}</p>
        <ul className="cv-desc-list">
          {experience.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight}>
              <EmphasizedText
                text={highlight}
                tokens={experience.emphasis || []}
              />
            </li>
          ))}
        </ul>
        {experience.recognition && (
          <p className="cv-recognition">
            <span className="cv-recognition-label mono">Recognition</span>
            {experience.recognition}
          </p>
        )}
      </div>
    </article>
  );
}

function Experience({ data, accent }) {
  return (
    <section className="section" id="cv">
      <SectionHead
        title="Experience"
        sub="Industry research and applied ML contributions, written as problem-method-evaluation-impact."
      />

      <div className="cv">
        {data.workExperience.map((experience) => (
          <ExperienceEntry
            experience={experience}
            key={`${experience.org}-${experience.title}`}
          />
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

function WritingRows({ items }) {
  return (
    <div className="year-list">
      {items.map((item, index) => (
        <a className="item" key={item.slug} href={getWritingHref(item)}>
          <span className="item-num mono dim">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="item-title">{item.title}</span>
          <span className="item-cat mono dim">{item.category}</span>
          <span className="item-date mono dim">{item.date}</span>
          <span className="item-arrow" aria-hidden="true">
            →
          </span>
        </a>
      ))}
    </div>
  );
}

function Writings({ data, accent }) {
  const featured = data.writings.filter((item) => item.featured);
  const archive = data.writings.filter((item) => !item.featured);
  const current = archive.filter(
    (item) => item.category !== "Older Learning Notes",
  );
  const older = archive.filter(
    (item) => item.category === "Older Learning Notes",
  );

  return (
    <section className="section" id="writings">
      <SectionHead
        title="Writings"
        sub="Curated research notes first, technical essays second, older learning notes archived for completeness."
      />

      <div className="featured">
        {featured.map((item) => (
          <a className="feat" key={item.slug} href={getWritingHref(item)}>
            <div className="feat-head">
              <span className="mono dim">{item.date}</span>
              <span className="mono dim">{item.category}</span>
            </div>
            <h3 className="feat-title serif">{item.title}</h3>
            <p className="feat-excerpt">{item.excerpt}</p>
            <span className="feat-link mono" style={{ color: accent }}>
              Read essay →
            </span>
          </a>
        ))}
      </div>

      <div className="archive">
        <div className="year-block">
          <div className="year-label serif">Technical essays</div>
          <WritingRows items={current} />
        </div>

        <details className="older-writing-archive">
          <summary>
            <span className="serif">Older learning notes</span>
            <span className="mono dim">{older.length} notes</span>
          </summary>
          <div className="older-writing-body">
            <p className="older-writing-context">
              Early notes kept as a public record of how my technical practice
              developed.
            </p>
            <WritingRows items={older} />
          </div>
        </details>
      </div>
    </section>
  );
}

// ───────── Footer ─────────
function FooterBlock({ data, accent }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer-head">
        <p className="footer-eyebrow mono dim">Contact</p>
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
              <li key={i}>{item}</li>
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
        <span>{data.location}</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

// ───────── Shared bits ─────────
function SectionHead({ title, sub }) {
  return (
    <div className="sec-head">
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
  PublicationCitation,
  Publications,
  ArtifactEvidence,
  Projects,
  ExperienceEntry,
  Experience,
  Education,
  Writings,
  FooterBlock,
  SectionHead,
});
