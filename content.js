(function () {
  // Guard against being injected more than once
  if (window.__pdfDarkModeLoaded) {
    run();
    return;
  }
  window.__pdfDarkModeLoaded = true;

  function buildCSS() {
    const f = 'brightness(0.55) contrast(1.05)';
    if (document.contentType === 'application/pdf') {
      return `html { filter: ${f} !important; background: #1a1a1a !important; }`;
    }
    return `
      embed[type="application/pdf"], embed[src$=".pdf"], embed[src*=".pdf?"],
      iframe[src$=".pdf"], iframe[src*=".pdf?"],
      body > embed, body > object[type="application/pdf"] {
        filter: ${f} !important;
      }
      #viewer .page canvas, .pdfViewer .page canvas {
        filter: ${f} !important;
      }
    `;
  }

  function isExtensionValid() {
    try { return !!chrome.runtime?.id; } catch { return false; }
  }

  function removeStyle() {
    document.getElementById('pdf-dark-mode-style')?.remove();
  }

  function applyStyle() {
    removeStyle();
    const el = document.createElement('style');
    el.id = 'pdf-dark-mode-style';
    el.textContent = buildCSS();
    (document.head || document.documentElement).appendChild(el);
  }

  function isPDFPage() {
    if (document.contentType === 'application/pdf') return true;
    if (window.location.href.match(/\.pdf(\?|#|$)/i)) return true;
    if (document.querySelector(
      'embed[type="application/pdf"], embed[src$=".pdf"], ' +
      'iframe[src$=".pdf"], object[type="application/pdf"]'
    )) return true;
    return false;
  }

  function run() {
    if (!isPDFPage()) return;
    if (!isExtensionValid()) return;
    try {
      chrome.storage.sync.get(['darkModeEnabled'], (result) => {
        if (!isExtensionValid()) return;
        if (chrome.runtime.lastError) return;
        if (result.darkModeEnabled !== false) applyStyle();
        else removeStyle();
      });
    } catch { /* context gone */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  let debounce;
  const observer = new MutationObserver(() => {
    if (!isExtensionValid()) { observer.disconnect(); return; }
    clearTimeout(debounce);
    debounce = setTimeout(run, 300);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();