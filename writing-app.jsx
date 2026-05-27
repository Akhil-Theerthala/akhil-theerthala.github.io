const { useEffect, useMemo, useRef, useState } = React;

const ARTICLE_TWEAKS = {
  accent: "#d4a86a",
  density: "comfortable",
  headlineFamily: "Newsreader",
  showGrid: true,
};

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
  const scrollFx = useRef({ lastY: 0, lastT: performance.now(), raf: null });

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
    const root = document.documentElement;
    const updateScrollFx = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const y = window.scrollY;
      const now = performance.now();
      const progressValue = Math.min(1, Math.max(0, y / max));
      const elapsed = Math.max(16, now - scrollFx.current.lastT);
      const velocity = Math.min(
        3,
        Math.abs(y - scrollFx.current.lastY) / elapsed,
      );
      const blur = 8 + progressValue * 8 + velocity * 5;

      root.style.setProperty("--scroll-progress", progressValue.toFixed(3));
      root.style.setProperty("--scroll-blur", `${blur.toFixed(2)}px`);
      root.style.setProperty(
        "--scroll-lift",
        `${(progressValue * 28).toFixed(1)}px`,
      );
      root.style.setProperty(
        "--scroll-glow-y",
        `${(18 + progressValue * 32).toFixed(1)}%`,
      );
      root.style.setProperty(
        "--frost-opacity",
        (0.64 + progressValue * 0.16).toFixed(3),
      );
      root.style.setProperty(
        "--frost-shift",
        `${(progressValue * -18).toFixed(1)}px`,
      );

      scrollFx.current.lastY = y;
      scrollFx.current.lastT = now;
      return progressValue;
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
    window.addEventListener("resize", scheduleScrollFx);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleScrollFx);
      if (scrollFx.current.raf) cancelAnimationFrame(scrollFx.current.raf);
    };
  }, [toc]);

  const tocItems = [{ id: "article-top", text: "Overview", level: 1 }, ...toc];

  if (!article) {
    return (
      <div className="reader-page">
        <SignalLayer />

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
      <SignalLayer />

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
