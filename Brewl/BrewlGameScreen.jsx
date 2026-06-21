// BREWL — Game Screen (canvas barista: fill cups to the line, beat the spill)

function BrewlGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');       // idle | playing | dead
  var layoutRef = React.useRef(null);
  var Game      = window.BrewlGame;
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
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'brewl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'brewl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }
  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

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

  function startGame() {
    stateRef.current = Game.makeBrewlState();
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    snd('start');
  }

  function dispatchTap(idx) {
    var s = stateRef.current;
    if (!s || phaseRef.current !== 'playing') return;
    var r = Game.tapSlot(s, idx);
    if (r === 'good') { snd(s.combo >= 4 ? 'milestone' : 'win'); }
    else if (r === 'bad') { snd('invalid'); }
    else if (r === 'bell') { snd('back'); }
  }

  // ── Main effect: canvas sizing + tap input + sim loop ─────────────
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

    function computeLayout() {
      var counterY = Math.round(GH * 0.82);
      var stationW = GW / Game.SLOTS;
      var cupW = Math.min(stationW * 0.76, 112);
      var cupH = Math.round(Math.min(GH * 0.32, counterY - 96));
      var cupBottom = counterY - 8;
      return { counterY: counterY, stationW: stationW, cupW: cupW, cupH: cupH, cupBottom: cupBottom };
    }

    // ── Tap input → station column ───────────────────────────────
    function onClick(e) {
      var ph = phaseRef.current;
      if (ph === 'idle') { startGame(); return; }
      if (ph !== 'playing') return;
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var L = layoutRef.current; if (!L) return;
      var idx = Math.floor(x / L.stationW);
      if (idx < 0) idx = 0; if (idx >= Game.SLOTS) idx = Game.SLOTS - 1;
      dispatchTap(idx);
    }
    container.addEventListener('click', onClick);

    // ── Theme palette ────────────────────────────────────────────
    var pageBg, counterTop, counterBot, glassFill, glassEdge, scoreCol, mutedCol, hintCol, spoutCol;
    if (theme === 'clean-dark') {
      pageBg = '#1A1918'; counterTop = '#39342E'; counterBot = '#2A2520'; glassFill = 'rgba(255,255,255,.05)';
      glassEdge = 'rgba(255,255,255,.18)'; scoreCol = 'rgba(255,255,255,.88)'; mutedCol = 'rgba(255,255,255,.42)'; hintCol = 'rgba(255,255,255,.55)'; spoutCol = '#5A5048';
    } else if (theme === 'funky') {
      pageBg = '#2C3A4B'; counterTop = '#3A4B5E'; counterBot = '#27323F'; glassFill = 'rgba(255,255,255,.06)';
      glassEdge = 'rgba(255,255,255,.22)'; scoreCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.46)'; hintCol = 'rgba(255,255,255,.6)'; spoutCol = '#56657A';
    } else if (theme === 'classic') {
      pageBg = '#FFFFFF'; counterTop = '#EAEAEA'; counterBot = '#D8D8D8'; glassFill = 'rgba(0,0,0,.03)';
      glassEdge = 'rgba(0,0,0,.22)'; scoreCol = '#3A3A3C'; mutedCol = '#9A9A9A'; hintCol = 'rgba(0,0,0,.46)'; spoutCol = '#B8B0A4';
    } else {
      pageBg = '#FBF7F0'; counterTop = '#E6DDCD'; counterBot = '#D8CDB8'; glassFill = 'rgba(70,60,50,.04)';
      glassEdge = 'rgba(70,60,50,.28)'; scoreCol = '#5A5048'; mutedCol = '#A89E92'; hintCol = 'rgba(46,42,40,.46)'; spoutCol = '#9A8E7C';
    }
    var GREEN = '#56C98A', RED = '#E8755C';
    var COFFEE_TOP = '#A9743F', COFFEE_BOT = '#6F4A28';

    // ── Render ───────────────────────────────────────────────────
    function render(s, now) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);
      if (!s) return;

      var L = computeLayout();
      layoutRef.current = L;
      var pulse = 0.5 + 0.5 * Math.sin(now * 0.012);

      // Counter
      var cg = ctx.createLinearGradient(0, L.counterY, 0, GH);
      cg.addColorStop(0, counterTop); cg.addColorStop(1, counterBot);
      ctx.fillStyle = cg;
      ctx.fillRect(0, L.counterY, GW, GH - L.counterY);
      ctx.fillStyle = dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)';
      ctx.fillRect(0, L.counterY, GW, 3);

      // Barista pet peeking behind the counter (left)
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.translate(30, L.counterY + 16);
      Game.drawFace(ctx, charId, 46);
      ctx.restore();

      // Stations
      for (var i = 0; i < Game.SLOTS; i++) {
        var cx = Math.round(L.stationW * (i + 0.5));
        var cupX = cx - L.cupW / 2;
        var cupTop = L.cupBottom - L.cupH;

        // Spout
        ctx.fillStyle = spoutCol;
        rr(ctx, cx - 9, cupTop - 30, 18, 16, 4); ctx.fill();
        rr(ctx, cx - 4, cupTop - 16, 8, 8, 2); ctx.fill();

        var c = s.slots[i];
        var rad = Math.max(6, L.cupW * 0.14);

        // Glass body
        ctx.save();
        rr(ctx, cupX, cupTop, L.cupW, L.cupH, rad);
        ctx.fillStyle = glassFill; ctx.fill();
        ctx.save(); ctx.clip();

        if (c) {
          // pouring stream when not full
          if (c.fill < 1) {
            ctx.fillStyle = 'rgba(125,85,45,.55)';
            ctx.fillRect(cx - 2.5, cupTop, 5, L.cupH * (1 - c.fill));
          }
          // liquid
          var lh = Math.max(0, Math.min(1, c.fill)) * L.cupH;
          var ly = L.cupBottom - lh;
          var lg = ctx.createLinearGradient(0, ly, 0, L.cupBottom);
          lg.addColorStop(0, COFFEE_TOP); lg.addColorStop(1, COFFEE_BOT);
          ctx.fillStyle = lg;
          ctx.fillRect(cupX, ly, L.cupW, lh);
          // foam line
          ctx.fillStyle = 'rgba(244,232,210,.85)';
          ctx.fillRect(cupX, ly, L.cupW, Math.max(2, L.cupH * 0.02));

          // target band
          var by = L.cupBottom - c.target * L.cupH;
          var bh = Math.max(6, c.band * L.cupH * 2);
          ctx.fillStyle = 'rgba(86,201,138,.32)';
          ctx.fillRect(cupX, by - bh / 2, L.cupW, bh);
          ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
          ctx.beginPath(); ctx.moveTo(cupX, by); ctx.lineTo(cupX + L.cupW, by); ctx.stroke();
          ctx.setLineDash([]);

          // overflow danger zone near the rim
          ctx.fillStyle = c.fill > 0.85 ? ('rgba(232,117,92,' + (0.25 + 0.3 * pulse) + ')') : 'rgba(232,117,92,.16)';
          ctx.fillRect(cupX, cupTop, L.cupW, L.cupH * 0.12);
        }
        ctx.restore(); // unclip

        // Glass outline
        ctx.lineWidth = 2.5; ctx.strokeStyle = glassEdge;
        rr(ctx, cupX, cupTop, L.cupW, L.cupH, rad); ctx.stroke();
        // glass highlight
        ctx.strokeStyle = 'rgba(255,255,255,.30)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cupX + 6, cupTop + 12); ctx.lineTo(cupX + 6, L.cupBottom - 12); ctx.stroke();
        ctx.restore();

        // Bell interruption
        if (c && c.bell) {
          var bx = cx, byb = cupTop - 4;
          ctx.save();
          ctx.shadowColor = RED; ctx.shadowBlur = 10 + 8 * pulse;
          ctx.fillStyle = RED;
          ctx.beginPath(); ctx.arc(bx, byb, 16, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          ctx.font = '700 18px Nunito, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('🔔', bx, byb + 1);
        }
      }

      // ── HUD ──
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var topY = 26;
      ctx.fillStyle = scoreCol;
      ctx.font = '800 26px Fredoka, Nunito, sans-serif';
      ctx.fillText(String(s.score), GW / 2, topY);
      ctx.fillStyle = mutedCol;
      ctx.font = '700 11px Nunito, sans-serif';
      ctx.fillText('LEVEL ' + s.level + '   ·   HI ' + hiRef.current, GW / 2, topY + 18);

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

      // Idle hint
      if (phaseRef.current === 'idle') {
        ctx.textAlign = 'center';
        ctx.fillStyle = hintCol;
        ctx.font = '800 16px Fredoka, Nunito, sans-serif';
        ctx.fillText('Tap a cup at the green line', GW / 2, GH * 0.42);
        ctx.font = '600 13px Nunito, sans-serif';
        ctx.fillText('Tap anywhere to start', GW / 2, GH * 0.42 + 24);
      }
    }

    // ── Sim loop (variable dt, continuous fill) ──────────────────
    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    function loop(now) {
      var s = stateRef.current;
      var dt = Math.min(now - last, 50); last = now;
      if (s && phaseRef.current === 'playing') {
        var events = Game.step(s, dt);
        for (var e = 0; e < events.length; e++) {
          if (events[e] === 'spill') snd('lose');
          else if (events[e] === 'bell') snd('invalid');
        }
        if (s.lives <= 0) handleDeath(s);
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
        }}>BREWL</div>

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
                  animation: 'brewl-bounce 0.9s ease-in-out infinite',
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
window.BrewlGameScreen = BrewlGameScreen;
