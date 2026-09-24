const { useEffect, useMemo, useRef, useState } = React;

const ARTICLE_ACCENT = "#c8a66b";

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function getRequestedArticle() {
  const generatedFile = document.documentElement.dataset.articleFile;
  const params = new URLSearchParams(window.location.search);
  const file = generatedFile || params.get("file");
  if (!file) return null;
  return (
    window.PORTFOLIO_DATA.writings.find((article) => article.file === file) ||
    null
  );
}

function getContentUrl(article) {
  const prefix = document.documentElement.dataset.contentPrefix || "";
  return `${prefix}My%20writings/${encodeURIComponent(article.file)}`;
}

function getHomeHref(hash = "") {
  const prefix = document.documentElement.dataset.contentPrefix || "";
  return `${prefix || "index.html"}${hash}`;
}

function ArticleIndex({ items, activeHeading }) {
  const disclosureRef = useRef(null);
  const activeItem =
    items.find((item) => item.id === activeHeading) || items[0];

  const closeDisclosure = () => {
    if (disclosureRef.current) disclosureRef.current.open = false;
  };

  const renderLinks = () =>
    items.map((item) => {
      const isActive = activeHeading === item.id;
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`rail-item toc-level-${item.level} ${isActive ? "active" : ""}`}
            aria-current={isActive ? "location" : undefined}
            onClick={closeDisclosure}
          >
            <span
              className="rail-tick"
              style={
                isActive
                  ? { background: ARTICLE_ACCENT, width: "24px" }
                  : undefined
              }
            ></span>
            <span className="rail-text">{item.text}</span>
          </a>
        </li>
      );
    });

  return (
    <>
      <aside className="rail visible article-rail" aria-label="Article index">
        <div className="rail-inner">
          <a href={getHomeHref("#top")} className="rail-logo serif">
            Akhil Theerthala
          </a>
          <ul className="rail-list">{renderLinks()}</ul>
          <a href={getHomeHref("#writings")} className="rail-foot mono dim">
            All writings
          </a>
        </div>
      </aside>

      <details className="article-index" ref={disclosureRef}>
        <summary>
          <span className="article-index-label mono">On this page</span>
          <span className="article-index-current">{activeItem.text}</span>
        </summary>
        <nav aria-label="Article index">
          <ul>{renderLinks()}</ul>
        </nav>
      </details>
    </>
  );
}

function WritingPage() {
  const article = useMemo(() => getRequestedArticle(), []);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(Boolean(article));
  const [error, setError] = useState(false);
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState("article-top");
  const bodyRef = useRef(null);

  useEffect(() => {
    document.title = article
      ? `${article.title} - Akhil Theerthala`
      : "Writing - Akhil Theerthala";

    if (article) {
      const canonical =
        document.querySelector('link[rel="canonical"]') ||
        document.head.appendChild(document.createElement("link"));
      canonical.rel = "canonical";
      canonical.href = `https://akhiltheerthala.com/writing/${article.slug}/`;
    }
  }, [article]);

  useEffect(() => {
    if (!article) return;

    setLoading(true);
    setError(false);
    setContent("");
    setToc([]);

    fetch(getContentUrl(article))
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

    const targets = [
      document.getElementById("article-top"),
      ...items.map((item) => document.getElementById(item.id)),
    ].filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActiveHeading(current.target.id);
      },
      { rootMargin: "-12% 0px -72%", threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [content]);

  const tocItems = [{ id: "article-top", text: "Overview", level: 1 }, ...toc];

  if (!article) {
    return (
      <div className="reader-page">
        <CalibrationField />
        <ArticleIndex items={tocItems} activeHeading={activeHeading} />

        <div className="reader-progress" aria-hidden="true">
          <div className="reader-progress-fill"></div>
        </div>

        <main className="reader-page-main" id="main-content">
          <article className="reader-article" id="article-top">
            <p className="reader-eyebrow mono">Writing</p>
            <h1 className="reader-title">Article not found</h1>
            <div
              className="reader-divider"
              style={{ background: ARTICLE_ACCENT, opacity: 0.4 }}
            ></div>
            <div className="reader-error">
              <p>
                The requested essay could not be found from the current URL.
              </p>
              <a href={getHomeHref("#writings")} className="reader-link">
                Return to the writings archive
              </a>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <CalibrationField />
      <ArticleIndex items={tocItems} activeHeading={activeHeading} />

      <div className="reader-progress" aria-hidden="true">
        <div className="reader-progress-fill"></div>
      </div>

      <main className="reader-page-main" id="main-content">
        <article className="reader-article" id="article-top">
          <p className="reader-eyebrow mono">Writing · {article.year}</p>
          <h1 className="reader-title">{article.title}</h1>
          <p className="reader-byline">Akhil Theerthala · {article.date}</p>
          <div
            className="reader-divider"
            style={{ background: ARTICLE_ACCENT, opacity: 0.4 }}
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
                medium.com/@akhiltvsn
                <span className="sr-only"> (opens in a new tab)</span>
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
                style={{ color: ARTICLE_ACCENT }}
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
