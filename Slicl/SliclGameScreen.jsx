// SLICL — Game Screen (swipe-to-slice fruit on canvas)

function SliclGameScreen({ theme, mode, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var phaseRef  = React.useRef('idle');     // idle | playing | dead
  var trailRef  = React.useRef([]);          // [{x,y,t}]
  var ptrRef    = React.useRef({ down: false, lx: 0, ly: 0 });
  var Game      = window.SliclGame;
  var MODES     = Game.MODES;
  var hiRef     = React.useRef(Game.loadHighScores()[mode] || 0);

  var [phase,       setPhase]       = React.useState('idle');
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [bestCombo,   setBestCombo]   = React.useState(0);
  var [hiScore,     setHiScore]     = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);

  var dark      = theme === 'clean-dark' || theme === 'funky';
  var accent    = '#56C98A';
  var tbColor   = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd       = function (n) { if (window.YanSound) window.YanSound.play(n, 'slicl-sound'); };

  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'slicl', name: nm, emoji: '🍉', score: finalScore, char_id: mode.charAt(0) });
    setSaved(true);
  }
  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [phase, finalScore]);

  function startGame() {
    var canvas = canvasRef.current;
    var w = canvas ? canvas.parentElement.offsetWidth : 360;
    var h = canvas ? canvas.parentElement.offsetHeight : 600;
    stateRef.current = Game.makeSliceState({ w: w, h: h, mode: mode });
    trailRef.current = [];
    phaseRef.current = 'playing'; setPhase('playing');
    setFinalScore(0); setIsNewRecord(false); setSaved(false);
    snd('start');
  }

  // ── Main effect: canvas + pointer slicing + rAF loop ──────────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = canvas.parentElement;

    phaseRef.current = 'idle'; setPhase('idle');

    var GW = 360, GH = 600, DPR = 1;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 360;
      GH = Math.floor(container.offsetHeight) || 600;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      if (stateRef.current) Game.setField(stateRef.current, GW, GH);
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    function localPt(e) {
      var rect = canvas.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function pdown(e) {
      e.preventDefault();
      if (phaseRef.current === 'idle' || phaseRef.current === 'dead') { startGame(); }
      var p = localPt(e); var pr = ptrRef.current; pr.down = true; pr.lx = p.x; pr.ly = p.y;
      trailRef.current.push({ x: p.x, y: p.y, t: performance.now() });
    }
    function pmove(e) {
      var pr = ptrRef.current; if (!pr.down) return;
      e.preventDefault();
      var p = localPt(e);
      trailRef.current.push({ x: p.x, y: p.y, t: performance.now() });
      var s = stateRef.current;
      if (s && phaseRef.current === 'playing') {
        var ev = Game.slice(s, pr.lx, pr.ly, p.x, p.y);
        if (ev.bomb) { snd('lose'); if (ev.over) handleDeath(s); }
        else if (ev.hits) { snd(ev.comboAward ? 'milestone' : 'key'); }
        if (ev.special) snd('win');
      }
      pr.lx = p.x; pr.ly = p.y;
    }
    function pup() { ptrRef.current.down = false; }
    container.addEventListener('pointerdown', pdown);
    container.addEventListener('pointermove', pmove);
    window.addEventListener('pointerup', pup);
    container.addEventListener('touchstart', pdown, { passive: false });
    container.addEventListener('touchmove', pmove, { passive: false });
    window.addEventListener('touchend', pup);

    // Theme palette
    var bgTop, bgBot, hudCol, mutedCol, hintCol, bladeCol;
    if (theme === 'clean-dark')   { bgTop = '#1C2230'; bgBot = '#10141D'; hudCol = 'rgba(255,255,255,.92)'; mutedCol = 'rgba(255,255,255,.5)'; hintCol = 'rgba(255,255,255,.6)'; bladeCol = '#BFefff'; }
    else if (theme === 'funky')   { bgTop = '#3A2456'; bgBot = '#241338'; hudCol = 'rgba(255,255,255,.94)'; mutedCol = 'rgba(255,255,255,.55)'; hintCol = 'rgba(255,255,255,.62)'; bladeCol = '#FFD2F0'; }
    else if (theme === 'classic') { bgTop = '#2A2A2A'; bgBot = '#141414'; hudCol = 'rgba(255,255,255,.94)'; mutedCol = 'rgba(255,255,255,.55)'; hintCol = 'rgba(255,255,255,.6)'; bladeCol = '#FFFFFF'; }
    else                          { bgTop = '#2E5E52'; bgBot = '#1C3A33'; hudCol = 'rgba(255,255,255,.95)'; mutedCol = 'rgba(255,255,255,.6)'; hintCol = 'rgba(255,255,255,.66)'; bladeCol = '#EAFBF2'; }

    function rr(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    }

    function drawFruit(ctx, f) {
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
      if (f.bomb) {
        ctx.fillStyle = '#2A2A30'; ctx.beginPath(); ctx.arc(0, 0, f.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.arc(-f.r * 0.32, -f.r * 0.32, f.r * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#9B6B3A'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -f.r); ctx.quadraticCurveTo(f.r * 0.5, -f.r * 1.4, f.r * 0.7, -f.r * 1.2); ctx.stroke();
        ctx.fillStyle = '#FFB200'; ctx.beginPath(); ctx.arc(f.r * 0.7, -f.r * 1.2, 3, 0, Math.PI * 2); ctx.fill();
      } else if (f.special) {
        ctx.fillStyle = '#F4D03F'; ctx.beginPath(); ctx.arc(0, 0, f.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '800 22px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', 0, 1);
      } else {
        var m = Game.fruitById(f.type);
        ctx.fillStyle = m.rind; ctx.beginPath(); ctx.arc(0, 0, f.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(-f.r * 0.3, -f.r * 0.35, f.r * 0.34, f.r * 0.22, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4E9A3B'; ctx.beginPath(); ctx.ellipse(f.r * 0.2, -f.r, f.r * 0.32, f.r * 0.16, 0.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawHalf(ctx, h) {
      ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, h.life));
      ctx.fillStyle = h.color;
      ctx.beginPath();
      var a0 = h.half ? 0 : Math.PI;
      ctx.arc(0, 0, h.r, a0, a0 + Math.PI); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.beginPath(); ctx.arc(0, 0, h.r * 0.5, a0, a0 + Math.PI); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1; ctx.restore();
    }

    function render(s) {
      var ctx = canvas.getContext('2d');
      var shx = 0, shy = 0;
      if (s && s.shake > 0) { shx = (Math.random() - 0.5) * 14 * s.shake; shy = (Math.random() - 0.5) * 14 * s.shake; }
      ctx.save(); ctx.translate(shx, shy);

      var grad = ctx.createLinearGradient(0, 0, 0, GH);
      grad.addColorStop(0, bgTop); grad.addColorStop(1, bgBot);
      ctx.fillStyle = grad; ctx.fillRect(-20, -20, GW + 40, GH + 40);

      if (s) {
        for (var i = 0; i < s.halves.length; i++) drawHalf(ctx, s.halves[i]);
        for (var f = 0; f < s.fruits.length; f++) drawFruit(ctx, s.fruits[f]);
        for (var p = 0; p < s.particles.length; p++) { var q = s.particles[p]; ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1;
        for (var po = 0; po < s.pops.length; po++) { var pop = s.pops[po]; ctx.globalAlpha = Math.max(0, Math.min(1, pop.life)); ctx.fillStyle = pop.color; ctx.font = '800 16px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(pop.text, pop.x, pop.y); }
        ctx.globalAlpha = 1;
      }

      // Blade trail
      var tr = trailRef.current, now = performance.now();
      while (tr.length && now - tr[0].t > 180) tr.shift();
      if (tr.length > 1) {
        for (var t = 1; t < tr.length; t++) {
          var a = Math.max(0, 1 - (now - tr[t].t) / 180);
          ctx.strokeStyle = bladeCol; ctx.globalAlpha = a * 0.9; ctx.lineWidth = 2 + a * 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(tr[t - 1].x, tr[t - 1].y); ctx.lineTo(tr[t].x, tr[t].y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      if (!s) return;
      // ── HUD ──
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = hudCol; ctx.font = '800 26px Fredoka, Nunito, sans-serif';
      ctx.fillText(String(s.score), GW / 2, 12);

      if (s.cfg.lives > 0) {
        ctx.textAlign = 'right'; ctx.font = '800 18px Fredoka, sans-serif';
        var crosses = '';
        for (var L = 0; L < s.cfg.lives; L++) crosses += (L < s.lives ? '●' : '○') + ' ';
        ctx.fillStyle = '#E2483D'; ctx.fillText(crosses.trim(), GW - 14, 16);
      } else {
        ctx.textAlign = 'right'; ctx.fillStyle = hudCol; ctx.font = '800 20px Fredoka, sans-serif';
        ctx.fillText(Math.ceil(s.timeLeft) + 's', GW - 14, 14);
      }
      ctx.textAlign = 'left'; ctx.fillStyle = mutedCol; ctx.font = '700 12px Nunito, sans-serif';
      ctx.fillText(s.cfg.label, 14, 18);

      var by = 40; ctx.font = '700 12px Nunito, sans-serif';
      if (s.doubleTime > 0) { ctx.fillStyle = '#F4D03F'; ctx.fillText('DOUBLE ' + Math.ceil(s.doubleTime) + 's', 14, by); by += 14; }
      if (s.freezeTime > 0) { ctx.fillStyle = '#79D0E0'; ctx.fillText('FREEZE ' + Math.ceil(s.freezeTime) + 's', 14, by); }

      if (phaseRef.current === 'idle') {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = hintCol;
        ctx.font = '700 16px Nunito, sans-serif';
        ctx.fillText('Swipe to slice the fruit', GW / 2, GH / 2 - 10);
        ctx.fillText('Tap to start', GW / 2, GH / 2 + 14);
      }
    }

    function handleDeath(s) {
      var score = s.score, prevHi = hiRef.current;
      Game.saveHighScore(mode, score);
      Game.recordGame(s.bestCombo);
      var newHi = Game.loadHighScores()[mode] || 0;
      hiRef.current = Math.max(prevHi, newHi);
      setHiScore(hiRef.current); setFinalScore(score); setBestCombo(s.bestCombo);
      setIsNewRecord(newHi > prevHi && score > 0);
      phaseRef.current = 'dead'; setPhase('dead');
      snd('gameover');
    }

    var last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    function loop(now) {
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var s = stateRef.current;
      if (s && phaseRef.current === 'playing') {
        var ev = Game.update(s, dt);
        if (ev.missed && s.cfg.lives > 0) snd('invalid');
        if (ev.over) handleDeath(s);
      }
      render(s);
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
  }, [theme, mode]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', minHeight: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 12px', flexShrink: 0,
        borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none',
      }}>
        <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: '5px 8px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, WebkitTapHighlightColor: 'transparent' }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: accent }}>SLICL</div>
        <button onClick={onBoard} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', WebkitTapHighlightColor: 'transparent' }}>Scores</button>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none', cursor: 'crosshair' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {phase === 'dead' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'rgba(15,28,22,.66)', backdropFilter: 'blur(5px)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: accent, letterSpacing: '0.06em' }}>{MODES[mode].label.toUpperCase()} OVER</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8, color: 'rgba(255,255,255,.92)' }}>{finalScore}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>{'Best combo ×' + bestCombo}</div>
              {isNewRecord && <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D', animation: 'slicl-bounce 0.9s ease-in-out infinite' }}>🏅 New Record!</div>}
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>{'HI ' + hiScore}</div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <button onClick={function (e) { e.stopPropagation(); setShowPrompt(true); }} style={{ border: 'none', background: accent, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,.20)', WebkitTapHighlightColor: 'transparent' }}>Add your name to save your score</button>
                )}
              </div>
            )}
            {showPrompt && ID && React.createElement(ID.NamePrompt, { theme: theme, dismissible: true, onSave: function (nm) { setShowPrompt(false); submitWith(nm); }, onClose: function () { setShowPrompt(false); } })}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startGame} style={{ border: 'none', background: accent, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,.22)', WebkitTapHighlightColor: 'transparent' }}>Play Again</button>
              <button onClick={onBoard} style={{ border: '2px solid rgba(255,255,255,.22)', background: 'transparent', color: 'rgba(255,255,255,.85)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, padding: '12px 20px', borderRadius: 999, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>Scores</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.SliclGameScreen = SliclGameScreen;
