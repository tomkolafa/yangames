// SLICL — Home Screen with mode selector

function SliclHomeScreen({ theme, mode, setMode, onPlay }) {
  var DS      = window.WordlingDesignSystem_ea77b4;
  var Button  = DS.Button;
  var Game    = window.SliclGame;
  var dark    = theme === 'clean-dark' || theme === 'funky';

  var hs       = Game.loadHighScores();
  var stats    = Game.loadStats();
  var globalHi = Game.getGlobalHi();

  var mutedColor = dark ? 'rgba(255,255,255,.5)'  : 'var(--text-muted)';
  var divColor   = dark ? 'rgba(255,255,255,.1)'  : 'var(--hairline)';

  var LOGO_COLORS  = ['#3FA35A', '#F39B36', '#E2483D', '#F4D03F', '#8E5BD0'];
  var LOGO_LETTERS = ['S', 'L', 'I', 'C', 'L'];

  var MODE_INFO = [
    { id: 'classic', label: 'Classic', desc: '3 lives — miss or hit a bomb',  color: '#E2483D', emoji: '🍉' },
    { id: 'arcade',  label: 'Arcade',  desc: '60s blitz — combos & bananas',  color: '#F39B36', emoji: '🍌' },
    { id: 'zen',     label: 'Zen',     desc: '90s, no bombs — pure slicing',  color: '#3FA35A', emoji: '🍃' },
  ];

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', color: 'var(--game-text)', overflowY: 'auto', minHeight: 0 }}>
      <button onClick={function () { window.location.href = '../index.html'; }} aria-label="Back to game selection"
        style={{ position: 'absolute', top: 6, left: 6, zIndex: 5, width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--game-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <div style={{ margin: 'auto', width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 16px 20px', gap: 16 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {LOGO_LETTERS.map(function (letter, i) {
            return (
              <div key={i} style={{ width: 38, height: 38, borderRadius: 9, background: LOGO_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff', boxShadow: '0 3px 0 rgba(0,0,0,.18)' }}>{letter}</div>
            );
          })}
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, marginBottom: 8, marginTop: 20 }}>Choose a Mode</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MODE_INFO.map(function (mi) {
              var active = mode === mi.id;
              return (
                <button key={mi.id} onClick={function () { setMode(mi.id); }} style={{
                  border: '2px solid ' + (active ? mi.color : (dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)')),
                  borderRadius: 14, background: active ? mi.color + '1F' : (dark ? 'rgba(255,255,255,.03)' : '#fff'),
                  cursor: 'pointer', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  boxShadow: active ? ('0 0 0 3px ' + mi.color + '28') : 'none', transition: 'all 150ms ease', WebkitTapHighlightColor: 'transparent',
                }}>
                  <span style={{ fontSize: 26 }}>{mi.emoji}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: active ? mi.color : 'var(--game-text)' }}>{mi.label}</span>
                    <span style={{ display: 'block', fontSize: 12, color: mutedColor, marginTop: 1 }}>{mi.desc}</span>
                  </span>
                  {hs[mi.id] ? <span style={{ fontSize: 11, fontWeight: 800, color: mutedColor }}>{hs[mi.id]}</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <Button variant="primary" size="lg" fullWidth onClick={onPlay}>Slice!</Button>
        </div>

        <div style={{ display: 'flex', background: 'transparent', borderRadius: 'var(--radius-lg)', padding: '6px 0', width: '100%', opacity: 0.5 }}>
          {[
            { val: globalHi > 0 ? String(globalHi) : '—', label: 'Best Score' },
            { val: stats.bestCombo ? '×' + stats.bestCombo : '—', label: 'Best Combo' },
            { val: stats.games || 0, label: 'Games' },
          ].map(function (item, i) {
            return (
              <React.Fragment key={item.label}>
                {i > 0 && <div style={{ width: 1, background: divColor }}></div>}
                <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--game-text)', lineHeight: 1 }}>{item.val}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>{item.label}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
window.SliclHomeScreen = SliclHomeScreen;
