// BEND — Runner Game Screen (canvas-based endless runner)

function BendRunnerScreen({ theme, charId, onBack, onBoard }) {
  var canvasRef  = React.useRef(null);
  var stateRef   = React.useRef(null);
  var rafRef     = React.useRef(null);
  var phaseRef   = React.useRef('idle');
  var initFnRef  = React.useRef(null);
  var hiRef      = React.useRef(window.BendGame.loadHighScores()[charId] || 0);
  var Game       = window.BendGame;

  var [phase,       setPhase]      = React.useState('idle');
  var [finalScore,  setFinalScore] = React.useState(0);
  var [hiScore,     setHiScore]    = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);

  var dark      = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR  = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };
  var charColor = CHAR_CLR[charId] || '#E8755C';
  var tbColor   = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var snd       = function (n) { if (window.YanSound) window.YanSound.play(n, 'bend-sound'); };

  // ── Online leaderboard submission ─────────────────────────────────
  var LB   = window.YanLeaderboard;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,     setSaved]     = React.useState(false);
  var [nameInput, setNameInput] = React.useState(function () { return (LB && LB.getName()) || ''; });

  function saveScore(rawName) {
    if (!lbOn) return;
    var nm = LB.setName(rawName);
    if (!nm) return;
    setNameInput(nm);
    LB.submit({ game: 'rundl', name: nm, emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
    setSaved(true);
  }

  // Auto-submit on death once we already know the player's name
  React.useEffect(function () {
    if (phase === 'dead' && finalScore > 0 && lbOn && !saved && LB.getName()) {
      LB.submit({ game: 'rundl', name: LB.getName(), emoji: CHAR_EMOJI[charId], score: finalScore, char_id: charId });
      setSaved(true);
    }
  }, [phase, finalScore]);

  // ── Start / restart game ──────────────────────────────────────────
  function startGame() {
    if (initFnRef.current) stateRef.current = initFnRef.current();
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
    setSaved(false);
    snd('start');
  }

  // ── Jump ─────────────────────────────────────────────────────────
  function doJump() {
    var s = stateRef.current;
    if (!s || phaseRef.current !== 'playing') return;
    if (s.charY >= -2) { s.charVY = s.JUMP_VY; s.jumping = true; snd('jump'); }
  }

  // ── Keyboard input ────────────────────────────────────────────────
  React.useEffect(function () {
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (phaseRef.current === 'idle') { startGame(); return; }
        if (phaseRef.current === 'dead') { startGame(); return; }
        doJump();
      }
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  }, []);

  // ── Canvas tap ────────────────────────────────────────────────────
  function handleTap() {
    if (phaseRef.current === 'idle') { startGame(); return; }
    if (phaseRef.current === 'dead') { startGame(); return; }
    doJump();
  }

  // ── Main effect: canvas resize + game loop ─────────────────────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;

    // Reset state on remount / theme-change
    phaseRef.current = 'idle';
    setPhase('idle');

    // Layout (recomputed on resize / orientation / address-bar changes).
    // Backing store is scaled by devicePixelRatio so the canvas is crisp on
    // retina screens; all game coordinates stay in CSS pixels.
    var container = canvas.parentElement;
    var GW = 320, GH = 500, GROUND_Y = 300, CHAR_X = 60, DPR = 1;
    var GRAVITY = 0.60;
    var JUMP_VY = -14;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 3);
      GW = Math.floor(container.offsetWidth)  || 320;
      GH = Math.floor(container.offsetHeight) || 500;
      canvas.width  = Math.floor(GW * DPR);
      canvas.height = Math.floor(GH * DPR);
      // setting width/height resets the context — (re)apply the DPR transform
      canvas.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
      GROUND_Y = Math.round(GH * 0.60);
      CHAR_X   = Math.round(GW * 0.19);
    }
    resize();
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);

    // ── Create initial game state ─────────────────────────────────
    function makeState() {
      return {
        charY: 0, charVY: 0, jumping: false,
        obstacles: [],
        clouds: [
          { x: GW * 0.22, y: GH * 0.09, w: 62 },
          { x: GW * 0.62, y: GH * 0.06, w: 48 },
          { x: GW * 0.88, y: GH * 0.13, w: 38 },
        ],
        score: 0, speed: 5, frame: 0,
        spawnTimer: 0, nextSpawn: 70,
        JUMP_VY: JUMP_VY,
      };
    }
    initFnRef.current = makeState;
    stateRef.current  = makeState();

    // ── Theme palette ─────────────────────────────────────────────
    var skyTop, skyBot, gndFill, gndLine, gndDash, scoreCol, cloudCol;
    if (theme === 'clean-dark') {
      skyTop = '#1A1918'; skyBot = '#2B2A28'; gndFill = '#3A3633';
      gndLine = '#4A4744'; gndDash = '#2D2B29';
      scoreCol = 'rgba(255,255,255,.65)'; cloudCol = 'rgba(255,255,255,.06)';
    } else if (theme === 'funky') {
      skyTop = '#1A2535'; skyBot = '#2C3A4B'; gndFill = '#374958';
      gndLine = '#4A6070'; gndDash = '#2E3C4A';
      scoreCol = 'rgba(255,255,255,.7)'; cloudCol = 'rgba(255,255,255,.07)';
    } else if (theme === 'classic') {
      skyTop = '#EDEDED'; skyBot = '#F8F8F8'; gndFill = '#DCDCDC';
      gndLine = '#B2B2B2'; gndDash = '#CACACA';
      scoreCol = '#787C7E'; cloudCol = 'rgba(255,255,255,.9)';
    } else {
      skyTop = '#C6E6FF'; skyBot = '#EEF7FF'; gndFill = '#E8D4A8';
      gndLine = '#C8A87A'; gndDash = '#D6C090';
      scoreCol = '#9B9085'; cloudCol = 'rgba(255,255,255,.95)';
    }

    // ── Render frame ─────────────────────────────────────────────
    function render(s) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, GW, GH);

      // Sky gradient
      var sg = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sg.addColorStop(0, skyTop); sg.addColorStop(1, skyBot);
      ctx.fillStyle = sg; ctx.fillRect(0, 0, GW, GROUND_Y);

      // Clouds
      ctx.fillStyle = cloudCol;
      s.clouds.forEach(function (c) {
        ctx.beginPath();
        ctx.arc(c.x,              c.y,            c.w * 0.38, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.32, c.y - c.w * 0.13, c.w * 0.26, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.62, c.y,            c.w * 0.30, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground fill
      ctx.fillStyle = gndFill; ctx.fillRect(0, GROUND_Y, GW, GH - GROUND_Y);
      // Ground line
      ctx.fillStyle = gndLine; ctx.fillRect(0, GROUND_Y, GW, 3);
      // Scrolling dashes
      ctx.fillStyle = gndDash;
      var dOff = (s.frame * s.speed * 0.55) % 34;
      for (var dx = -dOff; dx < GW; dx += 34) { ctx.fillRect(dx, GROUND_Y + 11, 22, 4); }

      // Obstacles
      s.obstacles.forEach(function (ob) {
        if (ob.type === 'bone')      Game.drawBone(ctx, ob.x, GROUND_Y);
        if (ob.type === 'hydrant')   Game.drawHydrant(ctx, ob.x, GROUND_Y);
        if (ob.type === 'pineapple') Game.drawPineapple(ctx, ob.x, GROUND_Y);
        if (ob.type === 'seagull')   Game.drawSeagull(ctx, ob.x, ob.birdY, s.frame);
        if (ob.type === 'squirrel')  Game.drawSquirrel(ctx, ob.x, GROUND_Y);
        if (ob.type === 'cactus')    Game.drawCactus(ctx, ob.x, GROUND_Y);
      });

      // Character
      ctx.save();
      ctx.translate(CHAR_X, GROUND_Y + s.charY);
      Game.drawCharacter(ctx, charId, s.frame, s.jumping || s.charY < -2);
      ctx.restore();

      // Score HUD
      var scoreStr = String(Math.floor(s.score)).padStart(5, '0');
      var hiStr    = 'HI ' + String(hiRef.current).padStart(5, '0');
      ctx.fillStyle = scoreCol;
      ctx.font = 'bold 13px Nunito, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(hiStr + '    ' + scoreStr, GW - 10, 10);

      // Idle prompt
      if (phaseRef.current === 'idle') {
        ctx.fillStyle = dark ? 'rgba(255,255,255,.48)' : 'rgba(46,42,40,.40)';
        ctx.font = '700 14px Nunito, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('Tap or press SPACE to start', GW / 2, GROUND_Y - Math.round(GH * 0.14));
        var bob = Math.sin(Date.now() * 0.004) * 4;
        ctx.fillText('▲', GW / 2, GROUND_Y - Math.round(GH * 0.09) + bob);
      }
    }

    // ── Game loop ────────────────────────────────────────────────
    function loop() {
      var s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(loop); return; }

      // Always tick frame for idle/dead animation
      s.frame++;

      if (phaseRef.current === 'playing') {
        // Physics
        s.charVY += GRAVITY;
        s.charY  += s.charVY;
        if (s.charY >= 0) { s.charY = 0; s.charVY = 0; s.jumping = false; }

        // Speed ramp — accelerates continuously, caps at 16px/frame (~score 2000).
        // Steep early ramp so the run gets hard quickly, not just eventually.
        s.speed = Math.min(16, 5 + s.score * 0.0055);

        // Score
        s.score += s.speed * 0.05;
        if (Math.floor(s.score / 500) > (s.milestone || 0)) { s.milestone = Math.floor(s.score / 500); snd('milestone'); }

        // Clouds drift
        s.clouds.forEach(function (c) { c.x -= s.speed * 0.25; });
        s.clouds = s.clouds.filter(function (c) { return c.x > -110; });
        if (s.clouds.length < 4 && Math.random() < 0.007) {
          s.clouds.push({ x: GW + 50, y: GH * 0.04 + Math.random() * GH * 0.18, w: 36 + Math.random() * 56 });
        }

        // Obstacle spawning
        s.spawnTimer++;
        if (s.spawnTimer >= s.nextSpawn) {
          s.spawnTimer = 0;
          // Obstacles pack tighter and arrive more relentlessly as the score climbs.
          var gap = Math.max(32, 78 - s.score * 0.030);
          var jitter = Math.max(12, 40 - s.score * 0.010);
          s.nextSpawn = gap + Math.random() * jitter;
          var types = ['bone', 'bone', 'hydrant', 'pineapple', 'squirrel'];
          if (s.score > 90) types.push('cactus');
          if (s.score > 150) types.push('seagull');
          if (s.score > 420) types.push('seagull', 'cactus', 'squirrel');
          var t = types[Math.floor(Math.random() * types.length)];
          var ob = { type: t, x: GW + 30 };
          if (t === 'seagull') {
            // Variable heights so seagulls aren't predictable: sometimes down at the
            // runner's own height (must jump), sometimes high overhead (don't jump).
            var rr = Math.random();
            if (rr < 0.40)      ob.birdY = GROUND_Y - 16 - Math.random() * 18;  // low — runner height
            else if (rr < 0.70) ob.birdY = GROUND_Y - 48 - Math.random() * 22;  // mid
            else                ob.birdY = GROUND_Y - 86 - Math.random() * 38;  // high — overhead
          }
          s.obstacles.push(ob);
        }

        // Move obstacles left
        s.obstacles.forEach(function (ob) { ob.x -= s.speed; });
        s.obstacles = s.obstacles.filter(function (ob) { return ob.x > -90; });

        // ── Collision detection ───────────────────────────────────
        var hb  = Game.getCharHitbox(charId);
        var cL  = CHAR_X + hb.l;
        var cR  = CHAR_X + hb.r;
        var cT  = GROUND_Y + s.charY + hb.t;
        var cB  = GROUND_Y + s.charY;
        var M   = 5; // shrink both hitboxes by M pixels for fairness
        var hit = false;

        for (var i = 0; i < s.obstacles.length; i++) {
          var ob  = s.obstacles[i];
          var ohb = Game.getObstacleHitbox(ob, GROUND_Y);
          if ((cR - M) > (ohb.l + M) && (cL + M) < (ohb.r - M) &&
              (cB - M) > (ohb.t + M) && (cT + M) < (ohb.b - M)) {
            hit = true; break;
          }
        }

        if (hit) {
          var score   = Math.floor(s.score);
          var prevHi  = hiRef.current;
          Game.saveHighScore(charId, score);
          Game.recordGame();
          var newHi   = Game.loadHighScores()[charId] || 0;
          var isRecord = newHi > prevHi && score > 0;
          hiRef.current = Math.max(prevHi, newHi);
          setHiScore(hiRef.current);
          setFinalScore(score);
          setIsNewRecord(isRecord);
          phaseRef.current = 'dead';
          setPhase('dead');
          snd('gameover');
        }
      }

      render(s);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return function () {
      cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
    };
  }, [theme, charId]);

  // ── Render UI ────────────────────────────────────────────────────
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
        }}>RUNDL</div>

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
        style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: phase === 'playing' ? 'pointer' : 'default' }}
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
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginTop: 8,
                color: dark ? 'rgba(255,255,255,.92)' : 'var(--text-body)',
              }}>{String(finalScore).padStart(5, '0')}</div>

              {isNewRecord && (
                <div style={{
                  marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D',
                  animation: 'bend-bounce 0.9s ease-in-out infinite',
                }}>🏅 New Record!</div>
              )}

              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)' }}>
                {'HI ' + String(hiScore).padStart(5, '0')}
              </div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }}
                style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <React.Fragment>
                    <input
                      value={nameInput}
                      onChange={function (e) { setNameInput(e.target.value); }}
                      onKeyDown={function (e) { if (e.key === 'Enter') saveScore(nameInput); }}
                      placeholder="Your name"
                      maxLength={24}
                      style={{
                        border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
                        background: dark ? 'rgba(255,255,255,.08)' : '#fff',
                        color: dark ? '#fff' : 'var(--text-body)',
                        borderRadius: 999, padding: '9px 16px', fontSize: 14, fontWeight: 600,
                        fontFamily: 'var(--font-body)', width: 150, outline: 'none',
                      }}
                    />
                    <button
                      onClick={function (e) { e.stopPropagation(); saveScore(nameInput); }}
                      style={{
                        border: 'none', background: charColor, color: '#fff',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                        padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
                        boxShadow: '0 3px 0 rgba(0,0,0,.20)', WebkitTapHighlightColor: 'transparent',
                      }}>Save</button>
                  </React.Fragment>
                )}
              </div>
            )}

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

            <div style={{ fontSize: 11, fontWeight: 500, color: dark ? 'rgba(255,255,255,.3)' : 'var(--text-muted)', animation: 'bend-pulse 2s ease infinite' }}>
              Tap anywhere or press SPACE to restart
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.BendRunnerScreen = BendRunnerScreen;
