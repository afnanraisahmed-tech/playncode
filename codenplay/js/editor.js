/* =========================================================
   EDITOR.JS — code editor with tabs, line numbers,
   syntax highlighting (lightweight), run/reset.
   ========================================================= */
const Editor = (() => {
  const state = {
    html: '', css: '', js: '',
    active: 'html',
    defaults: { html: '', css: '', js: '' } // per-context defaults set by app
  };

  const $ = (id) => document.getElementById(id);
  const input = () => $('codeInput');
  const highlight = () => $('highlightLayer').querySelector('code');
  const lineNums = () => $('lineNumbers');

  /* ---- Very small regex highlighter (safe, no eval) ---- */
  const escape = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const highlightHTML = (src) => escape(src)
    .replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="tok-tag">$2</span>')
    .replace(/([a-zA-Z-]+)=(&quot;.*?&quot;|".*?")/g, '<span class="tok-attr">$1</span>=<span class="tok-str">$2</span>');

  const highlightCSS = (src) => escape(src)
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-com">$1</span>')
    .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="tok-attr">$1</span>$2')
    .replace(/(#[0-9a-fA-F]{3,8}|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s)?\b)/g, '<span class="tok-num">$1</span>');

  const highlightJS = (src) => escape(src)
    .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="tok-com">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="tok-str">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|class|new|this|true|false|null|undefined|=>|import|export|of|in)\b/g, '<span class="tok-kw">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

  const renderHighlight = () => {
    const src = input().value;
    const map = { html: highlightHTML, css: highlightCSS, js: highlightJS };
    highlight().innerHTML = (map[state.active] || escape)(src) + '\n';
  };

  const renderLineNumbers = () => {
    const lines = input().value.split('\n').length || 1;
    lineNums().textContent = Array.from({length: lines}, (_,i)=>i+1).join('\n');
  };

  const syncScroll = () => {
    const wrap = input().parentElement;
    $('lineNumbers').scrollTop = wrap.scrollTop;
    highlight().parentElement.scrollTop = wrap.scrollTop;
    highlight().parentElement.scrollLeft = wrap.scrollLeft;
  };

  /* ---- Public: switch tab ---- */
  const switchTab = (lang) => {
    // save current
    state[state.active] = input().value;
    state.active = lang;
    input().value = state[lang] || '';
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
    renderHighlight();
    renderLineNumbers();
  };

  /* ---- Public: load a full snippet ---- */
  const load = ({ html='', css='', js='' }) => {
    state.html = html; state.css = css; state.js = js;
    state.defaults = { html, css, js };
    state.active = 'html';
    input().value = html;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.lang === 'html'));
    renderHighlight();
    renderLineNumbers();
  };

  const getCurrent = () => {
    state[state.active] = input().value;
    return { html: state.html, css: state.css, js: state.js };
  };

  const reset = () => load(state.defaults);

  /* ---- Highlight a single error line (1-based) ---- */
  const markErrorLine = (lineNumber) => {
    const lines = input().value.split('\n');
    const pre = lines.slice(0, lineNumber - 1).join('\n');
    const bad = lines[lineNumber - 1] || '';
    const post = lines.slice(lineNumber).join('\n');
    input().value = pre + (pre ? '\n' : '') + bad + (post ? '\n' : '') + post;
    // simple approach: set selection to line
    const start = pre.length + (pre ? 1 : 0);
    input().setSelectionRange(start, start + bad.length);
    input().focus();
    renderHighlight();
  };

  /* ---- Init ---- */
  const init = () => {
    const ta = input();
    ta.addEventListener('input', () => {
      state[state.active] = ta.value;
      renderHighlight();
      renderLineNumbers();
    });
    ta.addEventListener('scroll', syncScroll);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        state[state.active] = ta.value;
        renderHighlight();
      }
    });
    document.querySelectorAll('.tab').forEach(t =>
      t.addEventListener('click', () => switchTab(t.dataset.lang))
    );
    $('resetCodeBtn').addEventListener('click', reset);
    load({ html: '<h1>Hello, CodeNPlay!</h1>', css: 'h1 { color: gold; }', js: '' });
  };

  return { init, load, getCurrent, reset, markErrorLine, switchTab };
})();
