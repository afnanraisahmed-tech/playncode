/* =========================================================
   SKILL.JS — analyze user code, score HTML/CSS/JS.
   Scoring uses presence of features (tags, properties,
   keywords) — no external AI needed and fully tunable.
   ========================================================= */
const Skill = (() => {
  const analyze = ({ html, css, js }) => {
    const h = scoreHTML(html);
    const c = scoreCSS(css);
    const j = scoreJS(js);
    const overall = Math.round((h + c + j) / 3);
    let level = 'Beginner';
    if (overall >= 70) level = 'Advanced';
    else if (overall >= 40) level = 'Intermediate';

    return { html: h, css: c, js: j, overall, level };
  };

  const scoreHTML = (src) => {
    let score = 0;
    const tags = ['div','p','h1','h2','h3','ul','li','a','img','button','section','header','footer','form','input','span','table','nav'];
    tags.forEach(t => { if (new RegExp(`<${t}[\\s>]`, 'i').test(src)) score += 4; });
    if (/class="/i.test(src)) score += 6;
    if (/id="/i.test(src)) score += 4;
    if (/<style/i.test(src)) score += 3;
    if (/<script/i.test(src)) score += 3;
    if (src.length > 200) score += 5;
    return Math.min(100, score);
  };

  const scoreCSS = (src) => {
    let score = 0;
    const props = ['color','background','margin','padding','border','display','flex','grid','font-size','width','height','border-radius','box-shadow','transition','transform','position','top','left','z-index','opacity'];
    props.forEach(p => { if (new RegExp(`\\b${p}\\s*:`, 'i').test(src)) score += 4; });
    if (/@media/i.test(src)) score += 8;
    if (/@keyframes/i.test(src)) score += 8;
    if (/:hover|:focus|:active/i.test(src)) score += 6;
    if (/var\(--/i.test(src)) score += 4;
    return Math.min(100, score);
  };

  const scoreJS = (src) => {
    let score = 0;
    const kws = ['const ','let ','var ','function','=>','return','if','else','for','while','class ','new ','this.','addEventListener','querySelector','getElementById','innerHTML','fetch(','async ','await ','try','catch','map(','filter(','reduce('];
    kws.forEach(k => { if (src.includes(k)) score += 4; });
    if (/document\./i.test(src)) score += 6;
    if (/console\.log/i.test(src)) score += 3;
    if (src.length > 150) score += 5;
    return Math.min(100, score);
  };

  const render = (r) => {
    document.getElementById('skillHtml').textContent = r.html;
    document.getElementById('skillCss').textContent = r.css;
    document.getElementById('skillJs').textContent = r.js;
    document.getElementById('skillHtmlBar').style.width = r.html + '%';
    document.getElementById('skillCssBar').style.width = r.css + '%';
    document.getElementById('skillJsBar').style.width = r.js + '%';
    document.getElementById('skillOverall').textContent = `Overall: ${r.overall} — ${r.level}`;
    document.getElementById('skillFeedback').textContent = feedback(r);
    Store.setSkill(r);
  };

  const feedback = (r) => {
    const tips = [];
    if (r.html < 40) tips.push('Add more HTML tags (headings, paragraphs, sections).');
    if (r.css < 40) tips.push('Practice CSS properties like flex, margin, and colors.');
    if (r.js < 40) tips.push('Try functions, events (addEventListener), and loops.');
    if (!tips.length) tips.push('Great work! Keep pushing into advanced topics.');
    return tips.join(' ');
  };

  const init = () => {
    document.getElementById('skillAnalyze').addEventListener('click', () => {
      render(analyze(Editor.getCurrent()));
    });
    const saved = Store.getSkill();
    if (saved) render(saved);
  };

  return { init, analyze };
})();