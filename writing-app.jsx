const { useEffect, useMemo, useRef, useState } = React;

const ARTICLE_TWEAKS = {
  accent: "#d4a86a",
  density: "comfortable",
  headlineFamily: "Newsreader",
  showGrid: true,
};

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function getRequestedArticle() {
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");
  if (!file) return null;
  return (
    window.PORTFOLIO_DATA.writings.find((article) => article.file === file) ||
    null
  );
}

function WritingPage() {
  const article = useMemo(() => getRequestedArticle(), []);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(Boolean(article));
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState("article-top");
  const bodyRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", ARTICLE_TWEAKS.accent);
    root.style.setProperty(
      "--headline-font",
      `'${ARTICLE_TWEAKS.headlineFamily}', 'Instrument Serif', Georgia, serif`,
    );
    root.dataset.density = ARTICLE_TWEAKS.density;
    root.dataset.grid = ARTICLE_TWEAKS.showGrid ? "on" : "off";

    document.title = article
      ? `${article.title} — Akhil Theerthala`
      : "Writing — Akhil Theerthala";
  }, [article]);

  useEffect(() => {
    if (!article) return;

    setLoading(true);
    setError(false);
    setContent("");
    setToc([]);

    fetch(`My writings/${article.file}`)
      .then((response) => {
        if (!response.ok) throw new Error("not found");
        return response.text();
      })
      .then((text) => {
        if (window.marked) {
          setContent(window.marked.parse(text));
        } else {
          setContent(
            `<pre style="white-space: pre-wrap; font-family: inherit;">${text}</pre>`,
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [article]);

  useEffect(() => {
    if (!content || !bodyRef.current) {
      setToc([]);
      return;
    }

    const headings = Array.from(bodyRef.current.querySelectorAll("h2, h3"));
    const usedIds = new Set();
    const items = headings.map((heading) => {
      const baseId = slugify(heading.textContent || "section");
      let finalId = baseId;
      let suffix = 2;
      while (usedIds.has(finalId)) {
        finalId = `${baseId}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(finalId);
      heading.id = finalId;
      return {
        id: finalId,
        text: heading.textContent || "Section",
        level: Number(heading.tagName.slice(1)),
      };
    });

    setToc(items);
    setActiveHeading("article-top");
  }, [content]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      let current = "article-top";
      toc.forEach((item) => {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top < 180) {
          current = item.id;
        }
      });
      setActiveHeading(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const tocItems = [{ id: "article-top", text: "Overview", level: 1 }, ...toc];

  if (!article) {
    return (
      <div className="reader-page">
        <aside className="rail visible article-rail">
          <div className="rail-inner">
            <a href="index.html#top" className="rail-logo serif">
              Akhil Theerthala
            </a>
            <ul className="rail-list">
              <li>
                <a href="#article-top" className="rail-item active toc-level-1">
                  <span
                    className="rail-tick"
                    style={{ background: ARTICLE_TWEAKS.accent, width: "24px" }}
                  ></span>
                  <span className="rail-text">Overview</span>
                </a>
              </li>
            </ul>
            <a href="index.html#writings" className="rail-foot mono dim">
              All writings
            </a>
          </div>
        </aside>

        <div className="reader-progress">
          <div
            className="reader-progress-fill"
            style={{ width: "0%", background: ARTICLE_TWEAKS.accent }}
          ></div>
        </div>

        <main className="reader-page-main">
          <article className="reader-article" id="article-top">
            <p className="reader-eyebrow mono">Writing</p>
            <h1 className="reader-title">Article not found</h1>
            <div
              className="reader-divider"
              style={{ background: ARTICLE_TWEAKS.accent, opacity: 0.4 }}
            ></div>
            <div className="reader-error">
              <p>
                The requested essay could not be found from the current URL.
              </p>
              <a href="index.html#writings" className="reader-link">
                Return to the writings archive →
              </a>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <aside className="rail visible article-rail">
        <div className="rail-inner">
          <a href="index.html#top" className="rail-logo serif">
            Akhil Theerthala
          </a>
          <ul className="rail-list">
            {tocItems.map((item) => {
              const isActive = activeHeading === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`rail-item toc-level-${item.level} ${isActive ? "active" : ""}`}
                  >
                    <span
                      className="rail-tick"
                      style={
                        isActive
                          ? { background: ARTICLE_TWEAKS.accent, width: "24px" }
                          : {}
                      }
                    ></span>
                    <span className="rail-text">{item.text}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a href="index.html#writings" className="rail-foot mono dim">
            All writings
          </a>
        </div>
      </aside>

      <div className="reader-progress">
        <div
          className="reader-progress-fill"
          style={{
            width: `${progress * 100}%`,
            background: ARTICLE_TWEAKS.accent,
          }}
        ></div>
      </div>

      <main className="reader-page-main">
        <article className="reader-article" id="article-top">
          <p className="reader-eyebrow mono">Writing · {article.year}</p>
          <h1 className="reader-title">{article.title}</h1>
          <p className="reader-byline">Akhil Theerthala · {article.date}</p>
          <div
            className="reader-divider"
            style={{ background: ARTICLE_TWEAKS.accent, opacity: 0.4 }}
          ></div>

          {loading && <div className="reader-loading">Loading article…</div>}
          {error && (
            <div className="reader-error">
              <p>
                Article markdown is unavailable in this preview. You can still
                read more on Medium:
              </p>
              <a
                href="https://medium.com/@akhiltvsn"
                target="_blank"
                rel="noreferrer"
                className="reader-link"
              >
                medium.com/@akhiltvsn →
              </a>
            </div>
          )}
          {content && (
            <div
              ref={bodyRef}
              className="reader-body"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          )}

          <div className="reader-footer">
            <div
              className="reader-divider"
              style={{ background: "var(--rule)", opacity: 1 }}
            ></div>
            <p className="reader-footer-text">
              For corrections, collaboration, or follow-up questions,{" "}
              <a
                href="mailto:akhiltvsn@gmail.com"
                className="reader-link"
                style={{ color: ARTICLE_TWEAKS.accent }}
              >
                email me
              </a>
              .
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WritingPage />);
