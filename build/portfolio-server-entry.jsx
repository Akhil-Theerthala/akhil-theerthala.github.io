import { renderToString } from "react-dom/server";
import "../portfolio-data.js";
import "../ambient-field.js";
import "../portfolio-sections.jsx";
import "../portfolio-app.jsx";

export function renderHomepage() {
  return renderToString(<window.App />);
}
