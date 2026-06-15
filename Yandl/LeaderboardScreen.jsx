// Yandl — Leaderboard Screen
function LeaderboardScreen({ theme }) {
  var DS    = window.WordlingDesignSystem_ea77b4;
  var Badge = DS.Badge;
  var Game  = window.YandlGame;
  var dark  = theme === 'clean-dark' || theme === 'funky';
  var stats = Game.loadStats();
  var lb    = Game.LEADERBOARD;
  var todayResult = Game.loadTodayResult();
  var puzzleNum   = Game.getPuzzleNumber();

  var winPct = stats.played > 0 ? Math.round(stats.wins / stats.played * 100) : 0;
  var dist   = Array.isArray(stats.dist) ? stats.dist : [0,0,0,0,0,0];
  var maxDist = Math.max(1, ...dist);

  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor  = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor   = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg     = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  // Live "today's players" board (Supabase) with graceful fallback to sample.
  var myName = (window.YanLeaderboard && window.YanLeaderboard.getName()) || '';
  var [online, setOnline] = React.useState(null);
  React.useEffect(function() {
    if (window.YanLeaderboard && window.YanLeaderboard.ENABLED) {
      window.YanLeaderboard.fetchTop('yandl', { puzzle: puzzleNum, limit: 25 }).then(function(rows) {
        if (rows) setOnline(rows);
      });
    }
  }, []);

  function fmtTime(ms) {
    if (ms == null) return '--:--';
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  var lbWithYou;
  if (online && online.length) {
    lbWithYou = online.map(function(r) {
      return { name: r.name, emoji: r.emoji || '😺', guesses: r.guesses, time: fmtTime(r.time_ms),
               isYou: !!myName && r.name === myName };
    });
  } else {
    lbWithYou = lb.slice();
    if (todayResult && todayResult.guesses) {
      var myGuesses = todayResult.guesses.length;
      var insertIdx = lbWithYou.findIndex(function(e) { return e.guesses > myGuesses; });
      var youEntry = { name: 'You', emoji: '😺', guesses: myGuesses, time: '--:--', isYou: true };
      if (insertIdx === -1) lbWithYou.push(youEntry);
      else lbWithYou.splice(insertIdx, 0, youEntry);
    }
  }

  function SectionLabel(props) {
    return React.createElement('div', {
      style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, marginBottom: 10 }
    }, props.children);
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--game-bg)', color: 'var(--game-text)', minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px 12px', flexShrink: 0,
        borderBottom: '1px solid ' + divColor,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--title-font)', fontWeight: 'var(--title-weight)', color: 'var(--title-color)', textTransform: 'var(--title-transform)', letterSpacing: 'var(--title-spacing)', fontSize: 22 }}>
          Leaderboard
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0 }}>

        {/* Your Stats 2×2 grid */}
        <div>
          <SectionLabel>Your Stats</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { val: stats.played,       label: 'Played' },
              { val: winPct + '%',       label: 'Win Rate' },
              { val: stats.streak,       label: 'Current Streak', icon: '🔥' },
              { val: stats.maxStreak,    label: 'Best Streak', icon: '⭐' },
            ].map(function(item) {
              return React.createElement('div', {
                key: item.label,
                style: {
                  background: cardBg, border: '1px solid ' + cardBorder,
                  borderRadius: 'var(--radius-md)', padding: '14px 12px',
                  textAlign: 'center',
                }
              },
                React.createElement('div', {
                  style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, color: 'var(--game-text)', lineHeight: 1 }
                },
                  item.icon === '🔥'
                    ? React.createElement(React.Fragment, null,
                        React.createElement('span', {
                          style: {
                            display: 'inline-block',
                            animation: 'yandl-fire 2.8s ease-in-out infinite',
                            transformOrigin: 'bottom center',
                          }
                        }, '🔥'),
                        ' ' + item.val
                      )
                    : (item.icon ? item.icon + ' ' + item.val : item.val)
                ),
                React.createElement('div', {
                  style: { fontSize: 11, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }
                }, item.label)
              );
            })}
          </div>
        </div>

        {/* Guess distribution */}
        <div>
          <SectionLabel>Guess Distribution</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {dist.map(function(count, i) {
              var pct = Math.max(8, Math.round(count / maxDist * 100));
              var isLast = todayResult && todayResult.guesses && todayResult.guesses.length === i + 1;
              return React.createElement('div', {
                key: i, style: { display: 'flex', alignItems: 'center', gap: 8 }
              },
                React.createElement('div', {
                  style: { width: 16, textAlign: 'right', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: bodyColor, flexShrink: 0 }
                }, i + 1),
                React.createElement('div', {
                  style: { flex: 1, height: 26, background: dark ? 'rgba(255,255,255,.08)' : 'var(--bg-sunken)', borderRadius: 6, overflow: 'hidden' }
                },
                  React.createElement('div', {
                    style: {
                      width: pct + '%', height: '100%',
                      background: isLast ? 'var(--accent-success)' : 'var(--brand)',
                      borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                      transition: 'width 0.5s var(--ease-soft)',
                    }
                  },
                    React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: '#fff' } }, count || '')
                  )
                )
              );
            })}
          </div>
        </div>

        {/* Today's leaderboard */}
        <div>
          <SectionLabel>Today's Players</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {lbWithYou.map(function(entry, i) {
              var isYou = entry.isYou;
              return React.createElement('div', {
                key: i,
                style: {
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  background: isYou ? (dark ? 'rgba(232,117,92,.18)' : 'var(--brand-tint)') : 'transparent',
                }
              },
                React.createElement('div', {
                  style: { width: 20, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: mutedColor, textAlign: 'right', flexShrink: 0 }
                }, '#' + (i + 1)),
                React.createElement('div', {
                  style: { width: 36, height: 36, borderRadius: '50%', background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }
                }, entry.emoji),
                React.createElement('div', { style: { flex: 1 } },
                  React.createElement('div', {
                    style: { fontWeight: 700, fontSize: 14, color: isYou ? 'var(--brand)' : 'var(--game-text)' }
                  }, entry.name + (isYou ? ' (You)' : '')),
                  React.createElement('div', {
                    style: { fontSize: 12, color: mutedColor }
                  }, entry.guesses + ' guess' + (entry.guesses === 1 ? '' : 'es'))
                ),
                React.createElement('div', {
                  style: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: mutedColor }
                }, entry.time)
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
window.LeaderboardScreen = LeaderboardScreen;
