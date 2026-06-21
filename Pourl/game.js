// POURL — Water-sort engine: the four shared pets (front-face portraits for the
// mascot + leaderboard), the liquid palette, procedural solvable level
// generation, pour rules / undo / deadlock detection, scoring, and the
// pourl- local score & stat helpers. Exposed as window.PourlGame.
// Pure logic + procedural drawing (no image files, no framework).
window.PourlGame = (function () {

  // ── CHARACTERS (the four shared pets) ───────────────────────────────
  var CHARACTERS = [
    { id: 'B', name: 'Bebe',   species: 'Golden Retriever',        color: '#F4B942' },
    { id: 'E', name: 'Bambi',  species: 'Yandl Cat',               color: '#E8755C' },
    { id: 'N', name: 'Nene',   species: 'King Charles Cavalier',   color: '#4A4A4A' },
    { id: 'D', name: 'Dede',   species: 'Longhair Mini Dachshund', color: '#9B6B3A' },
  ];
  var CHAR_COLOR = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  function charColor(id) { return CHAR_COLOR[id] || '#E8755C'; }

  // ── FRONT-FACING FACE PORTRAITS (mascot + leaderboard avatars) ──────
  // Ported verbatim from Snakl so the bundle stays standalone. Draws centred
  // on the current origin; `size` maps the ~60-unit portrait to ~size pixels.
  function drawFace(ctx, id, size) {
    ctx.save();
    var sc = (size || 60) / 60;
    ctx.scale(sc, sc);

    if (id === 'B') {
      ctx.fillStyle = '#D4952A';
      ctx.beginPath(); ctx.ellipse(-18, 6, 9, 16, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, 6, 9, 16, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8882A';
      ctx.beginPath(); ctx.ellipse(-17, 8, 5, 10, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 8, 5, 10, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0B030';
      ctx.beginPath(); ctx.ellipse(0, -2, 20, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F5C84E';
      ctx.beginPath(); ctx.ellipse(0, -12, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FBDB7A';
      ctx.beginPath(); ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3A2518';
      ctx.beginPath(); ctx.arc(-8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 4.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2E2A28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.quadraticCurveTo(0, 14, 4, 10); ctx.stroke();
      ctx.fillStyle = '#E8657C';
      ctx.beginPath(); ctx.ellipse(0, 13, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath(); ctx.ellipse(0, 12.5, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    } else if (id === 'E') {
      ctx.fillStyle = '#C45A42';
      ctx.beginPath(); ctx.moveTo(-12, -28); ctx.lineTo(-6, -10); ctx.lineTo(-20, -10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -28); ctx.lineTo(6, -10); ctx.lineTo(20, -10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.moveTo(-12, -25); ctx.lineTo(-8, -12); ctx.lineTo(-18, -12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -25); ctx.lineTo(8, -12); ctx.lineTo(18, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#E8755C';
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, -18); ctx.lineTo(-3, -8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(0, -9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -18); ctx.lineTo(3, -8); ctx.stroke();
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.ellipse(0, 7, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#E76A91';
      ctx.beginPath(); ctx.ellipse(0, 4, 2.8, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#C45A42'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
      ctx.strokeStyle = 'rgba(200,160,150,.6)'; ctx.lineWidth = 1;
      [[-8,6,-20,3],[-8,7,-20,8],[8,6,20,3],[8,7,20,8]].forEach(function (w) {
        ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke();
      });

    } else if (id === 'N') {
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(-17, 6, 8, 18, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 6, 8, 18, 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath(); ctx.ellipse(-16, 8, 4, 12, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(16, 8, 4, 12, 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -2, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.arc(0, -3, 18, Math.PI + 0.15, -0.15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -5, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(0, -16, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, 8, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.arc(-7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.ellipse(0, 6, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath(); ctx.ellipse(-1, 5, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 10); ctx.quadraticCurveTo(0, 13, 3, 10); ctx.stroke();

    } else if (id === 'D') {
      ctx.fillStyle = '#6A4020';
      ctx.beginPath(); ctx.ellipse(-15, 6, 7, 16, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(15, 6, 7, 16, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9B6B3A';
      ctx.beginPath(); ctx.ellipse(0, -2, 17, 19, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7A5028';
      ctx.beginPath(); ctx.ellipse(0, -10, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.ellipse(0, 7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.arc(-6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#6A4020'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
    }

    ctx.restore();
  }

  // ── LIQUID PALETTE ──────────────────────────────────────────────────
  // ~10 distinct hues (spaced for colour-blind legibility). Each level uses
  // the first N. SYMBOLS give an optional per-colour glyph overlay (Settings).
  var PALETTE = [
    '#E8755C', // coral red
    '#4FA3E0', // blue
    '#56C98A', // green
    '#F4B942', // amber
    '#9B6BD6', // purple
    '#F58BB0', // pink
    '#3FC2C2', // teal
    '#E08A3C', // orange
    '#8B9A4B', // olive
    '#9B6B3A', // brown
  ];
  var SYMBOLS = ['●', '■', '▲', '◆', '★', '✚', '▼', '⬣', '◗', '✦'];

  var CAPACITY = 4;   // units per tube
  var UNDOS    = 3;   // undos granted per level

  // ── TUBE PRIMITIVES (a tube is an array of colour indices, bottom→top) ──
  function cloneTubes(tubes) { return tubes.map(function (t) { return t.slice(); }); }
  function topColor(t) { return t.length ? t[t.length - 1] : -1; }
  function topRun(t) {
    if (!t.length) return 0;
    var c = t[t.length - 1], n = 1;
    for (var i = t.length - 2; i >= 0; i--) { if (t[i] === c) n++; else break; }
    return n;
  }
  function isUniform(t) {
    for (var i = 1; i < t.length; i++) if (t[i] !== t[0]) return false;
    return true;
  }
  function isComplete(t, cap) {
    return t.length === 0 || (t.length === cap && isUniform(t));
  }

  // A pour is legal if source non-empty, destination has room, and either the
  // destination is empty or its top colour matches the source's top colour.
  function canPourT(tubes, from, to, cap) {
    if (from === to) return false;
    var a = tubes[from], b = tubes[to];
    if (!a.length) return false;
    if (b.length >= cap) return false;
    if (b.length === 0) return true;
    return topColor(a) === topColor(b);
  }
  // Move the whole contiguous top run that fits. Returns units moved.
  function doPour(tubes, from, to, cap) {
    if (!canPourT(tubes, from, to, cap)) return 0;
    var a = tubes[from], b = tubes[to];
    var moved = Math.min(topRun(a), cap - b.length);
    for (var i = 0; i < moved; i++) b.push(a.pop());
    return moved;
  }

  // Useful moves only — drop "done" tubes as sources and never relocate a
  // uniform tube into an empty one (legal but never helps). Used for both the
  // solver and live deadlock detection.
  function legalMoves(tubes, cap) {
    var moves = [];
    for (var i = 0; i < tubes.length; i++) {
      var a = tubes[i];
      if (!a.length || isComplete(a, cap)) continue;
      for (var j = 0; j < tubes.length; j++) {
        if (i === j || !canPourT(tubes, i, j, cap)) continue;
        if (tubes[j].length === 0 && isUniform(a)) continue;
        moves.push([i, j]);
      }
    }
    return moves;
  }
  function solvedTubes(tubes, cap) {
    for (var i = 0; i < tubes.length; i++) if (!isComplete(tubes[i], cap)) return false;
    return true;
  }
  function canon(tubes) {
    return tubes.map(function (t) { return t.join(','); }).sort().join('|');
  }
  // DFS with a visited set — returns true once any solved state is reached.
  // Bounded so a pathological fill just gets rejected and regenerated.
  function isSolvable(tubes, cap) {
    var seen = {}, stack = [cloneTubes(tubes)], count = 0, LIMIT = 200000;
    while (stack.length) {
      if (++count > LIMIT) return false;
      var cur = stack.pop();
      var key = canon(cur);
      if (seen[key]) continue;
      seen[key] = 1;
      if (solvedTubes(cur, cap)) return true;
      var mv = legalMoves(cur, cap);
      for (var k = 0; k < mv.length; k++) {
        var nt = cloneTubes(cur);
        doPour(nt, mv[k][0], mv[k][1], cap);
        if (!seen[canon(nt)]) stack.push(nt);
      }
    }
    return false;
  }

  // ── LEVEL GENERATION (procedural, guaranteed solvable, never trivial) ──
  function levelConfig(level) {
    var colors = Math.min(PALETTE.length, 3 + Math.floor((level - 1) / 2));
    var emptyTubes = colors >= 9 ? 3 : 2;
    return { colors: colors, emptyTubes: emptyTubes };
  }
  function anyTubeComplete(tubes, cap) {
    for (var i = 0; i < tubes.length; i++) if (tubes[i].length && isComplete(tubes[i], cap)) return true;
    return false;
  }
  function makeLevel(level) {
    var cap = CAPACITY;
    var cfg = levelConfig(level);
    var tubes, tries = 0;
    do {
      tries++;
      var pool = [];
      for (var c = 0; c < cfg.colors; c++) for (var n = 0; n < cap; n++) pool.push(c);
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
      }
      tubes = [];
      var p = 0;
      for (var t = 0; t < cfg.colors; t++) {
        var tube = [];
        for (var u = 0; u < cap; u++) tube.push(pool[p++]);
        tubes.push(tube);
      }
      for (var e = 0; e < cfg.emptyTubes; e++) tubes.push([]);
    } while ((anyTubeComplete(tubes, cap) || !isSolvable(tubes, cap)) && tries < 300);

    return {
      level: level, capacity: cap, colors: cfg.colors,
      tubes: tubes, undosLeft: UNDOS, undosUsed: 0, moves: 0, history: [],
    };
  }

  // ── MOVES / UNDO / WIN / DEADLOCK (operate on a level state) ─────────
  function canPour(state, from, to) { return canPourT(state.tubes, from, to, state.capacity); }
  function pour(state, from, to) {
    if (!canPourT(state.tubes, from, to, state.capacity)) return 0;
    state.history.push(cloneTubes(state.tubes));
    var moved = doPour(state.tubes, from, to, state.capacity);
    state.moves++;
    return moved;
  }
  function undo(state) {
    if (state.undosLeft <= 0 || !state.history.length) return false;
    state.tubes = state.history.pop();
    state.undosLeft--;
    state.undosUsed++;
    if (state.moves > 0) state.moves--;
    return true;
  }
  function isSolved(state) { return solvedTubes(state.tubes, state.capacity); }
  function hasUsefulMove(state) { return legalMoves(state.tubes, state.capacity).length > 0; }

  // ── SCORING ─────────────────────────────────────────────────────────
  // Harder levels (more colours) are worth more; clearing without spending an
  // undo earns a tidy bonus. Run score = sum of cleared-level points.
  function levelPoints(state) {
    return state.colors * 10 + (state.undosUsed === 0 ? 20 : 0);
  }

  // ── SCORES & STATS (per character, pourl- keys) ─────────────────────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('pourl-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('pourl-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('pourl-stats') || '{}'); } catch (_) { return { games: 0, levels: 0 }; }
  }
  function recordGame(levels) {
    var s = loadStats();
    s.games = (s.games || 0) + 1;
    s.levels = (s.levels || 0) + (levels || 0);
    localStorage.setItem('pourl-stats', JSON.stringify(s));
  }

  return {
    CHARACTERS: CHARACTERS, charColor: charColor, CHAR_EMOJI: CHAR_EMOJI, drawFace: drawFace,
    PALETTE: PALETTE, SYMBOLS: SYMBOLS, CAPACITY: CAPACITY, UNDOS: UNDOS,
    levelConfig: levelConfig, makeLevel: makeLevel, isSolvable: isSolvable,
    canPour: canPour, pour: pour, undo: undo, isSolved: isSolved, hasUsefulMove: hasUsefulMove,
    topColor: topColor, levelPoints: levelPoints,
    loadHighScores: loadHighScores, saveHighScore: saveHighScore, getGlobalHi: getGlobalHi,
    loadStats: loadStats, recordGame: recordGame,
  };
})();
