/* =========================================================
   STORAGE.JS — centralised localStorage access.
   Add new keys here so nothing else touches raw localStorage.
   ========================================================= */
const Store = (() => {
  const KEYS = {
    user: 'cnp_user',
    xp: 'cnp_xp',
    theme: 'cnp_theme',
    levelsDone: 'cnp_levels_done',
    practiceBest: 'cnp_practice_best',
    skill: 'cnp_skill_result'
  };

  const get = (k, fallback = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const remove = (k) => localStorage.removeItem(k);

  return {
    KEYS,
    getUser: () => get(KEYS.user, null),
    setUser: (u) => set(KEYS.user, u),
    getXP: () => get(KEYS.xp, 0),
    addXP: (n) => { const v = get(KEYS.xp, 0) + n; set(KEYS.xp, v); return v; },
    getTheme: () => get(KEYS.theme, 'default'),
    setTheme: (t) => set(KEYS.theme, t),
    getLevelsDone: () => get(KEYS.levelsDone, []),
    markLevelDone: (id) => {
      const d = get(KEYS.levelsDone, []);
      if (!d.includes(id)) { d.push(id); set(KEYS.levelsDone, d); }
      return d;
    },
    getPracticeBest: () => get(KEYS.practiceBest, 0),
    setPracticeBest: (n) => set(KEYS.practiceBest, n),
    getSkill: () => get(KEYS.skill, null),
    setSkill: (s) => set(KEYS.skill, s),
    resetAll: () => {
      // preserve user + theme so the account isn't lost
      const user = get(KEYS.user, null);
      const theme = get(KEYS.theme, 'default');
      Object.values(KEYS).forEach(remove);
      if (user) set(KEYS.user, user);
      set(KEYS.theme, theme);
    }
  };
})();