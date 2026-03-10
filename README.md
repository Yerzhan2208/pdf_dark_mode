# PDF Dark Mode — Chrome Extension

A minimal Chrome extension that applies a **dim dark mode** to PDF files, both when opened directly in the browser and when embedded in web pages. It only affects the PDF itself — the surrounding page, toolbar, and browser UI are left completely untouched.

---

## Features

- Dims PDF brightness without inverting colors — text and images stay natural
- Works on direct PDF URLs (`https://example.com/file.pdf`)
- Works on PDFs embedded via `<embed>`, `<iframe>`, or PDF.js-based viewers
- Simple one-click toggle — no configuration needed
- State persists across sessions via `chrome.storage.sync`
- Fully CSP-compliant with Manifest V3

---

## Installation

Since this extension is not on the Chrome Web Store, you need to load it manually as an unpacked extension.

1. Clone or download this repository
   ```
   git clone https://github.com/your-username/pdf-dark-mode.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the folder containing the extension files

The extension icon will appear in your toolbar.

---

## Usage

1. Open any PDF in Chrome (direct URL or embedded in a page)
2. Click the extension icon in the toolbar
3. Click **Enable Dim Mode** to activate
4. Click **Disable Dim Mode** to revert to normal

The setting is saved automatically and will apply on the next PDF you open.

---

## File Structure

```
pdf-dark-mode/
├── manifest.json    # Extension manifest (Manifest V3)
├── content.js       # Injected into pages — detects and styles PDFs
├── popup.html       # Extension popup UI
├── popup.css        # Popup styles
└── popup.js         # Popup logic — toggle state and messaging
```

---

## How It Works

Chrome's built-in PDF viewer runs in an isolated process, so the extension takes two different approaches depending on context:

- **Direct PDF URL** — `document.contentType` is `application/pdf`, meaning the entire page is the PDF. The filter is applied to `html` directly.
- **Embedded PDF** — the filter is scoped to the `<embed>`, `<iframe>`, or PDF.js canvas elements only, leaving the host page untouched.

The dim filter used is `brightness(0.55) contrast(1.05)` — no color inversion, no hue rotation. Just reduced brightness with a slight contrast boost to keep text readable.

---

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Access the current tab to apply styles |
| `scripting` | Re-inject the content script when the toggle is clicked |
| `storage` | Persist the on/off state across sessions |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)
