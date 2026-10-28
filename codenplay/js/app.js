/* =========================================================
   APP.JS — glue: welcome form, routing, search, run button.
   ========================================================= */
(() => {
  const $ = (id) => document.getElementById(id);

  /* ---------------- WELCOME FORM ---------------- */
  const validateForm = () => {
    const name = $('username').value.trim();
    const age = $('age').value.trim();
    let ok = true;
    document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');

    if (name.length < 2) {
      document.querySelector('.error-msg[data-for="username"]').textContent = 'Please enter a username (min 2 chars).';
      ok = false;
    }
    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      document.querySelector('.error-msg[data-for="age"]').textContent = 'Enter a valid age (5–120).';
      ok = false;
    }
    return ok ? { name, age: ageNum } : null;
  };

  const openApp = () => {
    const user = Store.getUser();
    $('welcomeModal').classList.remove('show');
    $('app').hidden = false;
    if (user) {
      $('userName').textContent = user.name;
      $('userAvatar').textContent = user.name.charAt(0).toUpperCase();
      $('heroUserName').textContent = user.name;
    }
    refreshXP();
  };

  const refreshXP = () => {
    $('userXP').textContent = `${Store.getXP()} XP`;
  };

  const initWelcome = () => {
    const user = Store.getUser();
    if (user) {
      openApp();
    } else {
      setTimeout(() => $('welcomeModal').classList.add('show'), 100);
    }
    $('welcomeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = validateForm();
      if (!data) return;
      Store.setUser(data);
      openApp();
    });
  };

  /* ---------------- ROUTING ---------------- */
  const routes = {
    home: () => { show('home'); },
    learn: () => { show('learn'); renderLessons(); },
    practice: () => { show('practice'); Practice.startFresh(); },
    skill: () => { show('skill'); },
    reset: () => { show('home'); confirmReset(); },
    level: (id) => {
      show('home'); // workbench lives in home
      Levels.show(Number(id));
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  };

  const show = (name) => {
    ['home','learn','practice','skill','level'].forEach(v => {
      const el = $(`view-${v}`);
      if (el) el.hidden = (v !== name);
    });
    document.querySelectorAll('.nav-item[data-route]').forEach(a => a.classList.remove('active'));
    document.querySelectorAll(`.nav-item[data-route="${name}"]`).forEach(a => a.classList.add('active'));
    closeMobileSidebar();
  };

  const navigate = (route) => {
    const [base, arg] = route.split('/');
    (routes[base] || routes.home)(arg);
  };

  const initRouting = () => {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-route]');
      if (!el) return;
      e.preventDefault();
      navigate(el.dataset.route);
    });
    $('levelsToggle').addEventListener('click', () => {
      $('levelList').classList.toggle('open');
      $('levelsToggle').querySelector('.caret').textContent =
        $('levelList').classList.contains('open') ? '▾' : '▸';
    });
  };

  /* ---------------- MOBILE SIDEBAR ---------------- */
  const closeMobileSidebar = () => {
    $('sidebar').classList.remove('open');
    $('sidebarOverlay').hidden = true;
  };
  const initMobile = () => {
    $('menuToggle').addEventListener('click', () => {
      $('sidebar').classList.toggle('open');
      $('sidebarOverlay').hidden = !$('sidebar').classList.contains('open');
    });
    $('sidebarOverlay').addEventListener('click', closeMobileSidebar);
  };

  /* ---------------- RUN CODE ---------------- */
  const ERROR_MAP = [
    { test: (src) => /\bconst\b[^=]*=[^;]*$/.test(src.trim()), msg: 'Unexpected end of input — missing semicolon or value.' },
    { test: (src) => /<div[^>]*$/.test(src), msg: 'Unclosed <div> tag.' },
    { test: (src) => /\bfuncion\b/.test(src), msg: 'Typo: did you mean "function"?' },
    { test: (src) => /\bdocument\.getElementByID\b/.test(src), msg: 'Method name is getElementById (lowercase d).' }
  ];

  const detectError = (code) => {
    for (const lang of ['js','css','html']) {
      const src = code[lang];
      for (const rule of ERROR_MAP) {
        if (rule.test(src)) {
          const line = src.split('\n').findIndex(l => rule.test(l)) + 1 || 1;
          return { lang, line, msg: rule.msg };
        }
      }
    }
    return null;
  };

  const run = () => {
    const code = Editor.getCurrent();
    const err = detectError(code);
    $('errorBar').hidden = true;

    if (err) {
      $('errorBar').hidden = false;
      $('errorBar').textContent = `❌ ${err.msg} — ${err.lang.toUpperCase()} line ${err.line}`;
      Editor.switchTab(err.lang);
      Editor.markErrorLine(err.line);
      Game.lose(err.msg);
      return;
    }

    // Build iframe HTML
    const doc = `<!DOCTYPE html><html><head><style>${code.css}</style></head>
      <body>${code.html}<script>${code.js}<\/script></body></html>`;
    $('outputFrame').srcdoc = doc;

    // Update workbench title context
    Game.win();
    const xp = Store.addXP(10);
    refreshXP();

    // If on a level, mark it done
    const activeLevel = $('gameTitle').textContent.match(/Level (\d+)/);
    if (activeLevel) {
      Levels.renderSidebar();
      Store.markLevelDone(Number(activeLevel[1]));
    }
  };

  /* ---------------- SEARCH ---------------- */
  const initSearch = () => {
    const input = $('searchInput');
    const box = $('searchResults');
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) { box.hidden = true; return; }
      const lessons = (window.LESSONS_CACHE || []).filter(l =>
        l.title.toLowerCase().includes(q) || l.body.toLowerCase().includes(q));
      const levels = Levels.getAll().filter(l =>
        l.title.toLowerCase().includes(q));
      if (!lessons.length && !levels.length) { box.hidden = true; return; }
      box.innerHTML = '';
      lessons.forEach(l => {
        const d = document.createElement('div');
        d.className = 'sr-item'; d.textContent = `📚 ${l.title}`;
        d.onclick = () => { navigate('learn'); box.hidden = true; };
        box.appendChild(d);
      });
      levels.forEach(l => {
        const d = document.createElement('div');
        d.className = 'sr-item'; d.textContent = `🎯 Level ${l.id}: ${l.title}`;
        d.onclick = () => { navigate(`levels/${l.id}`); box.hidden = true; };
        box.appendChild(d);
      });
      box.hidden = false;
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) box.hidden = true;
    });
  };

  /* ---------------- LEARN RENDERER ---------------- */
  const renderLessons = async () => {
    if (window.LESSONS_CACHE) {
      paintLessons(window.LESSONS_CACHE);
      return;
    }
    const res = await fetch('data/lessons.json');
    const data = await res.json();
    window.LESSONS_CACHE = data;
    paintLessons(data);
  };

  const paintLessons = (lessons) => {
    const grid = $('learnGrid');
    grid.innerHTML = '';
    lessons.forEach(ls => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <h3>${ls.title}</h3>
        <p>${ls.body}</p>
        <pre><code>${ls.example.replace(/</g,'&lt;')}</code></pre>
        <button class="btn btn-ghost btn-sm">▶ Try it</button>
        <div class="lesson-quiz">
          <div class="quiz-q">${ls.quiz.q}</div>
          <div class="quiz-options"></div>
        </div>
      `;
      card.querySelector('.btn').onclick = () => {
        navigate('home');
        Editor.load(ls.tryIt || { html: ls.example, css: '', js: '' });
      };
      const opts = card.querySelector('.quiz-options');
      ls.quiz.options.forEach((o, i) => {
        const b = document.createElement('button');
        b.textContent = o;
        b.onclick = () => {
          b.classList.add(i === ls.quiz.answer ? 'correct' : 'wrong');
          if (i !== ls.quiz.answer) opts.children[ls.quiz.answer].classList.add('correct');
        };
        opts.appendChild(b);
      });
      grid.appendChild(card);
    });
  };

  /* ---------------- RESET ---------------- */
  const confirmReset = () => {
    if (confirm('Reset all progress, XP, practice and skill results?\nThis cannot be undone.')) {
      Store.resetAll();
      refreshXP();
      Levels.renderSidebar();
      document.getElementById('skillOverall').textContent = 'Overall: —';
      alert('Progress reset. Your account is preserved.');
    }
  };

  /* ---------------- BOOT ---------------- */
  document.addEventListener('DOMContentLoaded', async () => {
    Theme.init();
    Editor.init();
    Game.init();
    initWelcome();
    initMobile();
    initRouting();
    initSearch();
    Practice.init();
    Skill.init();

    await Levels.init();
    Levels.renderSidebar();
    Practice.load();

    $('runBtn').addEventListener('click', run);
    $('resetBtn').addEventListener('click', (e) => { e.preventDefault(); confirmReset(); });
  });
})();
