const btn        = document.getElementById('toggleBtn');
const statusBar  = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');

function updateUI(enabled) {
  btn.textContent = enabled ? 'Disable Dim Mode' : 'Enable Dim Mode';
  btn.classList.toggle('on', enabled);
  statusBar.classList.toggle('on', enabled);
  statusText.textContent = enabled ? 'active' : 'inactive';
}

function reloadContentScript(tabId) {
  chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
}

chrome.storage.sync.get(['darkModeEnabled'], (result) => {
  updateUI(result.darkModeEnabled !== false);
});

btn.addEventListener('click', () => {
  chrome.storage.sync.get(['darkModeEnabled'], (result) => {
    const newState = result.darkModeEnabled === false ? true : false;
    chrome.storage.sync.set({ darkModeEnabled: newState }, () => {
      updateUI(newState);
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) reloadContentScript(tab.id);
      });
    });
  });
});