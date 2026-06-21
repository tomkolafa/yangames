// SLICL — Game engine: swipe-to-slice fruit with projectile physics, bombs,
// combos and three modes (Classic / Zen / Arcade). Exposed as window.SliclGame.
// All drawing is procedural (no image files); the GameScreen renders.
window.SliclGame = (function () {

  // ── Tuning (px, seconds) ────────────────────────────────────────────
  var GRAVITY = 1100;
  var COMBO_WINDOW = 0.8;
  var MODES = {
    classic: { lives: 3, time: 0,  bombs: true,  label: 'Classic' },
    zen:     { lives: 0, time: 90, bombs: false, label: 'Zen'     },
    arcade:  { lives: 0, time: 60, bombs: true,  label: 'Arcade'  },
  };

  // Fruit palette — each is drawn as a shaded ball with a small leaf.
  var FRUITS = [
    { id: 'watermelon', rind: '#3FA35A', flesh: '#F0577E', r: 30 },
    { id: 'orange',     rind: '#F39B36', flesh: '#FFC06B', r: 26 },
    { id: 'apple',      rind: '#E2483D', flesh: '#F39FA0', r: 25 },
    { id: 'lemon',      rind: '#F4D03F', flesh: '#FBE89A', r: 23 },
    { id: 'lime',       rind: '#7FB93B', flesh: '#CDE89A', r: 23 },
    { id: 'plum',       rind: '#8E5BD0', flesh: '#C9A8EC', r: 24 },
    { id: 'blueberry',  rind: '#4F7AD0', flesh: '#9DB8EC', r: 20 },
  ];
  function fruitById(id) { for (var i = 0; i < FRUITS.length; i++) if (FRUITS[i].id === id) return FRUITS[i]; return FRUITS[0]; }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeSliceState(opts) {
    opts = opts || {};
    var mode = MODES[opts.mode] ? opts.mode : 'classic';
    var cfg = MODES[mode];
    return {
      w: opts.w || 360, h: opts.h || 600,
      mode: mode, cfg: cfg,
      fruits: [], halves: [], particles: [], pops: [],
      score: 0,
      lives: cfg.lives, missed: 0,
      timeLeft: cfg.time, elapsed: 0,
      spawnTimer: 0.6,
      comboTimer: 0, comboCount: 0, bestCombo: 0,
      freezeTime: 0, doubleTime: 0,
      shake: 0,
      over: false, win: false,
    };
  }

  function setField(s, w, h) { if (s) { s.w = w; s.h = h; } }

  // Spawn a wave of 1–N fruit (plus the occasional bomb / special banana).
  function spawnWave(s) {
    var diff = Math.min(1, s.elapsed / 70);          // ramps 0→1 over ~70s
    var n = 1 + Math.floor(Math.random() * (2 + Math.round(diff * 2)));
    for (var i = 0; i < n; i++) spawnOne(s, false);
    // Bomb chance grows slightly with difficulty.
    if (s.cfg.bombs && Math.random() < 0.12 + diff * 0.12) spawnOne(s, true);
    // Arcade special banana — rare buff pickup.
    if (s.mode === 'arcade' && Math.random() < 0.05) spawnSpecial(s);
    s.spawnTimer = Math.max(0.32, 1.0 - diff * 0.6) * rand(0.8, 1.25);
  }

  function launchVel(s, x) {
    // Aim the arc to peak in the upper third; fan away from the edges.
    var vy = -rand(820, 980);
    var inward = (s.w / 2 - x) * 0.6;
    var vx = inward / (s.w / 2) * rand(60, 180) + rand(-70, 70);
    return { vx: vx, vy: vy };
  }

  function spawnOne(s, bomb) {
    var x = rand(s.w * 0.12, s.w * 0.88);
    var v = launchVel(s, x);
    var fr = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    s.fruits.push({
      x: x, y: s.h + 34, vx: v.vx, vy: v.vy,
      r: bomb ? 24 : fr.r, rot: rand(0, 6.28), vr: rand(-3, 3),
      type: bomb ? 'bomb' : fr.id, bomb: !!bomb, special: false, sliced: false,
    });
  }

  function spawnSpecial(s) {
    var x = rand(s.w * 0.2, s.w * 0.8);
    var v = launchVel(s, x);
    var buffs = ['freeze', 'double', 'frenzy'];
    s.fruits.push({
      x: x, y: s.h + 34, vx: v.vx, vy: v.vy, r: 24, rot: 0, vr: rand(-2, 2),
      type: 'banana', bomb: false, special: buffs[Math.floor(Math.random() * buffs.length)], sliced: false,
    });
  }

  // Advance physics, spawning, misses, timers. Returns events.
  function update(s, dt) {
    var ev = { missed: 0, over: false, win: false };
    if (!s || s.over) return ev;
    dt = Math.min(dt, 0.05);
    var slow = s.freezeTime > 0 ? 0.35 : 1;   // freeze buff slows everything

    s.elapsed += dt;
    if (s.comboTimer > 0) s.comboTimer -= dt;
    if (s.freezeTime > 0) s.freezeTime -= dt;
    if (s.doubleTime > 0) s.doubleTime -= dt;
    if (s.shake > 0) s.shake -= dt;

    // Timed modes
    if (s.cfg.time > 0) {
      if (s.freezeTime <= 0) s.timeLeft -= dt;
      if (s.timeLeft <= 0) { s.timeLeft = 0; s.over = true; s.win = true; ev.over = true; ev.win = true; return ev; }
    }

    // Spawning
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) spawnWave(s);

    // Fruit physics
    for (var i = s.fruits.length - 1; i >= 0; i--) {
      var f = s.fruits[i];
      f.vy += GRAVITY * dt * slow;
      f.x += f.vx * dt * slow; f.y += f.vy * dt * slow; f.rot += f.vr * dt * slow;
      if (f.y - f.r > s.h + 20 && f.vy > 0) {
        // Fell off the bottom.
        if (!f.bomb && !f.special) {
          ev.missed++;
          if (s.cfg.lives > 0) { s.lives--; if (s.lives <= 0) { s.over = true; ev.over = true; } }
        }
        s.fruits.splice(i, 1);
      }
    }

    // Halves & particles
    for (var hh = s.halves.length - 1; hh >= 0; hh--) {
      var h = s.halves[hh]; h.vy += GRAVITY * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; h.life -= dt;
      if (h.life <= 0 || h.y - 40 > s.h) s.halves.splice(hh, 1);
    }
    for (var p = s.particles.length - 1; p >= 0; p--) {
      var q = s.particles[p]; q.vy += GRAVITY * 0.4 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
      if (q.life <= 0) s.particles.splice(p, 1);
    }
    for (var pp = s.pops.length - 1; pp >= 0; pp--) {
      var po = s.pops[pp]; po.y -= 26 * dt; po.life -= dt; if (po.life <= 0) s.pops.splice(pp, 1);
    }
    return ev;
  }

  // Segment (x1,y1)->(x2,y2) vs circle (cx,cy,r). Projection-clamp-distance.
  function segHitsCircle(x1, y1, x2, y2, cx, cy, r) {
    var dx = x2 - x1, dy = y2 - y1;
    var len2 = dx * dx + dy * dy;
    var t = len2 ? ((cx - x1) * dx + (cy - y1) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    var px = x1 + t * dx, py = y1 + t * dy;
    return Math.hypot(px - cx, py - cy) <= r;
  }

  function addParticles(s, x, y, color, n) {
    for (var i = 0; i < (n || 9); i++) {
      var a = Math.random() * 6.28, sp = rand(60, 240);
      s.particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rand(0.3, 0.6), max: 0.6, r: rand(2, 4.5), color: color });
    }
  }

  function sliceFruit(s, f, nx, ny, ev) {
    f.sliced = true;
    var meta = f.bomb ? { flesh: '#FF6B5C' } : f.special ? { flesh: '#FFD24A' } : fruitById(f.type);
    // Two halves flung along the slice normal.
    for (var k = 0; k < 2; k++) {
      var side = k ? 1 : -1;
      s.halves.push({
        x: f.x, y: f.y, vx: f.vx * 0.4 + nx * side * 120, vy: f.vy * 0.4 + ny * side * 120 - 40,
        r: f.r, rot: f.rot, vr: side * rand(2, 5), half: k, type: f.type, color: meta.flesh, life: 1.4,
      });
    }
    addParticles(s, f.x, f.y, meta.flesh, f.bomb ? 16 : 10);
    var idx = s.fruits.indexOf(f); if (idx >= 0) s.fruits.splice(idx, 1);
  }

  // Apply a swipe segment. Returns events { hits, bomb, comboAward }.
  function slice(s, x1, y1, x2, y2) {
    var ev = { hits: 0, bomb: false, comboAward: 0, special: null, over: false };
    if (!s || s.over) return ev;
    for (var i = s.fruits.length - 1; i >= 0; i--) {
      var f = s.fruits[i];
      if (f.sliced) continue;
      if (!segHitsCircle(x1, y1, x2, y2, f.x, f.y, f.r + 4)) continue;

      var nx = -(y2 - y1), ny = (x2 - x1), nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;

      if (f.bomb) {
        sliceFruit(s, f, nx, ny, ev);
        ev.bomb = true; s.shake = 0.4;
        if (s.mode === 'arcade') { s.score = Math.max(0, s.score - 10); s.pops.push({ x: f.x, y: f.y, text: '-10', life: 0.9, color: '#E2483D' }); }
        else { s.over = true; ev.over = true; }
        continue;
      }

      sliceFruit(s, f, nx, ny, ev);
      ev.hits++;

      if (f.special) { applyBuff(s, f.special); ev.special = f.special; s.pops.push({ x: f.x, y: f.y, text: f.special.toUpperCase() + '!', life: 1.1, color: '#FFB200' }); continue; }

      // Score + combo
      var pts = s.doubleTime > 0 ? 2 : 1;
      s.score += pts;
      if (s.comboTimer > 0) s.comboCount++; else s.comboCount = 1;
      s.comboTimer = COMBO_WINDOW;
      if (s.comboCount > s.bestCombo) s.bestCombo = s.comboCount;
      if (s.comboCount >= 3) {
        var bonus = s.comboCount;
        s.score += bonus; ev.comboAward = s.comboCount;
        s.pops.push({ x: f.x, y: f.y - 10, text: 'Combo +' + bonus, life: 1.0, color: '#56C98A' });
      }
    }
    return ev;
  }

  function applyBuff(s, buff) {
    if (buff === 'freeze') s.freezeTime = 5;
    else if (buff === 'double') s.doubleTime = 7;
    else if (buff === 'frenzy') { for (var i = 0; i < 8; i++) spawnOne(s, false); }
  }

  // ── SCORES & STATS (per mode, with slicl- keys) ────────────────────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('slicl-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(mode, score) {
    var hs = loadHighScores();
    if (!hs[mode] || score > hs[mode]) { hs[mode] = Math.floor(score); localStorage.setItem('slicl-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('slicl-stats') || '{}'); } catch (_) { return { games: 0, bestCombo: 0 }; }
  }
  function recordGame(combo) {
    var s = loadStats(); s.games = (s.games || 0) + 1;
    if (combo && combo > (s.bestCombo || 0)) s.bestCombo = combo;
    localStorage.setItem('slicl-stats', JSON.stringify(s));
  }

  return {
    MODES: MODES, FRUITS: FRUITS, fruitById: fruitById,
    makeSliceState: makeSliceState, setField: setField, update: update, slice: slice,
    loadHighScores: loadHighScores, saveHighScore: saveHighScore, getGlobalHi: getGlobalHi,
    loadStats: loadStats, recordGame: recordGame,
  };
})();
