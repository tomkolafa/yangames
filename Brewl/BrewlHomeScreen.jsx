// BREWL — Home Screen with animated pet selector

function BrewlPreviewCanvas({ charId, size }) {
  var canvasRef = React.useRef(null);
  var rafRef    = React.useRef(null);
  var frameRef  = React.useRef(0);

  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;

    function drawFrame(f) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(Math.round(size * 0.43), size - 8);
      try { window.BrewlGame.drawCharacter(ctx, charId, f, false); } catch (e) { console.error(e); }
      ctx.restore();
    }

    drawFrame(30);
    function loop() {
      frameRef.current++;
      drawFrame(frameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return function () { cancelAnimationFrame(rafRef.current); };
  }, [charId, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', pointerEvents: 'none', width: size + 'px', height: size + 'px' }}
    />
  );
}

function BrewlHomeScreen({ theme, charId, setCharId, onPlay }) {
  var DS      = window.WordlingDesignSystem_ea77b4;
  var Button  = DS.Button;
  var Game    = window.BrewlGame;
  var dark    = theme === 'clean-dark' || theme === 'funky';

  var hs       = Game.loadHighScores();
  var stats    = Game.loadStats();
  var globalHi = Game.getGlobalHi();

  var mutedColor = dark ? 'rgba(255,255,255,.5)'  : 'var(--text-muted)';
  var divColor   = dark ? 'rgba(255,255,255,.1)'  : 'var(--hairline)';

  var LOGO_COLORS  = ['#9B6B3A', '#E8755C', '#F4B942', '#56C98A', '#79D0E0'];
  var LOGO_LETTERS = ['B', 'R', 'E', 'W', 'L'];

  var CHAR_COLOR  = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_BG     = { B: 'rgba(244,185,66,.13)', E: 'rgba(232,117,92,.13)', N: 'rgba(74,74,74,.13)', D: 'rgba(155,107,58,.13)' };

  return (
    <div style={{
      position: 'relative',
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--game-bg)', color: 'var(--game-text)',
      overflowY: 'auto', minHeight: 0,
    }}>

      <button
        onClick={function () { window.location.href = '../index.html'; }}
        aria-label="Back to game selection"
        style={{
          position: 'absolute', top: 6, left: 6, zIndex: 5,
          width: 38, height: 38, borderRadius: '50%',
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: 'var(--game-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div style={{
        margin: 'auto', width: '100%', maxWidth: 420,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 16px 20px', gap: 16,
      }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {LOGO_LETTERS.map(function (letter, i) {
            return (
              <div key={i} style={{
                width: 38, height: 38, borderRadius: 9,
                background: LOGO_COLORS[i],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
                color: '#fff', boxShadow: '0 3px 0 rgba(0,0,0,.18)',
              }}>{letter}</div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: mutedColor }}>Fill every cup to the line — don't let it spill</div>
      </div>

      <div style={{ width: '100%' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, marginBottom: 8, marginTop: 14 }}>
          Choose Your Barista
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {Game.CHARACTERS.map(function (char) {
            var active = charId === char.id;
            var cc = CHAR_COLOR[char.id];
            return (
              <button key={char.id} onClick={function () { setCharId(char.id); }} style={{
                border: '2px solid ' + (active ? cc : (dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)')),
                borderRadius: 14,
                background: active ? CHAR_BG[char.id] : (dark ? 'rgba(255,255,255,.03)' : '#fff'),
                cursor: 'pointer', padding: '6px 4px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                boxShadow: active ? ('0 0 0 3px ' + cc + '28') : 'none',
                transition: 'all 150ms ease',
                WebkitTapHighlightColor: 'transparent',
              }}>
                <BrewlPreviewCanvas charId={char.id} size={86} />
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                  color: active ? cc : 'var(--game-text)', lineHeight: 1,
                }}>{char.name}</div>
                {hs[char.id] ? (
                  <div style={{ fontSize: 9, fontWeight: 700, color: mutedColor, marginTop: 1 }}>
                    Best: {hs[char.id]}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <Button variant="primary" size="lg" fullWidth onClick={onPlay}>
          {"Let's Brewl!"}
        </Button>
      </div>

      <div style={{
        display: 'flex', background: 'transparent',
        borderRadius: 'var(--radius-lg)', padding: '6px 0',
        width: '100%', opacity: 0.5,
      }}>
        {[
          { val: globalHi > 0 ? String(globalHi) : '—', label: 'Best Score' },
          { val: hs[charId]   ? String(hs[charId]) : '—', label: charId + ' Best' },
          { val: stats.games  || 0,                       label: 'Shifts' },
        ].map(function (item, i) {
          return (
            <React.Fragment key={item.label}>
              {i > 0 && <div style={{ width: 1, background: divColor }}></div>}
              <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--game-text)', lineHeight: 1 }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 8, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>
                  {item.label}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      </div>
    </div>
  );
}
window.BrewlHomeScreen = BrewlHomeScreen;
