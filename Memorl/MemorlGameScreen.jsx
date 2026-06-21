// MEMORL — Game Screen (canvas memory-matrix: memorize → recall → reveal)

function nowMs() { return (typeof performance !== 'undefined' ? performance.now() : Date.now()); }

function MemorlGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');       // idle | memorize | recall | reveal | dead
  var untilRef  = React.useRef(0);            // timestamp the current timed phase ends
  var nextRef   = React.useRef('advance');    // what to do after a reveal: advance | retry | dead
  var layoutRef = React.useRef(null);         // last board layout (for hit-testing)
  var Game      = window.MemorlGame;
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
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'memorl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'memorl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }

  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

  // ── Death / scoring finalisation ──────────────────────────────────
  function handleDeath(s) {
    var score = s.score, prevHi = hiRef.current;
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

  // ── Start / restart ───────────────────────────────────────────────
  function startGame() {
    var s = Game.makeMemorlState();
    stateRef.current = s;
    nextRef.current = 'advance';
    phaseRef.current = 'memorize';
    untilRef.current = nowMs() + Game.memorizeMs(s.level);
    setPhase('memorize');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    snd('start');
  }

  // ── Tap on a tile (recall phase only) ─────────────────────────────
  function dispatchPick(idx) {
    var s = stateRef.current;
    if (!s || phaseRef.current !== 'recall') return;
    var r = Game.pickCell(s, idx);
    if (r === 'ignore') return;
    if (r === 'correct') {
      s.score += Game.tileScore();
      snd('key');
    } else if (r === 'complete') {
      s.score += Game.tileScore();
      s.combo += 1;
      s.score += Game.roundBonus(s.level, s.combo);
      s.level += 1;
      snd(s.combo >= 3 ? 'milestone' : 'win');
      nextRef.current = 'advance';
      phaseRef.current = 'reveal'; setPhase('reveal');
      untilRef.current = nowMs() + 680;
    } else if (r === 'wrong') {
      s.lives -= 1;
      s.combo = 0;
      snd('invalid');
      nextRef.current = (s.lives <= 0) ? 'dead' : 'retry';
      phaseRef.current = 'reveal'; setPhase('reveal');
      untilRef.current = nowMs() + 980;
    }
  }

  // ── Main effect: canvas sizing + tap input + timed loop ───────────
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

    var GW = 320, GH = 500, DPR = 1;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 320;
      GH = Math.floor(container.offsetHeight) || 500;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    function computeLayout(n) {
      var pad = 16;
      var avail = Math.min(GW, GH) - pad * 2;
      var boardMax = Math.min(avail, GH - 150);
      var gap = Math.max(4, Math.round(boardMax * 0.022));
      var cell = Math.floor((boardMax - gap * (n - 1)) / n);
      var boardPx = cell * n + gap * (n - 1);
      return {
        cell: cell, gap: gap, boardPx: boardPx, n: n,
        offX: Math.round((GW - boardPx) / 2),
        offY: Math.round((GH - boardPx) / 2) + 14,
      };
    }

    // ── Tap input ────────────────────────────────────────────────
    function hitCell(clientX, clientY) {
      var L = layoutRef.current;
      if (!L) return null;
      var rect = canvas.getBoundingClientRect();
      var lx = clientX - rect.left - L.offX;
      var ly = clientY - rect.top  - L.offY;
      if (lx < 0 || ly < 0) return null;
      var step = L.cell + L.gap;
      var col = Math.floor(lx / step), row = Math.floor(ly / step);
      if (col >= L.n || row >= L.n) return null;
      if ((lx - col * step) > L.cell || (ly - row * step) > L.cell) return null;
      return row * L.n + col;
    }
    function onClick(e) {
      var ph = phaseRef.current;
      if (ph === 'idle') { startGame(); return; }
      if (ph !== 'recall') return;
      var cell = hitCell(e.clientX, e.clientY);
      if (cell != null) dispatchPick(cell);
    }
    container.addEventListener('click', onClick);

    // ── Theme palette ────────────────────────────────────────────
    var pageBg, panelBg, tileBg, tileEdge, scoreCol, mutedCol, hintCol;
    if (theme === 'clean-dark') {
      pageBg = '#1A1918'; panelBg = 'rgba(255,255,255,.03)'; tileBg = 'rgba(255,255,255,.07)';
      tileEdge = 'rgba(255,255,255,.06)'; scoreCol = 'rgba(255,255,255,.88)'; mutedCol = 'rgba(255,255,255,.42)'; hintCol = 'rgba(255,255,255,.55)';
    } else if (theme === 'funky') {
      pageBg = '#2C3A4B'; panelBg = 'rgba(255,255,255,.04)'; tileBg = 'rgba(255,255,255,.09)';
      tileEdge = 'rgba(255,255,255,.07)'; scoreCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.46)'; hintCol = 'rgba(255,255,255,.6)';
    } else if (theme === 'classic') {
      pageBg = '#FFFFFF'; panelBg = '#FAFAFA'; tileBg = '#EFEFEF';
      tileEdge = 'rgba(0,0,0,.06)'; scoreCol = '#3A3A3C'; mutedCol = '#9A9A9A'; hintCol = 'rgba(0,0,0,.46)';
    } else {
      pageBg = '#FBF7F0'; panelBg = '#F4EFE6'; tileBg = '#EBE4D6';
      tileEdge = 'rgba(70,60,50,.07)'; scoreCol = '#5A5048'; mutedCol = '#A89E92'; hintCol = 'rgba(46,42,40,.46)';
    }
    var GREEN = '#56C98A', RED = '#E8755C';

    // ── Render ───────────────────────────────────────────────────
    function render(s, now) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);
      if (!s) return;

      var L = computeLayout(s.gridN);
      layoutRef.current = L;
      var ph = phaseRef.current;
      var step = L.cell + L.gap;
      var rad = Math.max(6, L.cell * 0.18);
      var pulse = 0.5 + 0.5 * Math.sin(now * 0.006);

      for (var i = 0; i < s.gridN * s.gridN; i++) {
        var row = Math.floor(i / s.gridN), col = i % s.gridN;
        var px = L.offX + col * step, py = L.offY + row * step;
        var isLit    = s.lit.indexOf(i) !== -1;
        var isPick   = s.picks.indexOf(i) !== -1;
        var isWrong  = s.wrong.indexOf(i) !== -1;

        var fill = tileBg, face = false, faceFade = 1, glow = null;
        if (ph === 'memorize' && isLit) { fill = charColor; face = true; glow = charColor; }
        else if (ph === 'recall' && isPick) { fill = GREEN; face = true; }
        else if (ph === 'reveal') {
          if (isWrong) { fill = RED; }
          else if (isLit && isPick) { fill = GREEN; face = true; }
          else if (isLit) { fill = charColor; face = true; faceFade = 0.55; }   // missed tile
        }

        if (glow) { ctx.save(); ctx.shadowColor = glow; ctx.shadowBlur = 10 + 8 * pulse; }
        ctx.fillStyle = fill;
        rr(ctx, px, py, L.cell, L.cell, rad); ctx.fill();
        if (glow) ctx.restore();

        ctx.lineWidth = 1; ctx.strokeStyle = tileEdge;
        rr(ctx, px + 0.5, py + 0.5, L.cell - 1, L.cell - 1, rad); ctx.stroke();

        if (face) {
          ctx.save();
          ctx.globalAlpha = faceFade;
          ctx.translate(px + L.cell / 2, py + L.cell / 2);
          Game.drawFace(ctx, charId, L.cell * 0.84);
          ctx.restore();
        }
      }

      // ── HUD ──
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var topY = Math.max(20, L.offY * 0.40);
      ctx.fillStyle = scoreCol;
      ctx.font = '800 26px Fredoka, Nunito, sans-serif';
      ctx.fillText(String(s.score), GW / 2, topY);
      ctx.fillStyle = mutedCol;
      ctx.font = '700 11px Nunito, sans-serif';
      ctx.fillText('LEVEL ' + s.level + '   ·   HI ' + hiRef.current, GW / 2, topY + 18);

      // Hearts (top-right) + combo (top-left)
      ctx.font = '700 16px Nunito, sans-serif';
      ctx.textAlign = 'right';
      for (var hh = 0; hh < 3; hh++) {
        ctx.fillStyle = hh < s.lives ? RED : (dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.12)');
        ctx.fillText('♥', GW - 14 - hh * 18, topY);
      }
      if (s.combo >= 2) {
        ctx.textAlign = 'left';
        ctx.fillStyle = charColor;
        ctx.font = '800 13px Fredoka, Nunito, sans-serif';
        ctx.fillText('🔥 ' + s.combo, 14, topY);
      }

      // ── Status hint below the board ──
      ctx.textAlign = 'center';
      var hintY = L.offY + L.boardPx + Math.min(40, (GH - (L.offY + L.boardPx)) / 2);
      ctx.font = '800 15px Fredoka, Nunito, sans-serif';
      if (ph === 'idle') {
        ctx.fillStyle = hintCol;
        ctx.fillText('Tap to start', GW / 2, L.offY + L.boardPx / 2);
      } else if (ph === 'memorize') {
        ctx.fillStyle = charColor;
        ctx.fillText('Memorize the pattern…', GW / 2, hintY);
      } else if (ph === 'recall') {
        ctx.fillStyle = scoreCol;
        ctx.fillText('Your turn — tap the tiles  (' + s.picks.length + '/' + s.litCount + ')', GW / 2, hintY);
      } else if (ph === 'reveal') {
        ctx.fillStyle = (nextRef.current === 'advance') ? GREEN : RED;
        ctx.fillText(nextRef.current === 'advance' ? 'Nice! ✓' : 'Missed!', GW / 2, hintY);
      }
    }

    // ── Timed loop ───────────────────────────────────────────────
    function loop(now) {
      var s = stateRef.current;
      var ph = phaseRef.current;
      if (s) {
        if (ph === 'memorize' && now >= untilRef.current) {
          phaseRef.current = 'recall'; setPhase('recall');
        } else if (ph === 'reveal' && now >= untilRef.current) {
          var act = nextRef.current;
          if (act === 'dead') {
            handleDeath(s);
          } else {
            Game.newBoard(s);           // 'advance' already bumped s.level
            phaseRef.current = 'memorize'; setPhase('memorize');
            untilRef.current = now + Game.memorizeMs(s.level);
          }
        }
      }
      render(s, now);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return function () {
      cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      container.removeEventListener('click', onClick);
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
        }}>MEMORL</div>

        <button onClick={onBoard} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          fontFamily: 'var(--font-body)',
          WebkitTapHighlightColor: 'transparent',
        }}>Scores</button>
      </div>

      {/* Canvas game area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'pointer', touchAction: 'manipulation' }}>
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
                  animation: 'memorl-bounce 0.9s ease-in-out infinite',
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
          </div>
        )}
      </div>
    </div>
  );
}
window.MemorlGameScreen = MemorlGameScreen;
