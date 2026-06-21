// TRAINL — Game Screen (canvas track router: flip switches, deliver by colour)

function TrainlGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');       // idle | playing | dead
  var layoutRef = React.useRef(null);
  var Game      = window.TrainlGame;
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
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'trainl-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'trainl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
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
    stateRef.current = Game.makeTrainlState();
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    snd('start');
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
      var pad = 22;
      var size = Math.min(GW, GH - 40) - pad * 2;
      var scale = size / 100;
      return { scale: scale, offX: Math.round((GW - size) / 2), offY: Math.round((GH - size) / 2) + 12, size: size };
    }
    function toPx(L, bx, by) { return [L.offX + bx * L.scale, L.offY + by * L.scale]; }

    // ── Tap input → nearest switch (or start) ────────────────────
    function onClick(e) {
      var ph = phaseRef.current;
      if (ph === 'idle') { startGame(); return; }
      if (ph !== 'playing') return;
      var s = stateRef.current, L = layoutRef.current;
      if (!s || !L) return;
      var rect = canvas.getBoundingClientRect();
      var bx = (e.clientX - rect.left - L.offX) / L.scale;
      var by = (e.clientY - rect.top  - L.offY) / L.scale;
      var best = null, bestD = 11;   // board-unit tap radius
      s.layout.switches.forEach(function (id) {
        var n = s.layout.nodes[id];
        var d = Math.hypot(n.x - bx, n.y - by);
        if (d < bestD) { bestD = d; best = id; }
      });
      if (best) { Game.toggleSwitch(s, best); snd('flip'); }
    }
    container.addEventListener('click', onClick);

    // ── Theme palette ────────────────────────────────────────────
    var pageBg, trackCol, railCol, scoreCol, mutedCol, hintCol, depotCol, switchCol;
    if (theme === 'clean-dark') {
      pageBg = '#1A1918'; trackCol = 'rgba(255,255,255,.13)'; railCol = 'rgba(255,255,255,.22)';
      scoreCol = 'rgba(255,255,255,.88)'; mutedCol = 'rgba(255,255,255,.42)'; hintCol = 'rgba(255,255,255,.55)'; depotCol = '#39332C'; switchCol = '#E8E2D6';
    } else if (theme === 'funky') {
      pageBg = '#2C3A4B'; trackCol = 'rgba(255,255,255,.14)'; railCol = 'rgba(255,255,255,.24)';
      scoreCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.46)'; hintCol = 'rgba(255,255,255,.6)'; depotCol = '#3A4B5E'; switchCol = '#F2ECE0';
    } else if (theme === 'classic') {
      pageBg = '#FFFFFF'; trackCol = 'rgba(0,0,0,.13)'; railCol = 'rgba(0,0,0,.26)';
      scoreCol = '#3A3A3C'; mutedCol = '#9A9A9A'; hintCol = 'rgba(0,0,0,.46)'; depotCol = '#E4E4E4'; switchCol = '#3A3A3C';
    } else {
      pageBg = '#FBF7F0'; trackCol = 'rgba(70,60,50,.14)'; railCol = 'rgba(70,60,50,.26)';
      scoreCol = '#5A5048'; mutedCol = '#A89E92'; hintCol = 'rgba(46,42,40,.46)'; depotCol = '#E6DDCD'; switchCol = '#5A5048';
    }
    var RED = '#E8755C';

    function shade(hex, amt) {
      var n = parseInt(hex.slice(1), 16);
      var r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
      var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
      var b = Math.max(0, Math.min(255, (n & 255) + amt));
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function drawStation(ctx, L, n) {
      var p = toPx(L, n.x, n.y);
      var w = 15 * L.scale, h = 12 * L.scale;
      // roof
      ctx.fillStyle = shade(n.color, -40);
      ctx.beginPath();
      ctx.moveTo(p[0] - w / 2 - 2, p[1] - h / 2);
      ctx.lineTo(p[0], p[1] - h / 2 - h * 0.55);
      ctx.lineTo(p[0] + w / 2 + 2, p[1] - h / 2);
      ctx.closePath(); ctx.fill();
      // body
      ctx.fillStyle = n.color;
      rr(ctx, p[0] - w / 2, p[1] - h / 2, w, h, Math.max(3, L.scale * 1.5)); ctx.fill();
      // doorway
      ctx.fillStyle = shade(n.color, -55);
      rr(ctx, p[0] - w * 0.16, p[1] - h * 0.18, w * 0.32, h * 0.68, 2); ctx.fill();
    }

    // ── Render ───────────────────────────────────────────────────
    function render(s, now) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);
      if (!s) return;

      var L = computeLayout();
      layoutRef.current = L;
      var Lg = s.layout;
      var pulse = 0.5 + 0.5 * Math.sin(now * 0.008);

      // Tracks (neutral)
      Object.keys(Lg.edges).forEach(function (id) {
        var e = Lg.edges[id];
        var a = toPx(L, e.ax, e.ay), b = toPx(L, e.bx, e.by);
        ctx.strokeStyle = trackCol; ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(7, L.scale * 4.2);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.strokeStyle = railCol; ctx.lineWidth = Math.max(1.5, L.scale * 1.0);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });

      // Active switch branches highlighted
      Lg.switches.forEach(function (id) {
        var n = Lg.nodes[id];
        var active = n.out[s.switchState[id] || 0];
        var e = Lg.edges[active];
        var a = toPx(L, e.ax, e.ay), b = toPx(L, e.bx, e.by);
        ctx.strokeStyle = charColor; ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(5, L.scale * 2.6);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });

      // Stations
      Object.keys(Lg.nodes).forEach(function (id) {
        var n = Lg.nodes[id];
        if (n.type === 'station') drawStation(ctx, L, n);
      });

      // Source depot + dispatcher pet
      var srcN = Lg.nodes[Lg.sources[0]];
      var sp = toPx(L, srcN.x, srcN.y);
      ctx.fillStyle = depotCol;
      rr(ctx, sp[0] - 13 * L.scale, sp[1] - 11 * L.scale, 26 * L.scale, 20 * L.scale, Math.max(4, L.scale * 2)); ctx.fill();
      ctx.save();
      ctx.translate(sp[0], sp[1] + 1);
      Game.drawFace(ctx, charId, 15 * L.scale);
      ctx.restore();

      // Switches
      Lg.switches.forEach(function (id) {
        var n = Lg.nodes[id];
        var p = toPx(L, n.x, n.y);
        var r = Math.max(7, L.scale * 4.6);
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
        ctx.fillStyle = switchCol === '#5A5048' || switchCol === '#3A3A3C' ? '#2E2A28' : '#2E2A28';
        ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // lever pointing to the active branch
        var active = n.out[s.switchState[id] || 0];
        var e = Lg.edges[active];
        var ang = Math.atan2(e.by - e.ay, e.bx - e.ax);
        ctx.strokeStyle = charColor; ctx.lineWidth = Math.max(2.5, L.scale * 1.4); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + Math.cos(ang) * r, p[1] + Math.sin(ang) * r); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(2, L.scale * 1.1), 0, Math.PI * 2); ctx.fill();
      });

      // Trains
      for (var i = 0; i < s.trains.length; i++) {
        var tr = s.trains[i];
        var e2 = Lg.edges[tr.edge];
        var bx = e2.ax + (e2.bx - e2.ax) * tr.t;
        var by = e2.ay + (e2.by - e2.ay) * tr.t;
        var p2 = toPx(L, bx, by);
        var ang2 = Math.atan2(e2.by - e2.ay, e2.bx - e2.ax);
        var tl = 8.5 * L.scale, tw = 6 * L.scale;
        ctx.save();
        ctx.translate(p2[0], p2[1]); ctx.rotate(ang2);
        ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
        ctx.fillStyle = tr.color;
        rr(ctx, -tl / 2, -tw / 2, tl, tw, tw * 0.34); ctx.fill();
        ctx.shadowColor = 'transparent';
        // cab top stripe
        ctx.fillStyle = shade(tr.color, 28);
        rr(ctx, -tl / 2 + tl * 0.12, -tw / 2 + tw * 0.16, tl * 0.5, tw * 0.32, 2); ctx.fill();
        // front window
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        rr(ctx, tl * 0.14, -tw * 0.22, tl * 0.22, tw * 0.44, 2); ctx.fill();
        // headlight
        ctx.fillStyle = '#FFF7D6';
        ctx.beginPath(); ctx.arc(tl / 2 - 1.5, 0, Math.max(1.4, L.scale * 0.9), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
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

      if (phaseRef.current === 'idle') {
        ctx.textAlign = 'center';
        ctx.fillStyle = hintCol;
        ctx.font = '800 16px Fredoka, Nunito, sans-serif';
        ctx.fillText('Tap switches to route the trains', GW / 2, GH * 0.46);
        ctx.font = '600 13px Nunito, sans-serif';
        ctx.fillText('Match each train to its colour — tap to start', GW / 2, GH * 0.46 + 24);
      }
    }

    // ── Sim loop ─────────────────────────────────────────────────
    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    function loop(now) {
      var s = stateRef.current;
      var dt = Math.min(now - last, 50); last = now;
      if (s && phaseRef.current === 'playing') {
        var ev = Game.step(s, dt);
        for (var i = 0; i < ev.length; i++) {
          if (ev[i] === 'deliver') snd(s.combo >= 4 ? 'milestone' : 'win');
          else if (ev[i] === 'wrong') snd('invalid');
          else if (ev[i] === 'crash') snd('lose');
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
        }}>TRAINL</div>

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
                  animation: 'trainl-bounce 0.9s ease-in-out infinite',
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
window.TrainlGameScreen = TrainlGameScreen;
