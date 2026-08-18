/**
 * Inline script that applies the persisted theme before first paint to avoid
 * a flash of the wrong theme (FOUC). Reads from localStorage, falling back to
 * the OS preference.
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('accesspath:theme');
        var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
        var root = document.documentElement;
        root.classList.toggle('dark', dark);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
