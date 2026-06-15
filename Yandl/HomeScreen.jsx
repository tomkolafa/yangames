// Yandl — Home Screen
function HomeScreen({ onPlay, onHowToPlay, theme }) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Button = DS.Button;
  var Badge = DS.Badge;
  var Game = window.YandlGame;
  var stats = Game.loadStats();
  var puzzleNum = Game.getPuzzleNumber();
  var todayDone = !!Game.loadTodayResult();
  var dark = theme === 'clean-dark' || theme === 'funky';

  var LOGO_COLORS = ['#E8755C','#8FD3B6','#F4D58D','#C7B6E8','#A7D3E8'];
  var LOGO_LETTERS = ['Y','A','N','D','L'];
  var winPct = stats.played > 0 ? Math.round(stats.wins / stats.played * 100) : 0;

  var mutedColor = dark ? 'rgba(255,255,255,.55)' : 'var(--text-muted)';
  var bodyColor  = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor   = dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)';
  var stripBg    = dark ? 'rgba(255,255,255,.07)' : 'var(--bg-sunken)';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', padding: '28px 24px 24px',
      background: 'var(--game-bg)', color: 'var(--game-text)',
      textAlign: 'center', overflowY: 'auto', minHeight: 0,
    }}>

      {/* Top badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {todayDone && <Badge tone="mint" variant="solid">Played ✓</Badge>}
      </div>

      {/* Cat + Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <img
          src="../assets/illustrations/cat.png"
          alt="Yandl mascot"
          style={{
            width: 110, height: 'auto',
            filter: 'drop-shadow(0 8px 18px rgba(46,42,40,.2))',
            animation: 'yandl-dance 1.8s ease-in-out infinite',
            transformOrigin: 'bottom center',
          }}
        />
        {/* Tile logo */}
        <div style={{ display: 'flex', gap: 5 }}>
          {LOGO_LETTERS.map(function(letter, i) {
            return React.createElement('div', {
              key: letter,
              style: {
                width: 46, height: 46,
                borderRadius: 10,
                background: LOGO_COLORS[i],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                color: '#fff',
                boxShadow: '0 3px 0 rgba(0,0,0,.15)',
              }
            }, letter);
          })}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: bodyColor, letterSpacing: '0.05em' }}>
          Guess the word in 6 tries
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex', gap: 0, background: stripBg,
        borderRadius: 'var(--radius-lg)', padding: '14px 0',
        width: '100%', maxWidth: 290, justifyContent: 'center',
      }}>
        {[
          { val: stats.streak,  label: 'Streak' },
          { val: stats.played,  label: 'Played' },
          { val: winPct + '%',  label: 'Win Rate' },
          { val: stats.maxStreak, label: 'Best' },
        ].map(function(item, i) {
          return React.createElement(React.Fragment, { key: item.label },
            i > 0 && React.createElement('div', { style: { width: 1, background: divColor, margin: '0 4px' } }),
            React.createElement('div', {
              style: { flex: 1, textAlign: 'center', padding: '0 2px' }
            },
              React.createElement('div', {
                style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--game-text)', lineHeight: 1 }
              }, item.val),
              React.createElement('div', {
                style: { fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }
              }, item.label)
            )
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 290 }}>
        <Button variant="primary" size="lg" fullWidth onClick={onPlay}>
          {todayDone ? 'See Today\'s Result' : 'Play Today\'s Yandl'}
        </Button>
        <Button variant="ghost" fullWidth onClick={onHowToPlay}
          style={{ color: bodyColor }}>
          How to play
        </Button>
      </div>
    </div>
  );
}
window.HomeScreen = HomeScreen;
