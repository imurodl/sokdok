# Prototypes

Self-contained, single-file design/functionality prototypes for Sokdok. Open either HTML file directly in a browser (no build, no dependencies).

- **`app-prototype.html`** — a working, navigable prototype of the actual app. Pick a leveled Korean text, read it with a live WPM timer, tap words for glosses (saved to a word bank), do a Timed Repeated Reading re-read, take a comprehension check, see your effective-reading-rate results, and drill saved words with reaction-time tracking. The dashboard fills in as you use it. Light/dark themes.
- **`landing-vision.html`** — the marketing/landing design vision ("Ink & Signal" direction): warm ink-on-paper reading surfaces, monospace telemetry, a saffron accent, with an animated reading-speed demo.

Both use system fonts (Apple SD Gothic Neo for Korean) and inline everything. Interactions are illustrative; the real product wires these to the KRDict dictionary + Kiwi NLP service (see [`../nlp/`](../nlp/)) and the Next.js app.
