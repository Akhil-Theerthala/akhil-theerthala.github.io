// Section components for the portfolio

const { useId, useMemo, useRef } = React;

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
              Download CV
              <NewTabNote />
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
        sub="What I build, and the research questions behind it."
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

        {data.researchProfiles?.length > 0 && (
          <aside className="about-side">
            <div className="about-panel profile-links">
              <h3 className="about-panel-heading serif">Profiles</h3>
              <div className="profile-link-grid">
                {data.researchProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link"
                  >
                    <span className="profile-link-label">{profile.label}</span>
                    <span className="profile-link-handle mono dim">
                      {profile.handle}
                    </span>
                    <NewTabNote />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

// ───────── Selected Work (Publications) ─────────
function formatVenue(venue) {
  return venue.replace(/\s(?:19|20)(\d{2})$/, "’$1");
}

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
                    {formatVenue(p.venue)}
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
                    <ul className="tag-list" aria-label="Topics">
                      {p.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <LinkButtons
                      links={[
                        p.arxiv && { label: "arXiv", href: p.arxiv },
                        p.file && { label: "PDF", href: p.file },
                      ].filter(Boolean)}
                    />
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
function formatMonth(released) {
  const [year, month] = released.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(year, month - 1));
}

function ArtifactEvidence({ evidence }) {
  if (!evidence) return null;

  return (
    <div className={`artifact-evidence artifact-evidence--${evidence.kind}`}>
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
        <ol className="artifact-flow" aria-label="Steps">
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
    </div>
  );
}

function Artifact({ project }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const meta = `${formatMonth(project.released)} · ${project.kicker}`;
  const openDetails = () => dialogRef.current?.showModal();
  const closeDetails = () => dialogRef.current?.close();

  return (
    <article className="pub artifact">
      <p className="artifact-meta mono">{meta}</p>
      <h3 className="pub-title serif">
        {project.evidence ? (
          <button
            type="button"
            className="artifact-title"
            aria-haspopup="dialog"
            onClick={openDetails}
          >
            {project.title}
          </button>
        ) : (
          project.title
        )}
      </h3>
      <p className="pub-abstract">{project.desc}</p>
      <LinkButtons links={project.links} />

      {project.evidence && (
        <dialog
          ref={dialogRef}
          className="artifact-dialog"
          aria-labelledby={titleId}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <div className="artifact-dialog-body">
            <div className="artifact-dialog-head">
              <p className="artifact-meta mono">{meta}</p>
              <button
                type="button"
                className="reader-close"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
            <h2 id={titleId} className="artifact-dialog-title serif">
              {project.title}
            </h2>
            <p className="artifact-dialog-desc">{project.desc}</p>
            <ArtifactEvidence evidence={project.evidence} />
            <LinkButtons links={project.links}>
              {project.story && (
                <a className="btn btn-primary" href={`artifacts/${project.slug}/`}>
                  Read more
                </a>
              )}
            </LinkButtons>
          </div>
        </dialog>
      )}
    </article>
  );
}

function Projects({ data }) {
  const projectsByYear = useMemo(() => {
    const grouped = new Map();
    [...data.projects]
      .sort((a, b) => b.released.localeCompare(a.released))
      .forEach((project) => {
        const year = project.released.slice(0, 4);
        grouped.set(year, [...(grouped.get(year) || []), project]);
      });
    return [...grouped];
  }, [data.projects]);

  return (
    <section className="section" id="work">
      <SectionHead
        title="Public Artifacts"
        sub="Datasets, models, and tools I have released in the open."
      />

      <div className="pubs">
        {projectsByYear.map(([year, projects]) => (
          <div className="pub-group" key={year}>
            <div className="pub-group-side">
              <div className="pub-year serif">{year}</div>
            </div>

            <div className="pub-group-main">
              {projects.map((project) => (
                <Artifact key={project.title} project={project} />
              ))}
            </div>
          </div>
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
        sub="Production ML systems and research collaborations, most recent first."
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
  return `writing/${article.slug}/`;
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
          Open to applied ML work, research collaborations, and fellowship
          conversations about reliable AI systems in finance and document
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
          {data.email}
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
            <NewTabNote />
          </a>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 Akhil Theerthala</span>
        <span>{data.location}</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

// ───────── Shared bits ─────────
function NewTabNote() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}

function LinkButtons({ links, children }) {
  if (!links?.length && !children) return null;

  return (
    <div className="link-buttons">
      {children}
      {(links || []).map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          {link.label}
          <NewTabNote />
        </a>
      ))}
    </div>
  );
}

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
