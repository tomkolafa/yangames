// SNAKL — Game Screen (canvas-based grid snake with the four pets)

function SnaklGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');
  var initFnRef = React.useRef(null);
  var Game      = window.SnaklGame;
  var hiRef     = React.useRef(Game.loadHighScores()[charId] || 0);

  var [phase,       setPhase]       = React.useState('idle');
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [hiScore,     setHiScore]     = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);

  var dark       = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR   = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  var charColor  = CHAR_CLR[charId] || '#E8755C';
  var tbColor    = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'snakl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'snakl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }

  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

  // ── Start / restart ───────────────────────────────────────────────
  function startGame() {
    if (initFnRef.current) stateRef.current = initFnRef.current();
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    snd('start');
  }

  // Apply a direction (and start the game from idle / dead).
  function inputDir(dx, dy) {
    var ph = phaseRef.current;
    if (ph === 'idle' || ph === 'dead') startGame();
    var s = stateRef.current;
    if (s) Game.queueDir(s, dx, dy);
  }

  function handleTap() {
    var ph = phaseRef.current;
    if (ph === 'idle' || ph === 'dead') startGame();
  }

  // ── Keyboard input (arrows + WASD; Space starts/restarts) ─────────
  React.useEffect(function () {
    var MAP = {
      ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
      ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
    };
    function onKey(e) {
      var m = MAP[e.code];
      if (m) { e.preventDefault(); inputDir(m[0], m[1]); return; }
      if (e.code === 'Space') { e.preventDefault(); if (phaseRef.current !== 'playing') startGame(); }
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  }, []);

  // ── Main effect: canvas sizing + swipe input + fixed-tick loop ────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = canvas.parentElement;
    var COLS = Game.COLS, ROWS = Game.ROWS;

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

    // Layout (recomputed on resize). Backing store scaled by DPR; game coords
    // stay in CSS pixels. The board is a centered square of COLS×ROWS cells.
    var GW = 320, GH = 500, DPR = 1;
    var layout = { cell: 18, offX: 0, offY: 0, boardPx: 18 * COLS };

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 320;
      GH = Math.floor(container.offsetHeight) || 500;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      var pad = 12;
      var avail = Math.min(GW, GH) - pad * 2;
      var cell = Math.max(6, Math.floor(avail / COLS));
      var boardPx = cell * COLS;
      layout = { cell: cell, offX: Math.round((GW - boardPx) / 2), offY: Math.round((GH - boardPx) / 2), boardPx: boardPx };
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    // Fresh game state — reads the walls setting at the moment a game starts.
    function makeState() { return Game.makeSnakeState(localStorage.getItem('snakl-walls') === '1'); }
    initFnRef.current = makeState;
    stateRef.current  = makeState();

    // ── Swipe input ──────────────────────────────────────────────
    var tsx = 0, tsy = 0;
    function onTouchStart(e) { var t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; }
    function onTouchMove(e)  { if (phaseRef.current === 'playing') e.preventDefault(); }
    function onTouchEnd(e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - tsx, dy = t.clientY - tsy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;   // a tap → onClick handles start
      if (Math.abs(dx) > Math.abs(dy)) inputDir(dx > 0 ? 1 : -1, 0);
      else                             inputDir(0, dy > 0 ? 1 : -1);
      e.preventDefault();
    }
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove',  onTouchMove,  { passive: false });
    container.addEventListener('touchend',   onTouchEnd,   { passive: false });

    // ── Theme palette ────────────────────────────────────────────
    var pageBg, boardBg, checker, scoreCol, mutedScore, hintCol;
    if (theme === 'clean-dark') {
      pageBg = '#1A1918'; boardBg = '#262422'; checker = 'rgba(255,255,255,.04)';
      scoreCol = 'rgba(255,255,255,.85)'; mutedScore = 'rgba(255,255,255,.4)'; hintCol = 'rgba(255,255,255,.5)';
    } else if (theme === 'funky') {
      pageBg = '#2C3A4B'; boardBg = '#243140'; checker = 'rgba(255,255,255,.05)';
      scoreCol = 'rgba(255,255,255,.9)'; mutedScore = 'rgba(255,255,255,.45)'; hintCol = 'rgba(255,255,255,.55)';
    } else if (theme === 'classic') {
      pageBg = '#FFFFFF'; boardBg = '#F0F0F0'; checker = 'rgba(0,0,0,.045)';
      scoreCol = '#3A3A3C'; mutedScore = '#9A9A9A'; hintCol = 'rgba(0,0,0,.42)';
    } else {
      pageBg = '#FBF7F0'; boardBg = '#F0EAE0'; checker = 'rgba(70,60,50,.05)';
      scoreCol = '#5A5048'; mutedScore = '#A89E92'; hintCol = 'rgba(46,42,40,.42)';
    }

    // ── Render ───────────────────────────────────────────────────
    function render(s) {
      var ctx = canvas.getContext('2d');
      var cell = layout.cell, ox = layout.offX, oy = layout.offY, bp = layout.boardPx;

      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);

      // Board panel + faint checkerboard
      ctx.fillStyle = boardBg; ctx.fillRect(ox, oy, bp, bp);
      ctx.fillStyle = checker;
      for (var gy = 0; gy < ROWS; gy++) {
        for (var gx = 0; gx < COLS; gx++) {
          if ((gx + gy) % 2 === 0) ctx.fillRect(ox + gx * cell, oy + gy * cell, cell, cell);
        }
      }

      // Food (rotated for variety)
      if (s.food) {
        ctx.save();
        ctx.translate(ox + s.food.x * cell + cell / 2, oy + s.food.y * cell + cell / 2);
        ctx.rotate(s.food.angle || 0);
        Game.drawFood(ctx, s.food.type, cell);
        ctx.restore();
      }

      // Snake body — rounded squares in the pet's colour (tail → head)
      var rad = Math.max(3, cell * 0.3);
      for (var i = s.snake.length - 1; i >= 0; i--) {
        var seg = s.snake[i];
        var px = ox + seg.x * cell, py = oy + seg.y * cell;
        ctx.fillStyle = charColor;
        rr(ctx, px + 1.5, py + 1.5, cell - 3, cell - 3, rad); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,.10)';
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,.10)';
        rr(ctx, px + 1.5, py + 1.5, cell - 3, cell - 3, rad); ctx.stroke();
      }

      // Head — the pet's front-facing face, drawn over its body cell
      var h = s.snake[0];
      ctx.save();
      ctx.translate(ox + h.x * cell + cell / 2, oy + h.y * cell + cell / 2);
      Game.drawFace(ctx, charId, cell * 1.04);
      ctx.restore();

      // HUD — score above the board
      ctx.textAlign = 'center';
      ctx.fillStyle = scoreCol;
      ctx.font = '800 22px Fredoka, Nunito, sans-serif';
      ctx.textBaseline = 'middle';
      var hudY = Math.max(16, oy * 0.46);
      ctx.fillText(String(s.score), GW / 2, hudY);
      ctx.fillStyle = mutedScore;
      ctx.font = '700 11px Nunito, sans-serif';
      ctx.fillText('HI ' + hiRef.current, GW / 2, hudY + 18);

      // Idle hint over the board
      if (phaseRef.current === 'idle') {
        ctx.fillStyle = hintCol;
        ctx.font = '700 14px Nunito, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('Swipe or press an arrow', GW / 2, oy + bp / 2 - 9);
        ctx.fillText('to start', GW / 2, oy + bp / 2 + 11);
      }
    }

    // ── Fixed-tick loop (accumulator inside one rAF) ─────────────
    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    var acc = 0;

    function handleDeath(s) {
      var score  = s.score;
      var prevHi = hiRef.current;
      Game.saveHighScore(charId, score);
      Game.recordGame();
      var newHi = Game.loadHighScores()[charId] || 0;
      hiRef.current = Math.max(prevHi, newHi);
      setHiScore(hiRef.current);
      setFinalScore(score);
      setIsNewRecord(newHi > prevHi && score > 0);
      phaseRef.current = 'dead';
      setPhase('dead');
      snd('gameover');
    }

    function loop(now) {
      var s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(loop); return; }
      var dt = Math.min(now - last, 250); last = now;

      if (phaseRef.current === 'playing') {
        acc += dt;
        var guard = 0;
        while (acc >= s.tickMs && guard < 8) {
          acc -= s.tickMs; guard++;
          var ev = Game.step(s);
          if (ev === 'eat') {
            snd('key');
            s.tickMs = Game.speedFor(s.snake.length);
            if (s.score > 0 && s.score % 10 === 0) snd('milestone');
          } else if (ev === 'dead') {
            handleDeath(s);
            break;
          }
        }
      }

      render(s);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return function () {
      cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove',  onTouchMove);
      container.removeEventListener('touchend',   onTouchEnd);
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
          display: 'flex', alignItems: 'center', gap: 4,
          WebkitTapHighlightColor: 'transparent',
        }}>← Back</button>

        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          letterSpacing: '0.08em', color: charColor,
        }}>SNAKL</div>

        <button onClick={onBoard} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          fontFamily: 'var(--font-body)',
          WebkitTapHighlightColor: 'transparent',
        }}>Scores</button>
      </div>

      {/* Canvas game area */}
      <div
        onClick={handleTap}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'pointer', touchAction: 'none' }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* ── Game Over overlay ── */}
        {phase === 'dead' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            background: dark ? 'rgba(0,0,0,.58)' : 'rgba(251,247,240,.80)',
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30,
                color: charColor, letterSpacing: '0.08em',
              }}>GAME OVER</div>

              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8,
                color: dark ? 'rgba(255,255,255,.92)' : 'var(--text-body)',
              }}>{finalScore}</div>

              {isNewRecord && (
                <div style={{
                  marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D',
                  animation: 'snakl-bounce 0.9s ease-in-out infinite',
                }}>🏅 New Record!</div>
              )}

              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)' }}>
                {'HI ' + hiScore}
              </div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }}
                style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <button
                    onClick={function (e) { e.stopPropagation(); setShowPrompt(true); }}
                    style={{
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
              <button
                onClick={function (e) { e.stopPropagation(); startGame(); }}
                style={{
                  border: 'none', background: charColor, color: '#fff',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                  padding: '12px 28px', borderRadius: 999, cursor: 'pointer',
                  boxShadow: '0 4px 0 rgba(0,0,0,.22)',
                  WebkitTapHighlightColor: 'transparent',
                }}>Try Again</button>

              <button
                onClick={function (e) { e.stopPropagation(); onBoard(); }}
                style={{
                  border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
                  background: 'transparent',
                  color: dark ? 'rgba(255,255,255,.8)' : 'var(--text-body)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                  padding: '12px 20px', borderRadius: 999, cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}>Scores</button>
            </div>

            <div style={{ fontSize: 11, fontWeight: 500, color: dark ? 'rgba(255,255,255,.3)' : 'var(--text-muted)', animation: 'snakl-pulse 2s ease infinite' }}>
              Tap or press SPACE to restart
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.SnaklGameScreen = SnaklGameScreen;
