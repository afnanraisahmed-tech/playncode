/* =========================================================
   GAME.JS — pixel-art hero/enemy canvas with win/lose anims.
   Uses simple rectangles as placeholders (swap for images).
   ========================================================= */
const Game = (() => {
  let canvas, ctx;
  let hero = { x: 90, y: 170, hp: 100, maxHp: 100, attack: false };
  let enemy = { x: 330, y: 170, hp: 100, maxHp: 100, attack: false };
  let status = 'idle'; // idle | running | win | lose
  let animId = null;

  const drawPixelRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;

    ctx.fillRect(x, y, w, h);
  };

  const drawHero = () => {
    // body
    drawPixelRect(hero.x, hero.y, 30, 34, '#8b6cff');
    drawPixelRect(hero.x + 4, hero.y - 12, 22, 14, '#f5c451'); // crown
    drawPixelRect(hero.x + 8, hero.y + 8, 6, 6, '#0a0e2a');    // eye
    drawPixelRect(hero.x + 18, hero.y + 8, 6, 6, '#0a0e2a');
    // sword
    drawPixelRect(hero.x + 32, hero.y + 12, 4, 22, '#e0e0ff');
    drawPixelRect(hero.x + 30, hero.y + 32, 8, 4, '#f5c451');
    // HP bar
    ctx.fillStyle = '#2a0a10'; ctx.fillRect(hero.x, hero.y - 26, 34, 4);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(hero.x, hero.y - 26, 34 * (hero.hp / hero.maxHp), 4);
  };

  const drawEnemy = () => {
    drawPixelRect(enemy.x, enemy.y, 34, 34, '#ff5c7a');
    drawPixelRect(enemy.x + 6, enemy.y + 10, 6, 6, '#fff');
    drawPixelRect(enemy.x + 22, enemy.y + 10, 6, 6, '#fff');
    drawPixelRect(enemy.x + 8, enemy.y + 22, 18, 4, '#0a0e2a');
    ctx.fillStyle = '#2a0a10'; ctx.fillRect(enemy.x, enemy.y - 26, 34, 4);
    ctx.fillStyle = '#ff5c7a';
    ctx.fillRect(enemy.x, enemy.y - 26, 34 * (enemy.hp / enemy.maxHp), 4);
  };

  const drawGround = () => {
    drawPixelRect(0, 220, canvas.width, 80, '#161b3d');
    drawPixelRect(0, 220, canvas.width, 4, '#8b6cff');
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // starry sky
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random()*0.3})`;
      ctx.fillRect((i*37)%canvas.width, (i*23)%140, 2, 2);
    }
    drawGround();
    drawHero();
    drawEnemy();
    if (status === 'win') {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#f5c451'; ctx.font = 'bold 26px Poppins, sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('VICTORY! 👑', canvas.width/2, 120);
    }
    if (status === 'lose') {
      ctx.fillStyle = 'rgba(60,0,20,0.5)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#ff5c7a'; ctx.font = 'bold 26px Poppins, sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('DEFEATED...', canvas.width/2, 120);
    }
  };

  const loop = () => { draw(); animId = requestAnimationFrame(loop); };

  const setStatus = (txt, kind='') => {
    const el = document.getElementById('gameStatus');
    el.textContent = txt; el.className = 'game-status ' + kind;
  };

  const win = () => {
    status = 'win';
    enemy.hp = 0;
    setStatus('Your code ran! Hero wins! 🎉 +XP', 'win');
  };

  const lose = (msg) => {
    status = 'lose';
    hero.hp = 0;
    setStatus(msg || 'Your code failed. Hero was defeated.', 'lose');
  };

  const reset = () => {
    hero.hp = hero.maxHp; enemy.hp = enemy.maxHp;
    status = 'idle';
    setStatus('Press Run to begin the battle.');
  };

  const init = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    loop();
  };

  return { init, win, lose, reset };
})();