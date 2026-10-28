/* =========================================================
   LEVELS.JS — loads data/levels.json, renders sidebar links
   and level detail panel. Unlock logic lives here.
   ========================================================= */
const Levels = (() => {
  let data = [];

  const isUnlocked = (level) => {
    if (level.id === 1) return true;
    const done = Store.getLevelsDone();
    return done.includes(level.id - 1);
  };

  const renderSidebar = () => {
    const list = document.getElementById('levelList');
    list.innerHTML = '';
    data.forEach(lv => {
      const unlocked = isUnlocked(lv);
      const done = Store.getLevelsDone().includes(lv.id);
      const a = document.createElement('a');
      a.className = `nav-item ${unlocked ? '' : 'locked'}`;
      a.dataset.route = `levels/${lv.id}`;
      a.innerHTML = `<span class="nav-icon">${done ? '✅' : unlocked ? '🎯' : '🔒'}</span> Level ${lv.id}: ${lv.title}`;
      list.appendChild(a);
    });
  };

  const show = (id) => {
    const lv = data.find(l => l.id === id);
    if (!lv) return;
    document.getElementById('levelTitle').textContent = `Level ${lv.id} — ${lv.title}`;
    document.getElementById('levelSub').textContent = lv.description;
    document.getElementById('levelRequirements').textContent = '📋 ' + lv.requirements;
    document.getElementById('levelHint').textContent = '💡 ' + lv.hint;
    document.getElementById('levelReward').textContent = `🏅 Reward: ${lv.reward} (+${lv.xp} XP)`;

    // Load starter code into editor
    Editor.load(lv.starter);
    Game.reset();
    document.getElementById('gameTitle').textContent = `Level ${lv.id} — ${lv.title}`;
  };

  const load = async () => {
    const res = await fetch('data/levels.json');
    data = await res.json();
    renderSidebar();
  };

  const getAll = () => data;
  const getById = (id) => data.find(l => l.id === id);

  return { init: load, renderSidebar, show, getAll, getById, isUnlocked };
})();