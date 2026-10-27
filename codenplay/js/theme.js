/* =========================================================
   THEME.JS — dark / light / default(system) switcher.
   ========================================================= */
const Theme = (() => {
  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.themeBtn === theme);
    });
    Store.setTheme(theme);
  };

  const init = () => {
    const saved = Store.getTheme();
    apply(saved);
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.themeBtn));
    });
    // React to system changes when in default mode
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if (Store.getTheme() === 'default') apply('default');
    });
  };

  return { init, apply };
})();