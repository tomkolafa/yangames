// PACKL — Game Screen (canvas Pac-Man with the four pets, 5 themed levels)

// A small chevron glyph for the on-screen D-pad (inherits the button's colour).
function packlChevron(d) {
  return React.createElement('svg', {
    width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  }, React.createElement('path', { d: d }));
}

// One D-pad direction button (DOM — crisp, themable, accessible) with a pressed state.
function PacklDirButton({ glyph, label, accent, dark, onPress }) {
  var [down, setDown] = React.useState(false);
  function press(e) { e.preventDefault(); setDown(true); onPress(); }
  function release() { setDown(false); }
  return React.createElement('button', {
    'aria-label': label,
    onPointerDown: press, onPointerUp: release, onPointerLeave: release, onPointerCancel: release,
    onContextMenu: function (e) { e.preventDefault(); },
    style: {
      gridArea: label.toLowerCase(),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 56, borderRadius: 16, cursor: 'pointer',
      border: '1px solid ' + (dark ? 'rgba(255,255,255,.10)' : 'var(--hairline)'),
      background: down ? accent : (dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.045)'),
      color: down ? '#fff' : accent,
      boxShadow: down ? 'none' : '0 2px 0 rgba(0,0,0,.10)',
      transform: down ? 'scale(.93)' : 'scale(1)',
      transition: 'transform 80ms ease, background 80ms ease, color 80ms ease',
      WebkitTapHighlightColor: 'transparent', touchAction: 'none',
    },
  }, glyph);
}

function PacklGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');
  var timerRef  = React.useRef(0);      // ms remaining for a timed interstitial
  var initFnRef = React.useRef(null);
  var Game      = window.PacklGame;
  var hiRef     = React.useRef(Game.loadHighScores()[charId] || 0);

  var [phase,       setPhase]       = React.useState('idle');
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [hiScore,     setHiScore]     = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);
  var [won,         setWon]         = React.useState(false);
  var showDpad = (typeof localStorage !== 'undefined') && localStorage.getItem('packl-dpad') !== '0';

  var dark       = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR   = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  var charColor  = CHAR_CLR[charId] || '#E8755C';
  var tbColor    = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'packl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'packl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }

  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

  // setGamePhase keeps the ref (read by the loop) and React state (overlays) in sync.
  function setGamePhase(p) { phaseRef.current = p; setPhase(p); }

  // ── Start / restart a whole run ───────────────────────────────────
  function startGame() {
    if (initFnRef.current) stateRef.current = initFnRef.current();
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    setWon(false);
    timerRef.current = 1500;            // brief "LEVEL 1 · DESERT" intro
    setGamePhase('intro');
    snd('start');
  }

  // Apply a direction (and start the run from idle / dead).
  function inputDir(dx, dy) {
    var ph = phaseRef.current;
    if (ph === 'idle' || ph === 'dead') { startGame(); var s0 = stateRef.current; if (s0) Game.queueDir(s0, dx, dy); return; }
    if (ph === 'intro') { timerRef.current = 0; } // tap-to-skip the intro
    var s = stateRef.current;
    if (s) Game.queueDir(s, dx, dy);
  }

  function handleTap() {
    var ph = phaseRef.current;
    if (ph === 'idle' || ph === 'dead') startGame();
    else if (ph === 'intro' || ph === 'levelclear' || ph === 'win') timerRef.current = 0;
  }

  // ── Keyboard input (arrows + WASD; Space starts/skips) ────────────
  React.useEffect(function () {
    var MAP = {
      ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
      ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
    };
    function onKey(e) {
      var m = MAP[e.code];
      if (m) { e.preventDefault(); inputDir(m[0], m[1]); return; }
      if (e.code === 'Space') { e.preventDefault(); handleTap(); }
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  }, []);

  // ── Main effect: canvas sizing + swipe input + sim loop ───────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = canvas.parentElement;
    var COLS = Game.COLS, ROWS = Game.ROWS;
    var SIM = 1 / 120;               // fixed 120 Hz simulation substep
    var HUD = 56;                    // top HUD band height (CSS px)

    phaseRef.current = 'idle';
    setPhase('idle');

    // Layout (recomputed on resize). Board is a centred COLS×ROWS grid below the HUD.
    var GW = 320, GH = 540, DPR = 1;
    var layout = { cell: 16, offX: 0, offY: HUD };

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 320;
      GH = Math.floor(container.offsetHeight) || 540;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      var padX = 8, padB = 8;
      var availW = GW - padX * 2;
      var availH = GH - HUD - padB;
      var cell = Math.max(6, Math.floor(Math.min(availW / COLS, availH / ROWS)));
      var boardW = cell * COLS, boardH = cell * ROWS;
      layout = {
        cell: cell,
        offX: Math.round((GW - boardW) / 2),
        offY: Math.round(HUD + (availH - boardH) / 2),
      };
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    // Fresh run state (also used for the idle preview board).
    function makeState() { var s = Game.makeGameState(charId); Game.loadLevel(s, 0); return s; }
    initFnRef.current = makeState;
    stateRef.current  = makeState();

    // ── Swipe input ──────────────────────────────────────────────
    var tsx = 0, tsy = 0;
    function onTouchStart(e) { var t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; }
    function onTouchMove(e)  { if (phaseRef.current === 'playing') e.preventDefault(); }
    function onTouchEnd(e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - tsx, dy = t.clientY - tsy;
      if (Math.abs(dx) < 22 && Math.abs(dy) < 22) return;   // a tap → onClick handles start/skip
      if (Math.abs(dx) > Math.abs(dy)) inputDir(dx > 0 ? 1 : -1, 0);
      else                             inputDir(0, dy > 0 ? 1 : -1);
      e.preventDefault();
    }
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove',  onTouchMove,  { passive: false });
    container.addEventListener('touchend',   onTouchEnd,   { passive: false });

    // ── Site-theme palette (chrome / HUD only) ───────────────────
    var pageBg, scoreCol, mutedCol, hintCol, overlayWash;
    if (theme === 'clean-dark') {
      pageBg = '#1A1918'; scoreCol = 'rgba(255,255,255,.9)'; mutedCol = 'rgba(255,255,255,.45)'; hintCol = 'rgba(255,255,255,.6)'; overlayWash = 'rgba(0,0,0,.45)';
    } else if (theme === 'funky') {
      pageBg = '#2C3A4B'; scoreCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.5)'; hintCol = 'rgba(255,255,255,.62)'; overlayWash = 'rgba(0,0,0,.42)';
    } else if (theme === 'classic') {
      pageBg = '#FFFFFF'; scoreCol = '#2E2A28'; mutedCol = '#9A9A9A'; hintCol = 'rgba(0,0,0,.5)'; overlayWash = 'rgba(0,0,0,.30)';
    } else {
      pageBg = '#FBF7F0'; scoreCol = '#3A3430'; mutedCol = '#A89E92'; hintCol = 'rgba(46,42,40,.5)'; overlayWash = 'rgba(0,0,0,.28)';
    }

    // a tiny pac wedge used for the life icons
    function lifeIcon(ctx, x, y, r) {
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = charColor;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, 0.32 * Math.PI, 2 * Math.PI - 0.32 * Math.PI); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // ── Render ───────────────────────────────────────────────────
    function render(s, now) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);
      if (!s || !s.maze) return;

      var cfg = Game.levelConfig(s.level);
      var palette = Game.themePalette(cfg.theme);

      // World (background, maze, pellets, fruit, ghosts, pac)
      Game.drawWorld(ctx, s, layout, palette, now, s.charId);

      // ── HUD band ──
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      // level chip (left)
      var chip = 'LV ' + (s.level + 1) + ' · ' + cfg.name.toUpperCase();
      ctx.font = '800 12px Fredoka, Nunito, sans-serif';
      var chipW = ctx.measureText(chip).width + 18;
      ctx.fillStyle = palette.accent;
      (function () { var x = 10, y = 12, h = 22, r = 11;
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + chipW, y, x + chipW, y + h, r);
        ctx.arcTo(x + chipW, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + chipW, y, r); ctx.closePath(); ctx.fill();
      })();
      ctx.fillStyle = '#fff';
      ctx.fillText(chip, 19, 23);

      // score (right, big) + HI under it
      ctx.textAlign = 'right';
      ctx.fillStyle = scoreCol;
      ctx.font = '800 24px Fredoka, Nunito, sans-serif';
      ctx.fillText(String(s.score), GW - 10, 22);
      ctx.fillStyle = mutedCol;
      ctx.font = '700 11px Nunito, sans-serif';
      ctx.fillText('HI ' + hiRef.current, GW - 10, 42);

      // lives (left, under the chip)
      for (var i = 0; i < s.lives; i++) lifeIcon(ctx, 18 + i * 20, 44, 7);

      // ── Interstitial / hint text over the board ──
      var ph = phaseRef.current;
      var cxp = GW / 2, cyp = layout.offY + (ROWS * layout.cell) / 2;
      function banner(big, small, bigColor) {
        ctx.fillStyle = overlayWash;
        ctx.fillRect(0, cyp - 46, GW, 92);
        ctx.textAlign = 'center';
        ctx.fillStyle = bigColor || '#fff';
        ctx.font = '800 30px Fredoka, Nunito, sans-serif';
        ctx.fillText(big, cxp, cyp - 8);
        if (small) {
          ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.font = '700 15px Nunito, sans-serif';
          ctx.fillText(small, cxp, cyp + 22);
        }
      }
      if (ph === 'idle') {
        ctx.textAlign = 'center'; ctx.fillStyle = hintCol;
        ctx.font = '700 14px Nunito, sans-serif';
        ctx.fillText('Swipe or press an arrow', cxp, cyp - 8);
        ctx.fillText('to start chomping', cxp, cyp + 12);
      } else if (ph === 'intro') {
        banner('LEVEL ' + (s.level + 1), cfg.name, charColor);
      } else if (ph === 'levelclear') {
        banner('LEVEL CLEAR!', '+' + (200 * (s.level)) + ' bonus', '#9FE2A8');
      } else if (ph === 'dying') {
        banner('OUCH!', s.lives + (s.lives === 1 ? ' life left' : ' lives left'), '#F2A9C4');
      } else if (ph === 'win') {
        banner('YOU WIN! 🎉', 'All 5 levels cleared', charColor);
      }
    }

    // ── Event handling (sound + score side-effects + transitions) ──
    function applyEvents(ev, s) {
      if (ev.ate === 'dot') snd('key');
      else if (ev.ate === 'energizer') snd('flip');
      if (ev.ghostsEaten.length) snd('win');
      if (ev.fruitEaten) snd('milestone');
      if (ev.levelClear) { handleLevelClear(s); return; }
      if (ev.pacDied)    { handleDeath(s); }
    }

    function handleLevelClear(s) {
      s.score += 200 * (s.level + 1);          // level-clear bonus
      snd('milestone');
      if (s.level >= Game.levelCount() - 1) {
        s.won = true;
        timerRef.current = 1900; setGamePhase('win');
      } else {
        timerRef.current = 1500; setGamePhase('levelclear');
      }
    }

    function handleDeath(s) {
      s.lives -= 1;
      if (s.lives > 0) { snd('lose'); timerRef.current = 1100; setGamePhase('dying'); }
      else { snd('lose'); finalizeGame(s); }
    }

    function finalizeGame(s) {
      if (s.won) s.score += 50 * s.lives;       // survival bonus on a full clear
      var score  = s.score;
      var prevHi = hiRef.current;
      Game.saveHighScore(s.charId, score);
      Game.recordGame({ cleared: s.won ? Game.levelCount() : s.level, won: s.won });
      var newHi = Game.loadHighScores()[s.charId] || 0;
      hiRef.current = Math.max(prevHi, newHi);
      setHiScore(hiRef.current);
      setFinalScore(score);
      setIsNewRecord(newHi > prevHi && score > 0);
      setWon(s.won);
      setGamePhase('dead');
      snd('gameover');
    }

    function advanceTimedPhase(s) {
      var ph = phaseRef.current;
      if (ph === 'intro') { setGamePhase('playing'); }
      else if (ph === 'levelclear') { Game.loadLevel(s, s.level + 1); timerRef.current = 1500; setGamePhase('intro'); }
      else if (ph === 'dying') { Game.respawnActors(s); timerRef.current = 1300; setGamePhase('intro'); }
      else if (ph === 'win') { finalizeGame(s); }
    }

    // ── Loop ──
    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    var acc = 0;

    function loop(now) {
      var s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(loop); return; }
      var dt = Math.min((now - last) / 1000, 0.25); last = now;
      var ph = phaseRef.current;

      if (ph === 'playing') {
        acc += dt;
        var guard = 0;
        while (acc >= SIM && guard < 600) {
          acc -= SIM; guard++;
          var ev = Game.update(s, SIM);
          applyEvents(ev, s);
          if (phaseRef.current !== 'playing') { acc = 0; break; }
        }
      } else if (ph === 'intro' || ph === 'levelclear' || ph === 'dying' || ph === 'win') {
        timerRef.current -= dt * 1000;
        if (timerRef.current <= 0) advanceTimedPhase(s);
      }

      render(s, now);
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
        }}>PACKL</div>

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
                color: charColor, letterSpacing: '0.06em',
              }}>{won ? 'YOU WIN! 🎉' : 'GAME OVER'}</div>

              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8,
                color: dark ? 'rgba(255,255,255,.92)' : 'var(--text-body)',
              }}>{finalScore}</div>

              {isNewRecord && (
                <div style={{
                  marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D',
                  animation: 'packl-bounce 0.9s ease-in-out infinite',
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
                }}>Play Again</button>

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

            <div style={{ fontSize: 11, fontWeight: 500, color: dark ? 'rgba(255,255,255,.3)' : 'var(--text-muted)', animation: 'packl-pulse 2s ease infinite' }}>
              Tap or press SPACE to play again
            </div>
          </div>
        )}
      </div>

      {/* On-screen D-pad — precise touch control under the board (toggle in Settings) */}
      {showDpad && (
      <div style={{
        flexShrink: 0,
        display: 'grid',
        gridTemplateAreas: '". up ." "left down right"',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: 8,
        width: '100%', maxWidth: 280, margin: '0 auto', boxSizing: 'border-box',
        padding: '4px 16px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}>
        <PacklDirButton label="Up"    glyph={packlChevron('M6 15l6-6 6 6')} accent={charColor} dark={dark} onPress={function () { inputDir(0, -1); }} />
        <PacklDirButton label="Left"  glyph={packlChevron('M15 6l-6 6 6 6')} accent={charColor} dark={dark} onPress={function () { inputDir(-1, 0); }} />
        <PacklDirButton label="Down"  glyph={packlChevron('M6 9l6 6 6-6')}  accent={charColor} dark={dark} onPress={function () { inputDir(0, 1); }} />
        <PacklDirButton label="Right" glyph={packlChevron('M9 6l6 6-6 6')}  accent={charColor} dark={dark} onPress={function () { inputDir(1, 0); }} />
      </div>
      )}
    </div>
  );
}
window.PacklGameScreen = PacklGameScreen;
