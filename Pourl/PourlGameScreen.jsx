// POURL — Game Screen: an endless water-sort run. Tap a tube to pick it up,
// tap another to pour. Clear the level (every tube one colour or empty) to
// bank points and advance; 3 undos per level, and a deadlock with no undos
// left ends the run. Tubes are DOM (crisp taps, themeable, CSS lift/pour).

// Small front-facing pet mascot (reuses PourlGame.drawFace)
function PourlMascot({ charId, size }) {
  var canvasRef = React.useRef(null);
  var s = size || 40;
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var r = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = s * r; canvas.height = s * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, s, s);
    ctx.save();
    ctx.translate(s / 2, s / 2 + s * 0.06);
    try { window.PourlGame.drawFace(ctx, charId, s * 0.82); } catch (e) { console.error(e); }
    ctx.restore();
  }, [charId, s]);
  return <canvas ref={canvasRef} style={{ display: 'block', width: s + 'px', height: s + 'px' }} />;
}

function PourlGameScreen({ theme, charId, onBack, onBoard }) {
  var Game = window.PourlGame;

  var gsRef           = React.useRef(null);
  if (gsRef.current === null) gsRef.current = Game.makeLevel(1);
  var runScoreRef     = React.useRef(0);
  var levelsClearRef  = React.useRef(0);
  var bankedRef       = React.useRef(false);
  var solveTimerRef   = React.useRef(null);

  var [version,     setVersion]     = React.useState(0);
  var [runScore,    setRunScore]    = React.useState(0);
  var [selected,    setSelected]    = React.useState(-1);
  var [phase,       setPhase]       = React.useState('playing');   // playing | dead
  var [stuck,       setStuck]       = React.useState(false);
  var [clearFlash,  setClearFlash]  = React.useState(null);        // points just earned
  var [finalScore,  setFinalScore]  = React.useState(0);
  var [isNewRecord, setIsNewRecord] = React.useState(false);
  var [hiScore,     setHiScore]     = React.useState(function () { return Game.loadHighScores()[charId] || 0; });

  var dark       = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR   = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = Game.CHAR_EMOJI;
  var charColor  = CHAR_CLR[charId] || '#E8755C';
  var tbColor    = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';
  var mutedColor = dark ? 'rgba(255,255,255,.5)'  : 'var(--text-muted)';
  var cblind     = localStorage.getItem('pourl-cblind') === '1';
  var snd        = function (n) { if (window.YanSound) window.YanSound.play(n, 'pourl-sound'); };

  var bump = function () { setVersion(function (v) { return v + 1; }); };

  // ── Leaderboard submission ─────────────────────────────────────────
  var LB   = window.YanLeaderboard;
  var ID   = window.YanIdentity;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved,      setSaved]      = React.useState(false);
  var [showPrompt, setShowPrompt] = React.useState(false);

  function submitWith(score, nm) {
    if (!lbOn || !nm || !score) return;
    LB.submit({ game: 'pourl', name: nm, emoji: CHAR_EMOJI[charId], score: score, char_id: charId });
    setSaved(true);
  }

  // ── Bank the run (game over or silent exit) ────────────────────────
  function bankRun(showModal) {
    if (bankedRef.current) return;
    bankedRef.current = true;
    var score  = runScoreRef.current;
    var prevHi = Game.loadHighScores()[charId] || 0;
    Game.saveHighScore(charId, score);
    Game.recordGame(levelsClearRef.current);
    var newHi = Game.loadHighScores()[charId] || 0;
    setHiScore(Math.max(prevHi, newHi));
    setFinalScore(score);
    setIsNewRecord(newHi > prevHi && score > 0);
    if (showModal) { setPhase('dead'); snd('gameover'); }
    if (lbOn && score > 0 && LB.getName()) submitWith(score, LB.getName());
  }

  // ── Run lifecycle ──────────────────────────────────────────────────
  function startRun() {
    if (solveTimerRef.current) { clearTimeout(solveTimerRef.current); solveTimerRef.current = null; }
    gsRef.current = Game.makeLevel(1);
    runScoreRef.current = 0; levelsClearRef.current = 0; bankedRef.current = false;
    setRunScore(0); setSelected(-1); setPhase('playing'); setStuck(false);
    setClearFlash(null); setFinalScore(0); setIsNewRecord(false); setSaved(false); setShowPrompt(false);
    bump(); snd('start');
  }

  function onSolve() {
    var gs  = gsRef.current;
    var pts = Game.levelPoints(gs);
    runScoreRef.current += pts;
    levelsClearRef.current += 1;
    setRunScore(runScoreRef.current);
    setClearFlash(pts);
    setSelected(-1);
    snd('win');
    var next = gs.level + 1;
    solveTimerRef.current = setTimeout(function () {
      solveTimerRef.current = null;
      gsRef.current = Game.makeLevel(next);
      setSelected(-1); setStuck(false); setClearFlash(null);
      bump();
    }, 820);
  }

  function afterMove() {
    var gs = gsRef.current;
    if (Game.isSolved(gs)) { onSolve(); return; }
    if (!Game.hasUsefulMove(gs)) {
      if (gs.undosLeft <= 0) { bankRun(true); }
      else { setStuck(true); snd('lose'); }
    }
  }

  function onTubeClick(i) {
    if (phase !== 'playing' || clearFlash !== null) return;
    var gs = gsRef.current;
    if (selected === -1) {
      if (gs.tubes[i].length === 0) return;       // can't pick up an empty tube
      setSelected(i);
      return;
    }
    if (selected === i) { setSelected(-1); return; }
    var moved = Game.pour(gs, selected, i);
    if (moved > 0) {
      snd('flip'); setSelected(-1); setStuck(false); bump(); afterMove();
    } else {
      snd('invalid');
      setSelected(gs.tubes[i].length ? i : -1);   // retarget to the tapped tube if usable
    }
  }

  function doUndo() {
    var gs = gsRef.current;
    if (Game.undo(gs)) { snd('back'); setSelected(-1); setStuck(false); bump(); }
  }

  function handleBack() {
    if (!bankedRef.current && runScoreRef.current > 0) bankRun(false);
    onBack();
  }

  // Bank an in-progress run if the screen unmounts (nav away during play).
  React.useEffect(function () {
    return function () {
      if (solveTimerRef.current) clearTimeout(solveTimerRef.current);
      if (!bankedRef.current && runScoreRef.current > 0) bankRun(false);
    };
  }, []);

  // Keyboard: U = undo, Space/Enter = restart from game over.
  React.useEffect(function () {
    function onKey(e) {
      if (e.code === 'KeyU') { e.preventDefault(); if (phase === 'playing') doUndo(); }
      else if (e.code === 'Space' || e.code === 'Enter') { if (phase === 'dead') { e.preventDefault(); startRun(); } }
      else if (e.code === 'Escape') { setSelected(-1); }
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  });

  // ── Tube sizing — shrink to fit the tube count on one phone width ───
  var gs   = gsRef.current;
  var cap  = gs.capacity;
  var T    = gs.tubes.length;
  var perRow = Math.min(T, T <= 8 ? Math.ceil(T / Math.ceil(T / 6)) : 6);
  var TW   = T > 10 ? 40 : (T > 7 ? 44 : 50);
  var BH   = TW <= 40 ? 26 : (TW <= 44 ? 28 : 30);
  var tubeH = cap * BH + 8;

  var PAL = Game.PALETTE, SYM = Game.SYMBOLS;
  var glassBg     = dark ? 'rgba(255,255,255,.05)' : 'rgba(60,50,40,.05)';
  var glassBorder = dark ? 'rgba(255,255,255,.16)' : 'rgba(60,50,40,.18)';

  function Tube(props) {
    var tube = props.tube, i = props.i;
    var isSel    = selected === i;
    var isTarget = selected >= 0 && selected !== i && Game.canPour(gs, selected, i);
    return (
      <div
        onClick={function () { onTubeClick(i); }}
        style={{
          width: TW, height: tubeH, cursor: 'pointer', flexShrink: 0,
          display: 'flex', flexDirection: 'column-reverse',
          background: glassBg,
          border: '2px solid ' + (isSel ? charColor : (isTarget ? charColor + '88' : glassBorder)),
          borderRadius: '7px 7px ' + Math.round(TW * 0.42) + 'px ' + Math.round(TW * 0.42) + 'px',
          overflow: 'hidden',
          transform: isSel ? 'translateY(-12px)' : 'translateY(0)',
          boxShadow: isSel ? '0 10px 18px ' + charColor + '55'
                   : isTarget ? '0 0 0 3px ' + charColor + '22' : 'none',
          transition: 'transform 140ms var(--ease-bounce), box-shadow 140ms ease, border-color 120ms ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {Array.from({ length: cap }).map(function (_, u) {
          var filled = u < tube.length;
          var ci     = filled ? tube[u] : -1;
          var isTop  = filled && u === tube.length - 1;
          return (
            <div key={u} style={{
              height: BH, width: '100%',
              background: filled ? PAL[ci] : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isTop ? 'inset 0 3px 0 rgba(255,255,255,.22)' : 'none',
              transition: 'background 120ms ease',
            }}>
              {cblind && filled ? (
                <span style={{ fontSize: Math.round(BH * 0.5), color: 'rgba(255,255,255,.92)', lineHeight: 1, textShadow: '0 1px 1px rgba(0,0,0,.35)' }}>
                  {SYM[ci]}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  var undoDisabled = gs.undosLeft <= 0 || gs.history.length === 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', minHeight: 0 }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 12px', flexShrink: 0,
        borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none',
      }}>
        <button onClick={handleBack} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10,
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4, WebkitTapHighlightColor: 'transparent',
        }}>← Back</button>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: charColor }}>POURL</div>

        <button onClick={onBoard} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, padding: '5px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          fontFamily: 'var(--font-body)', WebkitTapHighlightColor: 'transparent',
        }}>Scores</button>
      </div>

      {/* Stat strip with mascot */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 16px 4px', flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: dark ? 'rgba(255,255,255,.07)' : 'var(--bg-sunken)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          animation: clearFlash !== null ? 'pourl-wobble 0.5s ease-in-out' : 'none',
        }}>
          <PourlMascot charId={charId} size={36} />
        </div>
        {[
          { val: 'Lv ' + gs.level,                label: 'Level' },
          { val: String(runScore),                label: 'Score' },
          { val: gs.undosLeft + '/' + Game.UNDOS, label: 'Undos' },
        ].map(function (item, i) {
          return (
            <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--game-text)', lineHeight: 1 }}>
                {item.val}
              </div>
              <div style={{ fontSize: 8, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <div style={{ flex: 1, position: 'relative', overflow: 'auto', minHeight: 0 }}>
        <div style={{
          minHeight: '100%',
          display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center',
          gap: '18px ' + (TW <= 40 ? 12 : 16) + 'px',
          padding: '18px 14px 14px',
          maxWidth: perRow * (TW + 18) + 40, margin: '0 auto',
        }}>
          {gs.tubes.map(function (tube, i) { return <Tube key={i} tube={tube} i={i} />; })}
        </div>

        {/* Level-clear flash */}
        {clearFlash !== null && (
          <div style={{
            position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: charColor,
              animation: 'pourl-pop 0.82s ease-out forwards', textShadow: '0 2px 0 rgba(0,0,0,.12)',
            }}>+{clearFlash}</div>
          </div>
        )}

        {/* Stuck banner (no useful move, but undos remain) */}
        {stuck && phase === 'playing' && clearFlash === null && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: dark ? 'rgba(0,0,0,.6)' : 'rgba(46,42,40,.9)', color: '#fff',
            fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 999,
            whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,.25)',
          }}>No moves left — tap Undo to back up</div>
        )}

        {/* Game Over overlay */}
        {phase === 'dead' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            background: dark ? 'rgba(0,0,0,.58)' : 'rgba(251,247,240,.80)', backdropFilter: 'blur(5px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: charColor, letterSpacing: '0.06em' }}>RUN OVER</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginTop: 8, color: dark ? 'rgba(255,255,255,.92)' : 'var(--text-body)' }}>{finalScore}</div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)' }}>
                {levelsClearRef.current} level{levelsClearRef.current === 1 ? '' : 's'} cleared
              </div>
              {isNewRecord && (
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: '#F4D58D', animation: 'pourl-bounce 0.9s ease-in-out infinite' }}>🏅 New Record!</div>
              )}
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)' }}>{'HI ' + hiScore}</div>
            </div>

            {lbOn && finalScore > 0 && (
              <div onClick={function (e) { e.stopPropagation(); }} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 42 }}>
                {saved ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Saved to leaderboard ✓</div>
                ) : (
                  <button onClick={function (e) { e.stopPropagation(); setShowPrompt(true); }} style={{
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
              onSave: function (nm) { setShowPrompt(false); submitWith(finalScore, nm); },
              onClose: function () { setShowPrompt(false); },
            })}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startRun} style={{
                border: 'none', background: charColor, color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                padding: '12px 28px', borderRadius: 999, cursor: 'pointer',
                boxShadow: '0 4px 0 rgba(0,0,0,.22)', WebkitTapHighlightColor: 'transparent',
              }}>Play Again</button>
              <button onClick={onBoard} style={{
                border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
                background: 'transparent', color: dark ? 'rgba(255,255,255,.8)' : 'var(--text-body)',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                padding: '12px 20px', borderRadius: 999, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}>Scores</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar: Undo + hint */}
      <div style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '8px 16px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      }}>
        <button onClick={doUndo} disabled={undoDisabled} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          minWidth: 150, height: 48, borderRadius: 14, cursor: undoDisabled ? 'default' : 'pointer',
          border: '1px solid ' + (dark ? 'rgba(255,255,255,.10)' : 'var(--hairline)'),
          background: undoDisabled ? (dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)') : (dark ? 'rgba(255,255,255,.08)' : '#fff'),
          color: undoDisabled ? mutedColor : 'var(--game-text)', opacity: undoDisabled ? 0.5 : 1,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          boxShadow: undoDisabled ? 'none' : '0 2px 0 rgba(0,0,0,.10)',
          WebkitTapHighlightColor: 'transparent', transition: 'opacity 120ms ease',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-1" />
          </svg>
          Undo · {gs.undosLeft}
        </button>
        <div style={{ fontSize: 11, fontWeight: 500, color: mutedColor }}>
          Tap a tube, then tap where to pour
        </div>
      </div>
    </div>
  );
}
window.PourlGameScreen = PourlGameScreen;
