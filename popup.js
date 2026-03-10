const toggle = document.getElementById('darkToggle');
const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const modeLabel = document.getElementById('modeLabel');
const toggleRow = document.getElementById('toggleRow');

function updateUI(enabled) {
  toggle.checked = enabled;
  if (enabled) {
    statusBar.classList.add('on');
    statusText.textContent = 'active';
    modeLabel.textContent = 'Dark Mode';
  } else {
    statusBar.classList.remove('on');
    statusText.textContent = 'inactive';
    modeLabel.textContent = 'Light Mode';
  }
}

chrome.storage.sync.get(['darkModeEnabled'], (result) => {
  const enabled = result.darkModeEnabled !== false; 
  updateUI(enabled);
});

toggleRow.addEventListener('click', () => {
  const newState = !toggle.checked;
  chrome.storage.sync.set({ darkModeEnabled: newState });
  updateUI(newState);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    if (newState) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          if (!document.getElementById('pdf-dark-mode-style')) {
            const s = document.createElement('style');
            s.id = 'pdf-dark-mode-style';
            s.innerHTML = `html { filter: invert(0.9) hue-rotate(180deg) !important; background: #111 !important; } img, video { filter: invert(1) hue-rotate(180deg) !important; }`;
            document.head.appendChild(s);
          }
        }
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const el = document.getElementById('pdf-dark-mode-style');
          if (el) el.remove();
        }
      });
    }
  });
});