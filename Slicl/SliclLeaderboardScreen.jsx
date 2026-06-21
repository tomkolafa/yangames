// SLICL — Leaderboard Screen

function SliclLeaderboardScreen({ theme, mode }) {
  var Game  = window.SliclGame;
  var dark  = theme === 'clean-dark' || theme === 'funky';
  var hs    = Game.loadHighScores();
  var stats = Game.loadStats();

  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor  = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor   = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg     = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  var MODE_LIST = [
    { id: 'classic', label: 'Classic', color: '#E2483D', emoji: '🍉' },
    { id: 'arcade',  label: 'Arcade',  color: '#F39B36', emoji: '🍌' },
    { id: 'zen',     label: 'Zen',     color: '#3FA35A', emoji: '🍃' },
  ];
  var MODE_BY_INITIAL = { c: 'classic', a: 'arcade', z: 'zen' };

  var myName = (window.YanLeaderboard && window.YanLeaderboard.getName()) || '';
  var [online, setOnline] = React.useState(null);
  React.useEffect(function () {
    if (window.YanLeaderboard && window.YanLeaderboard.ENABLED) {
      window.YanLeaderboard.fetchTop('slicl', { limit: 25 }).then(function (rows) { setOnline(rows || []); });
    } else { setOnline([]); }
  }, []);

  var loading = online === null;
  var fullLb;
  if (online && online.length) {
    fullLb = online.slice(0, 10).map(function (r) {
      return { name: r.name, emoji: r.emoji || '🍉', modeId: MODE_BY_INITIAL[r.char_id] || 'classic', score: r.score, isYou: !!myName && r.name === myName };
    });
  } else {
    fullLb = [];
    MODE_LIST.forEach(function (m) { if (hs[m.id]) fullLb.push({ name: myName || 'You', emoji: m.emoji, modeId: m.id, score: hs[m.id], isYou: true }); });
    fullLb.sort(function (a, b) { return b.score - a.score; });
    fullLb = fullLb.slice(0, 10);
  }

  var globalHi = Game.getGlobalHi();
  var MEDALS   = ['🥇', '🥈', '🥉'];

  function SectionLabel({ children }) {
    return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, marginBottom: 8 }}>{children}</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', color: 'var(--game-text)', minHeight: 0 }}>
      <div style={{ padding: '14px 18px 12px', flexShrink: 0, borderBottom: '1px solid ' + divColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em' }}>Leaderboard</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 28px', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>

        {/* Per-mode bests */}
        <div>
          <SectionLabel>Your Best Per Mode</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {MODE_LIST.map(function (m) {
              var active = m.id === mode;
              return (
                <div key={m.id} style={{ background: active ? (dark ? 'rgba(255,255,255,.09)' : 'var(--brand-tint)') : cardBg, border: '1px solid ' + (active ? m.color : cardBorder), borderRadius: 12, padding: '12px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, marginBottom: 2 }}>{m.emoji}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--game-text)', marginTop: 2 }}>{hs[m.id] ? hs[m.id] : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall stats */}
        <div style={{ background: cardBg, border: '1px solid ' + cardBorder, borderRadius: 14, padding: '14px 12px' }}>
          <SectionLabel>Your Stats</SectionLabel>
          <div style={{ display: 'flex' }}>
            {[
              { val: stats.games || 0,  label: 'Games'      },
              { val: globalHi || '—',   label: 'Best Score' },
              { val: stats.bestCombo ? '×' + stats.bestCombo : '—', label: 'Best Combo' },
            ].map(function (item, i) {
              return (
                <React.Fragment key={item.label}>
                  {i > 0 && <div style={{ width: 1, background: divColor }}></div>}
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--game-text)', lineHeight: 1 }}>{item.val}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{item.label}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Global rankings */}
        <div>
          <SectionLabel>Global Rankings</SectionLabel>
          {loading ? (
            <div style={{ padding: '20px 6px', textAlign: 'center', fontSize: 13, color: mutedColor }}>Loading slicers…</div>
          ) : fullLb.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fullLb.map(function (entry, i) {
                var isYou     = entry.isYou;
                var mInfo     = MODE_LIST.find(function (m) { return m.id === entry.modeId; }) || MODE_LIST[0];
                var rankGlyph = i < 3 ? MEDALS[i] : ('#' + (i + 1));
                var rankStyle = i === 0 ? { color: '#F4D58D', fontSize: 18 } : i === 1 ? { color: '#C0C0C0', fontSize: 18 } : i === 2 ? { color: '#CD7F32', fontSize: 18 } : { color: mutedColor, fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 700 };
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: isYou ? (dark ? 'rgba(143,211,182,.17)' : 'var(--brand-tint)') : 'transparent' }}>
                    <div style={{ width: 22, textAlign: 'center', flexShrink: 0, ...rankStyle }}>{rankGlyph}</div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{entry.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isYou ? 'var(--brand)' : 'var(--game-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.name}{isYou ? ' (You)' : ''}</div>
                      <div style={{ fontSize: 11, color: mutedColor }}>{mInfo.label}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--game-text)', flexShrink: 0 }}>{entry.score}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '22px 16px', textAlign: 'center', border: '1px dashed ' + cardBorder, borderRadius: 12 }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🍉</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--game-text)', marginBottom: 2 }}>No slicers on the board yet</div>
              <div style={{ fontSize: 12, color: mutedColor }}>Play a round to claim the top spot!</div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{ background: dark ? 'rgba(255,255,255,.05)' : 'var(--bg-sunken)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: mutedColor, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>How to play</div>
          {[
            '🔪 Swipe across fruit to slice it',
            '✊ Slice 3+ in one go for a combo bonus',
            '💣 Never slice a bomb (Classic & Arcade)',
            '⭐ Arcade bananas grant freeze, double or frenzy',
          ].map(function (tip) { return <div key={tip} style={{ fontSize: 12, fontWeight: 500, color: bodyColor, lineHeight: 1.6 }}>{tip}</div>; })}
        </div>
      </div>
    </div>
  );
}
window.SliclLeaderboardScreen = SliclLeaderboardScreen;
