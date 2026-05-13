// Article reader overlay — slides up, loads markdown
const { useState, useEffect, useRef } = React;

function ArticleReader({ article, onClose, accent }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!article) return;
    setLoading(true);
    setError(false);
    setContent("");
    setProgress(0);

    fetch(`My writings/${article.file}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
      .then(text => {
        if (window.marked) {
          setContent(window.marked.parse(text));
        } else {
          setContent(`<pre style="white-space: pre-wrap; font-family: inherit;">${text}</pre>`);
        }
        setLoading(false);
      })
      .catch(() => {
        // No bundled markdown — send the reader to Medium and close the overlay.
        window.open('https://medium.com/@akhiltvsn', '_blank', 'noopener,noreferrer');
        onClose();
      });
  }, [article]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
  };

  if (!article) return null;

  return (
    <div className="reader-overlay" onClick={onClose}>
      <div className="reader-progress"><div className="reader-progress-fill" style={{ width: `${progress * 100}%`, background: accent }}></div></div>
      <div className="reader-panel" onClick={(e) => e.stopPropagation()}>
        <header className="reader-topbar">
          <button className="reader-close" onClick={onClose}>
            <span style={{fontSize: '1.1rem', lineHeight: 1}}>←</span> Close
          </button>
          <div className="reader-meta-top">
            <span className="mono">{article.category}</span>
            <span className="reader-dot">·</span>
            <span className="mono">{article.date}</span>
            {article.read && <><span className="reader-dot">·</span><span className="mono">{article.read}</span></>}
          </div>
          <button className="reader-close" onClick={onClose} style={{opacity: 0.7}}>
            Esc
          </button>
        </header>

        <div className="reader-scroll" ref={scrollRef} onScroll={onScroll}>
          <article className="reader-article">
            <p className="reader-eyebrow mono">Writing · {article.year}</p>
            <h1 className="reader-title">{article.title}</h1>
            <p className="reader-byline">Akhil Theerthala · {article.date}</p>
            <div className="reader-divider" style={{background: accent, opacity: 0.4}}></div>

            {loading && <div className="reader-loading">Loading article…</div>}
            {error && (
              <div className="reader-error">
                <p>Article markdown isn't bundled in this preview. You can read the source on Medium or the live site:</p>
                <a href="https://medium.com/@akhiltvsn" target="_blank" rel="noreferrer" className="reader-link">medium.com/@akhiltvsn →</a>
              </div>
            )}
            {content && <div className="reader-body" dangerouslySetInnerHTML={{ __html: content }}></div>}

            <div className="reader-footer">
              <div className="reader-divider" style={{background: 'var(--rule)', opacity: 1}}></div>
              <p className="reader-footer-text">
                Thanks for reading. If something here was useful, sloppy, or wrong — <a href="mailto:akhiltvsn@gmail.com" className="reader-link" style={{color: accent}}>say hi</a>.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

window.ArticleReader = ArticleReader;
