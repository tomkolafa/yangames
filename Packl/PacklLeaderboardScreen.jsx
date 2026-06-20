// PACKL — Leaderboard Screen

// Front-facing pet portrait (reuses PacklGame.drawFace — same art as the chomper)
function PacklFacePortrait({ charId, size }) {
  var canvasRef = React.useRef(null);
  var s = size || 40;

  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var r = window.devicePixelRatio || 1;
    canvas.width = s * r; canvas.height = s * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, s, s);
    ctx.save();
    ctx.translate(s / 2, s / 2);
    try { window.PacklGame.drawFace(ctx, charId, s); } catch (e) { console.error(e); }
    ctx.restore();
  }, [charId, s]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: s + 'px', height: s + 'px', margin: '0 auto' }}
    />
  );
}

function PacklLeaderboardScreen({ theme, charId }) {
  var Game  = window.PacklGame;
  var dark  = theme === 'clean-dark' || theme === 'funky';
  var hs    = Game.loadHighScores();
  var stats = Game.loadStats();

  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor  = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor   = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg     = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  var CHAR_COLOR = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };

  // Live global leaderboard (Supabase) — real players only, no seed data.
  var myName = (window.YanLeaderboard && window.YanLeaderboard.getName()) || '';
  var [online, setOnline] = React.useState(null);   // null = still loading
  React.useEffect(function () {
    if (window.YanLeaderboard && window.YanLeaderboard.ENABLED) {
      window.YanLeaderboard.fetchTop('packl', { limit: 25 }).then(function (rows) {
        setOnline(rows || []);
      });
    } else {
      setOnline([]);
    }
  }, []);

  var loading = online === null;
  var fullLb;
  if (online && online.length) {
    fullLb = online.slice(0, 10).map(function (r) {
      return { name: r.name, emoji: r.emoji, char: r.char_id || 'B', score: r.score,
               isYou: !!myName && r.name === myName };
    });
  } else {
    fullLb = [];
    Game.CHARACTERS.forEach(function (c) {
      if (hs[c.id]) {
        fullLb.push({ name: myName || 'You', emoji: CHAR_EMOJI[c.id], char: c.id, score: hs[c.id], isYou: true });
      }
    });
    fullLb.sort(function (a, b) { return b.score - a.score; });
    fullLb = fullLb.slice(0, 10);
  }

  var globalHi   = Game.getGlobalHi();
  var totalChars = Object.keys(hs).length;
  var MEDALS     = ['🥇', '🥈', '🥉'];

  function SectionLabel({ children }) {
    return (
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: mutedColor, marginBottom: 8,
      }}>{children}</div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', color: 'var(--game-text)', minHeight: 0 }}>

      {/* Header */}
      <div style={{
        padding: '14px 18px 12px', flexShrink: 0,
        borderBottom: '1px solid ' + divColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em',
        }}>
          Leaderboard
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 28px', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>

        {/* ── Per-character bests ── */}
        <div>
          <SectionLabel>Your Best Per Chomper</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Game.CHARACTERS.map(function (char) {
              var active = char.id === charId;
              var cc     = CHAR_COLOR[char.id];
              return (
                <div key={char.id} style={{
                  background: active ? (dark ? 'rgba(255,255,255,.09)' : 'var(--brand-tint)') : cardBg,
                  border: '1px solid ' + (active ? cc : cardBorder),
                  borderRadius: 12, padding: '12px 10px', textAlign: 'center',
                }}>
                  <div style={{ marginBottom: 4 }}>
                    <PacklFacePortrait charId={char.id} size={44} />
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: cc, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {char.name}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--game-text)', marginTop: 2 }}>
                    {hs[char.id] ? hs[char.id] : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Overall stats ── */}
        <div style={{ background: cardBg, border: '1px solid ' + cardBorder, borderRadius: 14, padding: '14px 12px' }}>
          <SectionLabel>Your Stats</SectionLabel>
          <div style={{ display: 'flex' }}>
            {[
              { val: stats.games || 0,    label: 'Games'      },
              { val: globalHi || '—',     label: 'Best Score' },
              { val: stats.wins || 0,     label: 'Full Clears' },
            ].map(function (item, i) {
              return (
                <React.Fragment key={item.label}>
                  {i > 0 && <div style={{ width: 1, background: divColor }}></div>}
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--game-text)', lineHeight: 1 }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
                      {item.label}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Global rankings ── */}
        <div>
          <SectionLabel>Global Rankings</SectionLabel>
          {loading ? (
            <div style={{ padding: '20px 6px', textAlign: 'center', fontSize: 13, color: mutedColor }}>
              Loading chompers…
            </div>
          ) : fullLb.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fullLb.map(function (entry, i) {
                var isYou      = entry.isYou;
                var entryChar  = Game.CHARACTERS.find(function (c) { return c.id === entry.char; });
                var rankGlyph  = i < 3 ? MEDALS[i] : ('#' + (i + 1));
                var rankStyle  = i === 0 ? { color: '#F4D58D', fontSize: 18 }
                               : i === 1 ? { color: '#C0C0C0', fontSize: 18 }
                               : i === 2 ? { color: '#CD7F32', fontSize: 18 }
                               :           { color: mutedColor, fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 700 };
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', borderRadius: 10,
                    background: isYou ? (dark ? 'rgba(244,185,66,.17)' : 'var(--brand-tint)') : 'transparent',
                  }}>
                    <div style={{ width: 22, textAlign: 'center', flexShrink: 0, ...rankStyle }}>
                      {rankGlyph}
                    </div>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      <PacklFacePortrait charId={entry.char} size={36} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700, fontSize: 13,
                        color: isYou ? 'var(--brand)' : 'var(--game-text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {entry.name}{isYou ? ' (You)' : ''}
                      </div>
                      <div style={{ fontSize: 11, color: mutedColor }}>
                        {entryChar ? entryChar.name : entry.char}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                      color: 'var(--game-text)', flexShrink: 0,
                    }}>
                      {entry.score}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              padding: '22px 16px', textAlign: 'center',
              border: '1px dashed ' + cardBorder, borderRadius: 12,
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>👻</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--game-text)', marginBottom: 2 }}>
                No scores on the board yet
              </div>
              <div style={{ fontSize: 12, color: mutedColor }}>
                Play a round to claim the top spot!
              </div>
            </div>
          )}
        </div>

        {/* ── Tips ── */}
        <div style={{
          background: dark ? 'rgba(255,255,255,.05)' : 'var(--bg-sunken)',
          borderRadius: 12, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: mutedColor, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>How to play</div>
          {[
            '🟡 Eat every pellet to clear the level',
            '✨ Grab an energizer to turn ghosts blue — then chomp them for combo points',
            '👻 Four ghosts, each hunts you a different way',
            '🏆 Survive all 5 levels — Desert, Dungeon, Rainforest, Heaven, Hell',
          ].map(function (tip) {
            return (
              <div key={tip} style={{ fontSize: 12, fontWeight: 500, color: bodyColor, lineHeight: 1.6 }}>
                {tip}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
window.PacklLeaderboardScreen = PacklLeaderboardScreen;
