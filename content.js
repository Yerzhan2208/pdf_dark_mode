const darkStyle = `
  html {
    filter: invert(0.9) hue-rotate(180deg) !important;
    background: #111 !important;
  }
  img, video {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

function applyDarkMode() {
  if (
    document.contentType === 'application/pdf' ||
    window.location.href.endsWith('.pdf')
  ) {
    chrome.storage.sync.get(['darkModeEnabled'], (result) => {
      const enabled = result.darkModeEnabled !== false;
      if (enabled && !document.getElementById('pdf-dark-mode-style')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'pdf-dark-mode-style';
        styleElement.innerHTML = darkStyle;
        document.head.appendChild(styleElement);
      }
    });
  }
}

applyDarkMode();