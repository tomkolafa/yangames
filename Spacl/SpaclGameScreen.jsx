// SPACL — Game Screen (canvas-based side-scrolling shoot-'em-up)

// One on-screen action button (DOM — crisp, themable) with a pressed state.
function SpaclActionButton({ label, glyph, badge, accent, dark, onPress }) {
  var [down, setDown] = React.useState(false);
  function press(e) { e.preventDefault(); setDown(true); onPress(); }
  function release() { setDown(false); }
  return React.createElement('button', {
    'aria-label': label,
    onPointerDown: press, onPointerUp: release, onPointerLeave: release, onPointerCancel: release,
    onContextMenu: function (e) { e.preventDefault(); },
    style: {
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 64, height: 64, borderRadius: 18, cursor: 'pointer',
      border: '1px solid ' + (dark ? 'rgba(255,255,255,.10)' : 'var(--hairline)'),
      background: down ? accent : (dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.045)'),
      color: down ? '#fff' : accent,
      boxShadow: down ? 'none' : '0 2px 0 rgba(0,0,0,.10)',
      transform: down ? 'scale(.93)' : 'scale(1)',
      transition: 'transform 80ms ease, background 80ms ease, color 80ms ease',
      WebkitTapHighlightColor: 'transparent', touchAction: 'none',
    },
  },
    glyph,
    badge != null && React.createElement('span', {
      style: {
        position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, padding: '0 5px',
        borderRadius: 999, background: accent, color: '#fff',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,.3)',
      },
    }, badge)
  );
}

function SpaclGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');     // idle | playing | levelclear | dead
  var ctrlRef   = React.useRef({ hasPointer: false, px: 0, py: 0, keys: {}, clearTimer: 0, nextLevel: 1 });
  var Game      = window.SpaclGame;
  var hiRef     = React.useRef(Game.loadHighScores()[charId] || 0);

  var [phase,       setPhase]       = React.useState('idle');
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [finalLevel,  setFinalLevel]  = React.useState(1);
  var [hiScore,     setHiScore]     = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);
  var [special,     setSpecial]     = React.useState(2);

  var dark       = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR   = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  var charColor  = CHAR_CLR[charId] || '#E8755C';
  var tbColor    = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'spacl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'spacl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }
  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

  function autofireOn() { return localStorage.getItem('spacl-autofire') !== '0'; }

  // ── Start / restart (fresh level 1) ───────────────────────────────
  function startGame() {
    var canvas = canvasRef.current;
    var w = canvas ? canvas.parentElement.offsetWidth : 360;
    var h = canvas ? canvas.parentElement.offsetHeight : 560;
    stateRef.current = Game.makeSpaceState({ w: w, h: h, level: 1 });
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    setSpecial(stateRef.current.specials);
    snd('start');
  }

  function fireSpecial() {
    if (phaseRef.current !== 'playing') return;
    if (Game.fireSpecial(stateRef.current)) { snd('jump'); setSpecial(stateRef.current.specials); }
  }

  // ── Keyboard input (arrows + WASD move; Space fires special / starts) ─
  React.useEffect(function () {
    function down(e) {
      var c = ctrlRef.current;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].indexOf(e.code) >= 0) {
        e.preventDefault(); c.keys[e.code] = true;
        if (phaseRef.current !== 'playing') startGame();
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (phaseRef.current !== 'playing') startGame(); else fireSpecial();
      }
    }
    function up(e) { ctrlRef.current.keys[e.code] = false; }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return function () { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // ── Main effect: canvas sizing + pointer input + rAF loop ─────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = canvas.parentElement;

    phaseRef.current = 'idle';
    setPhase('idle');

    function rr(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    }

    var GW = 360, GH = 560, DPR = 1;
    var stars = [];
    function seedStars() {
      stars = [];
      var n = 46;
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * GW, y: Math.random() * GH, r: Math.random() < 0.7 ? 1 : 1.8, layer: 0.4 + Math.random() * 1.6 });
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 360;
      GH = Math.floor(container.offsetHeight) || 560;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      if (stateRef.current) Game.setField(stateRef.current, GW, GH);
      seedStars();
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    // ── Pointer input — drag to move the ship ────────────────────
    var c = ctrlRef.current;
    function localPt(e) {
      var rect = canvas.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function pdown(e) {
      e.preventDefault();
      if (phaseRef.current === 'idle' || phaseRef.current === 'dead') startGame();
      var p = localPt(e); c.hasPointer = true; c.px = p.x; c.py = p.y;
    }
    function pmove(e) { if (!c.hasPointer) return; e.preventDefault(); var p = localPt(e); c.px = p.x; c.py = p.y; }
    function pup() { c.hasPointer = false; }
    container.addEventListener('pointerdown', pdown);
    container.addEventListener('pointermove', pmove);
    window.addEventListener('pointerup', pup);
    container.addEventListener('touchstart', pdown, { passive: false });
    container.addEventListener('touchmove', pmove, { passive: false });
    window.addEventListener('touchend', pup);

    // ── Theme palette ────────────────────────────────────────────
    var pageTop, pageBot, starCol, hudCol, mutedCol, hintCol, bulletCol;
    if (theme === 'clean-dark')      { pageTop = '#12161F'; pageBot = '#0B0E16'; starCol = 'rgba(255,255,255,.5)'; hudCol = 'rgba(255,255,255,.9)'; mutedCol = 'rgba(255,255,255,.45)'; hintCol = 'rgba(255,255,255,.55)'; bulletCol = '#FFE9A8'; }
    else if (theme === 'funky')      { pageTop = '#241A3A'; pageBot = '#160F26'; starCol = 'rgba(255,255,255,.6)'; hudCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.5)'; hintCol = 'rgba(255,255,255,.6)'; bulletCol = '#9BE8FF'; }
    else if (theme === 'classic')    { pageTop = '#1B1B1B'; pageBot = '#000000'; starCol = 'rgba(255,255,255,.55)'; hudCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.5)'; hintCol = 'rgba(255,255,255,.6)'; bulletCol = '#FFFFFF'; }
    else                             { pageTop = '#26314A'; pageBot = '#161D2E'; starCol = 'rgba(255,255,255,.5)'; hudCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.5)'; hintCol = 'rgba(255,255,255,.62)'; bulletCol = '#FFE9A8'; }

    function heart(ctx, x, y, sz, fill) {
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(0, sz * 0.3);
      ctx.bezierCurveTo(0, 0, -sz, 0, -sz, sz * 0.35);
      ctx.bezierCurveTo(-sz, sz * 0.75, 0, sz, 0, sz * 1.15);
      ctx.bezierCurveTo(0, sz, sz, sz * 0.75, sz, sz * 0.35);
      ctx.bezierCurveTo(sz, 0, 0, 0, 0, sz * 0.3);
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function drawShip(ctx, s) {
      var sh = s.ship, t = (performance.now() / 1000);
      ctx.save();
      ctx.translate(sh.x, sh.y);
      if (s.invuln > 0 && Math.floor(s.invuln * 12) % 2 === 0) ctx.globalAlpha = 0.4;
      // Thruster flame
      var fl = 8 + Math.sin(t * 30) * 4;
      ctx.fillStyle = 'rgba(255,180,90,.9)';
      ctx.beginPath(); ctx.moveTo(-15, -5); ctx.lineTo(-15 - fl, 0); ctx.lineTo(-15, 5); ctx.closePath(); ctx.fill();
      // Hull
      ctx.fillStyle = charColor;
      ctx.beginPath();
      ctx.moveTo(20, 0); ctx.lineTo(-12, -14); ctx.quadraticCurveTo(-17, 0, -12, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.18)';
      ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-12, 14); ctx.quadraticCurveTo(-6, 6, 20, 0); ctx.closePath(); ctx.fill();
      // Cockpit = pet face
      ctx.save(); ctx.translate(-1, 0); Game.drawFace(ctx, charId, 21); ctx.restore();
      ctx.globalAlpha = 1;
      // Shield ring
      if (s.shieldTime > 0) {
        ctx.strokeStyle = 'rgba(143,211,255,' + (0.5 + Math.sin(t * 8) * 0.2) + ')';
        ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, sh.r + 9, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }

    function drawEnemy(ctx, e) {
      ctx.save(); ctx.translate(e.x, e.y);
      var col = e.flash > 0 ? '#FFFFFF' : Game.charColorForEnemy(e);
      ctx.fillStyle = col;
      if (e.type === 'meteor') {
        ctx.save(); ctx.rotate(e.t * (e.spin || 1));
        ctx.beginPath();
        for (var a = 0; a < 8; a++) { var ang = a / 8 * Math.PI * 2, rr2 = e.r * (a % 2 ? 0.8 : 1); ctx[a ? 'lineTo' : 'moveTo'](Math.cos(ang) * rr2, Math.sin(ang) * rr2); }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.arc(2, -2, e.r * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (e.type === 'triship') {
        ctx.beginPath(); ctx.moveTo(-e.r, 0); ctx.lineTo(e.r, -e.r); ctx.lineTo(e.r, e.r); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(2, 0, 2.6, 0, Math.PI * 2); ctx.fill();
      } else if (e.type === 'squid') {
        ctx.beginPath(); ctx.arc(0, -2, e.r, Math.PI, 0); ctx.lineTo(e.r, e.r * 0.4);
        for (var w = 0; w < 4; w++) { ctx.lineTo(e.r - w * (e.r / 2) - 2, e.r + Math.sin(e.t * 6 + w) * 3); ctx.lineTo(e.r - w * (e.r / 2) - (e.r / 4) - 2, e.r * 0.4); }
        ctx.lineTo(-e.r, e.r * 0.4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-4, -2, 2.4, 0, Math.PI * 2); ctx.arc(4, -2, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2E2A28'; ctx.beginPath(); ctx.arc(-4, -2, 1.1, 0, Math.PI * 2); ctx.arc(4, -2, 1.1, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.moveTo(-e.r, 0); ctx.lineTo(0, -e.r); ctx.lineTo(e.r, 0); ctx.lineTo(0, e.r); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2E2A28'; ctx.beginPath(); ctx.arc(0, 0, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawBoss(ctx, bo) {
      ctx.save(); ctx.translate(bo.x, bo.y);
      ctx.fillStyle = bo.flash > 0 ? '#FFFFFF' : '#3A3550';
      rr(ctx, -bo.r, -bo.r, bo.r * 2, bo.r * 2, 14); ctx.fill();
      ctx.fillStyle = '#E8755C';
      ctx.beginPath(); ctx.moveTo(-bo.r, -bo.r * 0.5); ctx.lineTo(-bo.r - 12, 0); ctx.lineTo(-bo.r, bo.r * 0.5); ctx.closePath(); ctx.fill();
      // Eye
      ctx.fillStyle = '#FFD24A'; ctx.beginPath(); ctx.ellipse(-6, 0, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28'; ctx.beginPath(); ctx.arc(-9, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function render(s, dtAlpha) {
      var ctx = canvas.getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, GH);
      grad.addColorStop(0, pageTop); grad.addColorStop(1, pageBot);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, GW, GH);

      // Starfield
      var off = s ? s.starOff : 0;
      ctx.fillStyle = starCol;
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var sx = ((st.x - off * st.layer) % GW + GW) % GW;
        ctx.globalAlpha = 0.3 + st.layer * 0.3;
        ctx.beginPath(); ctx.arc(sx, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!s) return;

      // Power-ups
      var PU = { missile: { c: '#F4B942', g: '✦' }, laser: { c: '#4FA3E0', g: '≡' }, shield: { c: '#8FD3B6', g: '◯' }, life: { c: '#E8755C', g: '♥' } };
      for (var p = 0; p < s.powerups.length; p++) {
        var pu = s.powerups[p], cfg = PU[pu.type];
        ctx.save(); ctx.translate(pu.x, pu.y);
        ctx.fillStyle = cfg.c; rr(ctx, -pu.r, -pu.r, pu.r * 2, pu.r * 2, 5); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '800 14px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(cfg.g, 0, 1); ctx.restore();
      }

      // Enemy bullets
      ctx.fillStyle = '#FF8A6B';
      for (var eb = 0; eb < s.ebullets.length; eb++) { var b2 = s.ebullets[eb]; ctx.beginPath(); ctx.arc(b2.x, b2.y, b2.r, 0, Math.PI * 2); ctx.fill(); }

      // Enemies + boss
      for (var e = 0; e < s.enemies.length; e++) drawEnemy(ctx, s.enemies[e]);
      if (s.boss) drawBoss(ctx, s.boss);

      // Player bullets
      ctx.fillStyle = bulletCol;
      for (var b = 0; b < s.bullets.length; b++) { var bl = s.bullets[b]; rr(ctx, bl.x - bl.r, bl.y - bl.r * 0.5, bl.r * 2.4, bl.r, bl.r * 0.5); ctx.fill(); }

      // Missiles
      ctx.fillStyle = '#F4D58D';
      for (var m = 0; m < s.missiles.length; m++) { var mi = s.missiles[m]; ctx.save(); ctx.translate(mi.x, mi.y); ctx.rotate(Math.atan2(mi.vy, mi.vx)); ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-5, -3.5); ctx.lineTo(-5, 3.5); ctx.closePath(); ctx.fill(); ctx.restore(); }

      // Particles
      for (var pa = 0; pa < s.particles.length; pa++) { var q = s.particles[pa]; ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;

      // Ship
      drawShip(ctx, s);

      // ── HUD ──
      // lives (hearts, top-left)
      for (var L = 0; L < s.lives; L++) heart(ctx, 16 + L * 18, 14, 6, '#E8755C');
      // score (center)
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = hudCol; ctx.font = '800 20px Fredoka, Nunito, sans-serif';
      ctx.fillText(String(s.score), GW / 2, 10);
      // level (right)
      ctx.textAlign = 'right'; ctx.fillStyle = mutedCol; ctx.font = '700 12px Nunito, sans-serif';
      ctx.fillText('LEVEL ' + s.level, GW - 12, 14);
      // boss hp bar
      if (s.boss && !s.boss.entering) {
        var bw = GW * 0.6, bx = (GW - bw) / 2, by = 36;
        ctx.fillStyle = 'rgba(255,255,255,.15)'; rr(ctx, bx, by, bw, 6, 3); ctx.fill();
        ctx.fillStyle = '#E8755C'; rr(ctx, bx, by, bw * Math.max(0, s.boss.hp / s.boss.maxHp), 6, 3); ctx.fill();
      }
      // buff indicators
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.font = '700 11px Nunito, sans-serif';
      var by2 = 26;
      if (s.laserTime > 0)  { ctx.fillStyle = '#4FA3E0'; ctx.fillText('LASER ' + Math.ceil(s.laserTime) + 's', 14, by2); by2 += 14; }
      if (s.shieldTime > 0) { ctx.fillStyle = '#8FD3B6'; ctx.fillText('SHIELD ' + Math.ceil(s.shieldTime) + 's', 14, by2); }

      // Idle hint
      if (phaseRef.current === 'idle') {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = hintCol;
        ctx.font = '700 15px Nunito, sans-serif';
        ctx.fillText('Drag to fly • auto-fire', GW / 2, GH / 2 - 10);
        ctx.fillText('Tap to launch', GW / 2, GH / 2 + 12);
      }
      // Level-clear banner
      if (phaseRef.current === 'levelclear') {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, GH / 2 - 46, GW, 92);
        ctx.fillStyle = '#F4D58D'; ctx.font = '800 26px Fredoka, sans-serif';
        ctx.fillText('SECTOR CLEAR', GW / 2, GH / 2 - 8);
        ctx.fillStyle = hudCol; ctx.font = '700 15px Nunito, sans-serif';
        ctx.fillText('Level ' + ctrlRef.current.nextLevel + ' incoming…', GW / 2, GH / 2 + 18);
      }
    }

    // ── Movement integration ─────────────────────────────────────
    function moveShip(s, dt) {
      var sh = s.ship, pad = 6, topPad = 30;
      if (c.hasPointer) {
        var tx = c.px, ty = c.py - 34;   // lift target above the finger
        sh.x += (tx - sh.x) * Math.min(1, dt * 16);
        sh.y += (ty - sh.y) * Math.min(1, dt * 16);
      } else {
        var vx = 0, vy = 0, SP = 260;
        if (c.keys.ArrowLeft || c.keys.KeyA) vx -= SP;
        if (c.keys.ArrowRight || c.keys.KeyD) vx += SP;
        if (c.keys.ArrowUp || c.keys.KeyW) vy -= SP;
        if (c.keys.ArrowDown || c.keys.KeyS) vy += SP;
        sh.x += vx * dt; sh.y += vy * dt;
      }
      sh.x = Math.max(sh.r + pad, Math.min(GW - sh.r - pad, sh.x));
      sh.y = Math.max(sh.r + topPad, Math.min(GH - sh.r - pad, sh.y));
    }

    function handleDeath(s) {
      var score = s.score, prevHi = hiRef.current;
      Game.saveHighScore(charId, score);
      Game.recordGame(s.level);
      var newHi = Game.loadHighScores()[charId] || 0;
      hiRef.current = Math.max(prevHi, newHi);
      setHiScore(hiRef.current);
      setFinalScore(score); setFinalLevel(s.level);
      setIsNewRecord(newHi > prevHi && score > 0);
      phaseRef.current = 'dead'; setPhase('dead');
      snd('gameover');
    }

    // ── Loop ─────────────────────────────────────────────────────
    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    function loop(now) {
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var s = stateRef.current;

      if (s && phaseRef.current === 'playing') {
        moveShip(s, dt);
        var firing = autofireOn() || c.hasPointer || c.keys.Space;
        var ev = Game.updateGame(s, dt, { firing: firing });
        if (ev.shots) snd('key');
        if (ev.powerup) snd('flip');
        if (ev.milestone) snd('milestone');
        if (ev.hit) snd('invalid');
        if (s.specials !== special) setSpecial(s.specials);
        if (ev.died) { handleDeath(s); }
        else if (ev.levelClear) {
          ctrlRef.current.nextLevel = s.level + 1;
          ctrlRef.current.clearTimer = 1.7;
          ctrlRef.current.carry = { score: s.score, lives: s.lives, specials: s.specials };
          phaseRef.current = 'levelclear'; setPhase('levelclear'); snd('win');
        }
      } else if (s && phaseRef.current === 'levelclear') {
        // keep particles/starfield ticking, then advance
        s.starOff = (s.starOff + dt * 40) % 1000;
        ctrlRef.current.clearTimer -= dt;
        if (ctrlRef.current.clearTimer <= 0) {
          var cr = ctrlRef.current.carry;
          stateRef.current = Game.makeSpaceState({ w: GW, h: GH, level: ctrlRef.current.nextLevel, score: cr.score, lives: cr.lives, specials: cr.specials });
          phaseRef.current = 'playing'; setPhase('playing');
        }
      }

      render(stateRef.current, 0);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return function () {
      cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      container.removeEventListener('pointerdown', pdown);
      container.removeEventListener('pointermove', pmove);
      window.removeEventListener('pointerup', pup);
      container.removeEventListener('touchstart', pdown);
      container.removeEventListener('touchmove', pmove);
      window.removeEventListener('touchend', pup);
    };
  }, [theme, charId]);

  // ── UI ────────────────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', minHeight: 0 }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 12px', flexShrink: 0,
        borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none',
      }}>
        <button onClick={onBack} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10,
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          WebkitTapHighlightColor: 'transparent',
        }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: charColor }}>SPACL</div>
        <button onClick={onBoard} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          fontFamily: 'var(--font-body)', WebkitTapHighlightColor: 'transparent',
        }}>Scores</button>
      </div>

      {/* Canvas game area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Special button overlaid bottom-right */}
        {phase !== 'dead' && (
          <div style={{ position: 'absolute', right: 'max(14px, env(safe-area-inset-right))', bottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <SpaclActionButton
              label="Launch missiles" accent={charColor} dark={dark} badge={special}
              glyph={React.createElement('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M12 2c2.5 2.5 4 5.5 4 9 0 1.6-.5 3-1.2 4.2L12 13l-2.8 2.2C8.5 14 8 12.6 8 11c0-3.5 1.5-6.5 4-9z' }),
                React.createElement('path', { d: 'M8.5 16l-2 4 3-1.5M15.5 16l2 4-3-1.5' }))}
              onPress={fireSpecial}
            />
          </div>
        )}

        {/* Game Over overlay */}
        {phase === 'dead' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            background: dark ? 'rgba(0,0,0,.62)' : 'rgba(15,18,28,.62)', backdropFilter: 'blur(5px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: charColor, letterSpacing: '0.08em' }}>GAME OVER</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8, color: 'rgba(255,255,255,.92)' }}>{finalScore}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>{'Reached Level ' + finalLevel}</div>
              {isNewRecord && (
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D', animation: 'spacl-bounce 0.9s ease-in-out infinite' }}>🏅 New Record!</div>
              )}
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>{'HI ' + hiScore}</div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <button onClick={function (e) { e.stopPropagation(); setShowPrompt(true); }} style={{
                    border: 'none', background: charColor, color: '#fff',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                    padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
                    boxShadow: '0 3px 0 rgba(0,0,0,.20)', WebkitTapHighlightColor: 'transparent',
                  }}>Add your name to save your score</button>
                )}
              </div>
            )}
            {showPrompt && ID && React.createElement(ID.NamePrompt, {
              theme: theme, dismissible: true,
              onSave: function (nm) { setShowPrompt(false); submitWith(nm); },
              onClose: function () { setShowPrompt(false); },
            })}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startGame} style={{
                border: 'none', background: charColor, color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                padding: '12px 28px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,.22)',
                WebkitTapHighlightColor: 'transparent',
              }}>Try Again</button>
              <button onClick={onBoard} style={{
                border: '2px solid rgba(255,255,255,.22)', background: 'transparent', color: 'rgba(255,255,255,.85)',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                padding: '12px 20px', borderRadius: 999, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}>Scores</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.SpaclGameScreen = SpaclGameScreen;
