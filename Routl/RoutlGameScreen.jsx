// ROUTL — Game Screen (grid route-planning; time your steps past patrols)

function RoutlGameScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef = React.useRef(null);
  var stateRef  = React.useRef(null);
  var rafRef    = React.useRef(null);
  var layoutRef = React.useRef({ cell: 30, ox: 0, oy: 0 });
  var animRef   = React.useRef({ active: false });
  var pendRef   = React.useRef(null);
  var ptrRef    = React.useRef({ down: false });
  var Game      = window.RoutlGame;
  var hiRef     = React.useRef(Game.loadHighScores()[charId] || 0);

  var [status,      setStatus]      = React.useState('playing');  // playing | won | over
  var [hud,         setHud]         = React.useState({ score: 0, level: 1, moves: 0, optimal: 0, attempt: 1 });
  var [winInfo,     setWinInfo]     = React.useState({ score: 0, moves: 0, optimal: 0, beat: false });
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [finalLevel,  setFinalLevel]  = React.useState(1);
  var [hiScore,     setHiScore]     = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);

  var dark      = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR  = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI= { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  var charColor = CHAR_CLR[charId] || '#E8755C';
  var tbColor   = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd       = function (n) { if (window.YanSound) window.YanSound.play(n, 'routl-sound'); };

  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(nm) {
    if (!lbOn || !nm) return;
    LB.submit({ game: 'routl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }
  React.useEffect(function () {
    if (status === 'over' && finalScore > 0 && lbOn && !saved && LB.getName()) submitWith(LB.getName());
  }, [status, finalScore]);

  function syncHud() {
    var s = stateRef.current; if (!s) return;
    setHud({ score: s.score, level: s.level, moves: s.moves, optimal: s.board.optimal, attempt: s.attempt });
  }

  function startGame() {
    stateRef.current = Game.makeRouteState({ level: 1 });
    animRef.current = { active: false }; pendRef.current = null;
    setStatus('playing'); setSaved(false); setIsNewRecord(false);
    syncHud(); snd('start');
  }

  function nextLevel() {
    stateRef.current = Game.nextLevel(stateRef.current);
    animRef.current = { active: false }; pendRef.current = null;
    setStatus('playing'); syncHud(); snd('start');
  }

  function handleOver() {
    var s = stateRef.current, score = s.score, prevHi = hiRef.current;
    Game.saveHighScore(charId, score); Game.recordGame(s.level);
    var newHi = Game.loadHighScores()[charId] || 0;
    hiRef.current = Math.max(prevHi, newHi);
    setHiScore(hiRef.current); setFinalScore(score); setFinalLevel(s.level);
    setIsNewRecord(newHi > prevHi && score > 0);
    setStatus('over'); snd('gameover');
  }

  // ── Main effect: canvas + tap/drag input + rAF render ─────────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var container = canvas.parentElement;

    startGame();

    var GW = 360, GH = 600, DPR = 1;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 360;
      GH = Math.floor(container.offsetHeight) || 600;
      canvas.width = Math.floor(GW * DPR); canvas.height = Math.floor(GH * DPR);
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      relayout();
    }
    function relayout() {
      var s = stateRef.current; if (!s) return;
      var topPad = 64, botPad = 30, sidePad = 16;
      var availW = GW - sidePad * 2, availH = GH - topPad - botPad;
      var cell = Math.max(22, Math.floor(Math.min(availW / s.board.cols, availH / s.board.rows)));
      var boardW = cell * s.board.cols, boardH = cell * s.board.rows;
      layoutRef.current = { cell: cell, ox: Math.round((GW - boardW) / 2), oy: Math.round(topPad + (availH - boardH) / 2), boardW: boardW, boardH: boardH };
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    function cellCenter(cx, cy) { var l = layoutRef.current; return { x: l.ox + (cx + 0.5) * l.cell, y: l.oy + (cy + 0.5) * l.cell }; }
    function pixelToCell(px, py) { var l = layoutRef.current; return { x: Math.floor((px - l.ox) / l.cell), y: Math.floor((py - l.oy) / l.cell) }; }
    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function doStep(nx, ny) {
      var s = stateRef.current;
      if (!s || s.status !== 'playing' || animRef.current.active) return;
      if (!Game.canStep(s, nx, ny)) return;
      var prev = { x: s.boat.x, y: s.boat.y }, prevTick = s.tick;
      var ev = Game.step(s, nx, ny);
      if (!ev.moved) return;
      var now = performance.now();
      animRef.current = { active: true, t0: now, dur: 165, kind: ev.collided ? 'collide' : 'move', from: prev, to: { x: nx, y: ny }, tick: prevTick + 1, splashUntil: now + 165 + 480 };
      if (ev.collided) { snd('lose'); pendRef.current = ev.over ? 'over' : 'failed'; }
      else if (ev.won) { snd('milestone'); pendRef.current = 'won'; setWinInfo({ score: s.lastLevelScore, moves: s.moves, optimal: s.board.optimal, beat: s.optimalBeaten }); }
      else snd('key');
      syncHud();
    }

    function localCell(e) {
      var rect = canvas.getBoundingClientRect();
      var t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      return pixelToCell(t.clientX - rect.left, t.clientY - rect.top);
    }
    function pdown(e) { e.preventDefault(); ptrRef.current.down = true; var c = localCell(e); doStep(c.x, c.y); }
    function pmove(e) { if (!ptrRef.current.down) return; e.preventDefault(); var c = localCell(e); doStep(c.x, c.y); }
    function pup() { ptrRef.current.down = false; }
    container.addEventListener('pointerdown', pdown);
    container.addEventListener('pointermove', pmove);
    window.addEventListener('pointerup', pup);
    container.addEventListener('touchstart', pdown, { passive: false });
    container.addEventListener('touchmove', pmove, { passive: false });
    window.addEventListener('touchend', pup);

    // Theme palette
    var pageBg, seaTop, seaBot, gridLn, edge, startCol, mutedCol;
    if (theme === 'clean-dark')   { pageBg = '#11161E'; seaTop = '#1B3A4B'; seaBot = '#152C3A'; gridLn = 'rgba(255,255,255,.08)'; edge = 'rgba(255,255,255,.10)'; startCol = 'rgba(255,255,255,.5)'; mutedCol = 'rgba(255,255,255,.5)'; }
    else if (theme === 'funky')   { pageBg = '#1A1030'; seaTop = '#2A3F70'; seaBot = '#1E2C52'; gridLn = 'rgba(255,255,255,.09)'; edge = 'rgba(255,255,255,.12)'; startCol = 'rgba(255,255,255,.55)'; mutedCol = 'rgba(255,255,255,.55)'; }
    else if (theme === 'classic') { pageBg = '#F4F1EA'; seaTop = '#DCEAF2'; seaBot = '#C7DCE8'; gridLn = 'rgba(40,60,80,.12)'; edge = 'rgba(40,60,80,.18)'; startCol = 'rgba(40,60,80,.5)'; mutedCol = '#6B7785'; }
    else                          { pageBg = '#EAF3F2'; seaTop = '#BFE0DC'; seaBot = '#9FCFC9'; gridLn = 'rgba(30,70,70,.13)'; edge = 'rgba(30,70,70,.18)'; startCol = 'rgba(30,70,70,.5)'; mutedCol = '#5E7A78'; }

    function rr(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    }

    function drawShipMini(ctx, x, y, cell, color) {
      var u = cell * 0.5;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#3A3550';
      ctx.beginPath(); ctx.moveTo(-u * 0.7, u * 0.1); ctx.lineTo(u * 0.7, u * 0.1); ctx.lineTo(u * 0.45, u * 0.45); ctx.lineTo(-u * 0.45, u * 0.45); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2A2638'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, u * 0.1); ctx.lineTo(0, -u * 0.55); ctx.stroke();
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -u * 0.55); ctx.lineTo(u * 0.55, -u * 0.2); ctx.lineTo(0, -u * 0.05); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function render() {
      var ctx = canvas.getContext('2d'); var s = stateRef.current; var l = layoutRef.current;
      ctx.fillStyle = pageBg; ctx.fillRect(0, 0, GW, GH);
      if (!s) return;
      var now = performance.now();
      var anim = animRef.current;
      var p = anim.active ? Math.min(1, (now - anim.t0) / anim.dur) : 1;
      var ep = ease(p);

      // Sea panel
      var grad = ctx.createLinearGradient(0, l.oy, 0, l.oy + l.boardH);
      grad.addColorStop(0, seaTop); grad.addColorStop(1, seaBot);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
      ctx.fillStyle = grad; rr(ctx, l.ox, l.oy, l.boardW, l.boardH, 14); ctx.fill(); ctx.restore();

      // Grid lines
      ctx.strokeStyle = gridLn; ctx.lineWidth = 1;
      for (var gx = 1; gx < s.board.cols; gx++) { ctx.beginPath(); ctx.moveTo(l.ox + gx * l.cell, l.oy); ctx.lineTo(l.ox + gx * l.cell, l.oy + l.boardH); ctx.stroke(); }
      for (var gy = 1; gy < s.board.rows; gy++) { ctx.beginPath(); ctx.moveTo(l.ox, l.oy + gy * l.cell); ctx.lineTo(l.ox + l.boardW, l.oy + gy * l.cell); ctx.stroke(); }
      ctx.strokeStyle = edge; ctx.lineWidth = 1.5; rr(ctx, l.ox, l.oy, l.boardW, l.boardH, 14); ctx.stroke();

      // Pirate patrol routes (transit-map style) — toggle via setting
      var showRoutes = localStorage.getItem('routl-preview') !== '0';
      if (showRoutes) {
        for (var pr = 0; pr < s.board.pirates.length; pr++) {
          var pir = s.board.pirates[pr];
          ctx.strokeStyle = pir.color; ctx.globalAlpha = 0.32; ctx.lineWidth = Math.max(4, l.cell * 0.16); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath();
          for (var si = 0; si < pir.seq.length; si++) { var cc = cellCenter(pir.seq[si].x, pir.seq[si].y); ctx[si ? 'lineTo' : 'moveTo'](cc.x, cc.y); }
          if (pir.mode === 'loop') ctx.closePath();
          ctx.stroke(); ctx.globalAlpha = 1;
        }
      }

      // Start dock + treasure
      var sc = cellCenter(s.board.start.x, s.board.start.y);
      ctx.strokeStyle = startCol; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sc.x, sc.y, l.cell * 0.34, 0, Math.PI * 2); ctx.stroke();
      var tc = cellCenter(s.board.treasure.x, s.board.treasure.y);
      ctx.save(); ctx.translate(tc.x, tc.y);
      ctx.fillStyle = '#F4B942'; rr(ctx, -l.cell * 0.26, -l.cell * 0.16, l.cell * 0.52, l.cell * 0.34, 4); ctx.fill();
      ctx.fillStyle = '#9B6B3A'; ctx.fillRect(-l.cell * 0.26, -l.cell * 0.02, l.cell * 0.52, l.cell * 0.06);
      ctx.fillStyle = '#E2483D'; ctx.font = '800 ' + Math.round(l.cell * 0.34) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('✕', 0, -l.cell * 0.28); ctx.restore();

      // Player path trail
      if (s.path.length > 1) {
        ctx.strokeStyle = charColor; ctx.globalAlpha = 0.5; ctx.lineWidth = Math.max(3, l.cell * 0.12); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([2, l.cell * 0.28]);
        ctx.beginPath();
        for (var pi = 0; pi < s.path.length; pi++) { var pc = cellCenter(s.path[pi].x, s.path[pi].y); ctx[pi ? 'lineTo' : 'moveTo'](pc.x, pc.y); }
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }

      // Pirates (interpolated when animating)
      var tick = anim.active ? anim.tick : s.tick;
      for (var k = 0; k < s.board.pirates.length; k++) {
        var pk = s.board.pirates[k];
        var a = Game.pirateAt(pk, anim.active ? tick - 1 : tick), b = Game.pirateAt(pk, tick);
        var ca = cellCenter(a.x, a.y), cb = cellCenter(b.x, b.y);
        var px = anim.active ? ca.x + (cb.x - ca.x) * ep : cb.x;
        var py = anim.active ? ca.y + (cb.y - ca.y) * ep : cb.y;
        drawShipMini(ctx, px, py, l.cell, pk.color);
      }

      // Boat (pet captain), interpolated
      var bf = anim.active ? anim.from : s.boat, btarget = anim.active ? anim.to : s.boat;
      var cf = cellCenter(bf.x, bf.y), ctn = cellCenter(btarget.x, btarget.y);
      var bx = cf.x + (ctn.x - cf.x) * ep, by = cf.y + (ctn.y - cf.y) * ep;
      var collideSplash = anim.active && anim.kind === 'collide' && p >= 1;
      ctx.save(); ctx.translate(bx, by);
      ctx.fillStyle = charColor; ctx.beginPath(); ctx.moveTo(-l.cell * 0.34, l.cell * 0.05); ctx.lineTo(l.cell * 0.34, l.cell * 0.05); ctx.lineTo(l.cell * 0.22, l.cell * 0.3); ctx.lineTo(-l.cell * 0.22, l.cell * 0.3); ctx.closePath(); ctx.fill();
      Game.drawFace(ctx, charId, l.cell * 0.6);
      ctx.restore();
      if (collideSplash) { ctx.fillStyle = 'rgba(226,72,61,.7)'; ctx.font = '800 ' + Math.round(l.cell * 0.5) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✸', bx, by); }

      // Resolve animation end
      if (anim.active && p >= 1) {
        if (anim.kind === 'move') {
          anim.active = false;
          if (pendRef.current === 'won') { pendRef.current = null; setStatus('won'); }
        } else if (now >= anim.splashUntil) {
          anim.active = false;
          if (pendRef.current === 'over') { pendRef.current = null; handleOver(); }
          else { pendRef.current = null; syncHud(); }   // failed → next attempt
        }
      }
    }

    function loop() { render(); rafRef.current = requestAnimationFrame(loop); }
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

  var attemptDots = [];
  for (var i = 0; i < 2; i++) attemptDots.push(i < (3 - hud.attempt) ? '●' : '○');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', flexShrink: 0, borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none' }}>
        <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: '5px 8px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, WebkitTapHighlightColor: 'transparent' }}>← Back</button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: charColor }}>ROUTL</div>
        <button onClick={onBoard} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', WebkitTapHighlightColor: 'transparent' }}>Scores</button>
      </div>

      {/* Mini HUD row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: tbColor }}>Level {hud.level}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,.6)' : 'var(--text-muted)' }}>Moves {hud.moves} · Best {hud.optimal}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#E2483D', letterSpacing: '0.1em' }}>{attemptDots.join(' ')}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: charColor }}>{hud.score}</div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none', cursor: 'pointer' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Level-cleared overlay */}
        {status === 'won' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: dark ? 'rgba(0,0,0,.6)' : 'rgba(20,40,38,.6)', backdropFilter: 'blur(5px)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#F4D58D', letterSpacing: '0.05em' }}>TREASURE!</div>
              <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.9)' }}>+{winInfo.score} points</div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{winInfo.moves} moves · best possible {winInfo.optimal}</div>
              {winInfo.beat && <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: '#8FD3B6' }}>⭐ Optimal route bonus!</div>}
            </div>
            <button onClick={nextLevel} style={{ border: 'none', background: charColor, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, padding: '13px 34px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,.22)', WebkitTapHighlightColor: 'transparent' }}>Next Sector →</button>
          </div>
        )}

        {/* Game over overlay */}
        {status === 'over' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: dark ? 'rgba(0,0,0,.62)' : 'rgba(20,40,38,.66)', backdropFilter: 'blur(5px)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: charColor, letterSpacing: '0.06em' }}>CAUGHT!</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8, color: 'rgba(255,255,255,.92)' }}>{finalScore}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>{'Reached Level ' + finalLevel}</div>
              {isNewRecord && <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D', animation: 'routl-bounce 0.9s ease-in-out infinite' }}>🏅 New Record!</div>}
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>{'HI ' + hiScore}</div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <button onClick={function (e) { e.stopPropagation(); setShowPrompt(true); }} style={{ border: 'none', background: charColor, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,.20)', WebkitTapHighlightColor: 'transparent' }}>Add your name to save your score</button>
                )}
              </div>
            )}
            {showPrompt && ID && React.createElement(ID.NamePrompt, { theme: theme, dismissible: true, onSave: function (nm) { setShowPrompt(false); submitWith(nm); }, onClose: function () { setShowPrompt(false); } })}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startGame} style={{ border: 'none', background: charColor, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,.22)', WebkitTapHighlightColor: 'transparent' }}>Try Again</button>
              <button onClick={onBoard} style={{ border: '2px solid rgba(255,255,255,.22)', background: 'transparent', color: 'rgba(255,255,255,.85)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, padding: '12px 20px', borderRadius: 999, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>Scores</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.RoutlGameScreen = RoutlGameScreen;
