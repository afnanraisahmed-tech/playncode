/* =========================================================
   PRACTICE.JS — endless practice with shuffling on failure.
   ========================================================= */
const Practice = (() => {
  let questions = [];
  let order = [];
  let index = 0;
  let score = 0;
  let current = null;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startFresh = () => {
    index = 0; score = 0;
    order = shuffle(questions);
    render();
  };

  const render = () => {
    document.getElementById('practiceIndex').textContent = index + 1;
    document.getElementById('practiceTotal').textContent = order.length;
    document.getElementById('practiceScore').textContent = score;
    current = order[index];
    document.getElementById('practiceQuestion').textContent = current ? current.prompt : 'No questions.';
    document.getElementById('practiceFeedback').textContent = '';
    if (current) Editor.load(current.starter);
  };

  const run = () => {
    if (!current) return;
    const { html, css, js } = Editor.getCurrent();
    const err = validate(current, { html, css, js });
    const fb = document.getElementById('practiceFeedback');
    if (err) {
      fb.textContent = `❌ ${err.msg} (line ${err.line})`;
      fb.className = 'practice-feedback err';
      Editor.markErrorLine(err.line);
      Game.lose(err.msg);
      // restart
      setTimeout(startFresh, 1200);
      return;
    }
    fb.textContent = '✅ Correct! Hero wins this round.';
    fb.className = 'practice-feedback ok';
    Game.win();
    score++;
    Store.setPracticeBest(Math.max(score, Store.getPracticeBest()));
    index++;
    if (index >= order.length) {
      setTimeout(startFresh, 900); // loop
    } else {
      setTimeout(render, 900);
    }
  };

  /* Simple validators (extend as you add questions) */
  const validate = (q, code) => {
    if (!q.checks) return null;
    const all = code.html + '\n' + code.css + '\n' + code.js;
    for (const rule of q.checks) {
      if (rule.type === 'includes') {
        if (!all.includes(rule.value)) {
          const line = findLine(code, rule.value) || 1;
          return { msg: rule.message || `Missing "${rule.value}"`, line };
        }
      }
    }
    return null;
  };

  const findLine = (code, needle) => {
    const all = (code.html + '\n' + code.css + '\n' + code.js).split('\n');
    for (let i = 0; i < all.length; i++) if (all[i].includes(needle)) return i + 1;
    return 0;
  };

  const load = async () => {
    const res = await fetch('data/questions.json');
    questions = await res.json();
    startFresh();
  };

  const init = () => {
    document.getElementById('practiceRun').addEventListener('click', run);
    document.getElementById('practiceSkip').addEventListener('click', () => {
      index = (index + 1) % order.length; render();
    });
  };

  return { init, load, startFresh };
})();