// BEND — Leaderboard Screen

// Front-facing 2D portrait faces (head only, centered)
function CharFacePortrait({ charId, size }) {
  var canvasRef = React.useRef(null);
  var s = size || 40;

  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var r = window.devicePixelRatio || 1;
    canvas.width = s * r; canvas.height = s * r;
    ctx.scale(r, r);
    ctx.clearRect(0, 0, s, s);
    ctx.save();
    ctx.translate(s / 2, s / 2);
    var sc = s / 60;
    ctx.scale(sc, sc);

    if (charId === 'B') {
      // Bebe — Golden Retriever front portrait
      // Ears (behind head)
      ctx.fillStyle = '#D4952A';
      ctx.beginPath(); ctx.ellipse(-18, 6, 9, 16, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, 6, 9, 16, 0.15, 0, Math.PI * 2); ctx.fill();
      // Ear inner
      ctx.fillStyle = '#C8882A';
      ctx.beginPath(); ctx.ellipse(-17, 8, 5, 10, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 8, 5, 10, 0.15, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = '#F0B030';
      ctx.beginPath(); ctx.ellipse(0, -2, 20, 22, 0, 0, Math.PI * 2); ctx.fill();
      // Forehead lighter
      ctx.fillStyle = '#F5C84E';
      ctx.beginPath(); ctx.ellipse(0, -12, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Muzzle
      ctx.fillStyle = '#FBDB7A';
      ctx.beginPath(); ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Eyes
      ctx.fillStyle = '#3A2518';
      ctx.beginPath(); ctx.arc(-8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      // Brows
      ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      // Nose
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 4.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      // Mouth
      ctx.strokeStyle = '#2E2A28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.quadraticCurveTo(0, 14, 4, 10); ctx.stroke();
      // Tongue
      ctx.fillStyle = '#E8657C';
      ctx.beginPath(); ctx.ellipse(0, 13, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath(); ctx.ellipse(0, 12.5, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    } else if (charId === 'E') {
      // Bambi — Yandl Cat front portrait
      // Ears (tall, pointy cat ears)
      ctx.fillStyle = '#C45A42';
      ctx.beginPath(); ctx.moveTo(-12, -28); ctx.lineTo(-6, -10); ctx.lineTo(-20, -10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -28); ctx.lineTo(6, -10); ctx.lineTo(20, -10); ctx.closePath(); ctx.fill();
      // Ear inner
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.moveTo(-12, -25); ctx.lineTo(-8, -12); ctx.lineTo(-18, -12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -25); ctx.lineTo(8, -12); ctx.lineTo(18, -12); ctx.closePath(); ctx.fill();
      // Head
      ctx.fillStyle = '#E8755C';
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      // Forehead stripes
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, -18); ctx.lineTo(-3, -8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(0, -9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -18); ctx.lineTo(3, -8); ctx.stroke();
      // Muzzle
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.ellipse(0, 7, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      // Eyes
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.fillStyle = '#E76A91';
      ctx.beginPath(); ctx.ellipse(0, 4, 2.8, 2, 0, 0, Math.PI * 2); ctx.fill();
      // Mouth
      ctx.strokeStyle = '#C45A42'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
      // Whiskers
      ctx.strokeStyle = 'rgba(200,160,150,.6)'; ctx.lineWidth = 1;
      [[-8,6,-20,3],[-8,7,-20,8],[8,6,20,3],[8,7,20,8]].forEach(function (w) {
        ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke();
      });

    } else if (charId === 'N') {
      // Nene — King Charles Cavalier front portrait
      // Long silky ears (behind head)
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(-17, 6, 8, 18, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 6, 8, 18, 0.08, 0, Math.PI * 2); ctx.fill();
      // Ear highlights
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath(); ctx.ellipse(-16, 8, 4, 12, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(16, 8, 4, 12, 0.08, 0, Math.PI * 2); ctx.fill();
      // Head (round dome)
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -2, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      // Black cap on top
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.arc(0, -3, 18, Math.PI + 0.15, -0.15); ctx.closePath(); ctx.fill();
      // White blaze
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -5, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
      // Lozenge spot
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(0, -16, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      // Muzzle
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, 8, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      // Eyes (large, round, gentle)
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.arc(-7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.ellipse(0, 6, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath(); ctx.ellipse(-1, 5, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
      // Mouth
      ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 10); ctx.quadraticCurveTo(0, 13, 3, 10); ctx.stroke();

    } else if (charId === 'D') {
      // Dede — Longhair Mini Dachshund front portrait
      // Long floppy ears
      ctx.fillStyle = '#6A4020';
      ctx.beginPath(); ctx.ellipse(-15, 6, 7, 16, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(15, 6, 7, 16, 0.2, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = '#9B6B3A';
      ctx.beginPath(); ctx.ellipse(0, -2, 17, 19, 0, 0, Math.PI * 2); ctx.fill();
      // Darker top
      ctx.fillStyle = '#7A5028';
      ctx.beginPath(); ctx.ellipse(0, -10, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
      // Lighter muzzle area
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.ellipse(0, 7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
      // Eyes
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      // Eyebrow dots
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.arc(-6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // Mouth
      ctx.strokeStyle = '#6A4020'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
    }

    ctx.restore();
  }, [charId, s]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: s + 'px', height: s + 'px', margin: '0 auto' }}
    />
  );
}
window.CharFacePortrait = CharFacePortrait;

function BendLeaderboardScreen({ theme, charId }) {
  var Game  = window.BendGame;
  var dark  = theme === 'clean-dark' || theme === 'funky';
  var hs    = Game.loadHighScores();
  var stats = Game.loadStats();

  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor  = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor   = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg     = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  var CharPreview = window.CharPreviewCanvas;

  var CHAR_COLOR = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  var CHAR_EMOJI = { B: '🐕', E: '🐱', N: '👑', D: '🌭' };

  // Live global leaderboard (Supabase) with graceful fallback to sample data.
  var myName = (window.YanLeaderboard && window.YanLeaderboard.getName()) || '';
  var [online, setOnline] = React.useState(null);
  React.useEffect(function () {
    if (window.YanLeaderboard && window.YanLeaderboard.ENABLED) {
      window.YanLeaderboard.fetchTop('rundl', { limit: 25 }).then(function (rows) {
        if (rows) setOnline(rows);
      });
    }
  }, []);

  var fullLb;
  if (online && online.length) {
    fullLb = online.slice(0, 10).map(function (r) {
      return { name: r.name, emoji: r.emoji, char: r.char_id || 'B', score: r.score,
               isYou: !!myName && r.name === myName };
    });
  } else {
    // Sample board + your local per-character bests
    fullLb = Game.LEADERBOARD.slice();
    Game.CHARACTERS.forEach(function (c) {
      if (hs[c.id]) {
        fullLb.push({ name: 'You', emoji: CHAR_EMOJI[c.id], char: c.id, score: hs[c.id], isYou: true });
      }
    });
    fullLb.sort(function (a, b) { return b.score - a.score; });
    fullLb = fullLb.slice(0, 10);
  }

  var globalHi    = Game.getGlobalHi();
  var totalChars  = Object.keys(hs).length;
  var MEDALS      = ['🥇', '🥈', '🥉'];

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
          <SectionLabel>Your Best Per Character</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Game.CHARACTERS.map(function (char) {
              var score  = hs[char.id];
              var active = char.id === charId;
              var cc     = CHAR_COLOR[char.id];
              return (
                <div key={char.id} style={{
                  background: active ? (dark ? 'rgba(255,255,255,.09)' : 'var(--brand-tint)') : cardBg,
                  border: '1px solid ' + (active ? cc : cardBorder),
                  borderRadius: 12, padding: '12px 10px', textAlign: 'center',
                }}>
                  <div style={{ marginBottom: 4 }}>
                    <CharFacePortrait charId={char.id} size={44} />
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: cc, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {char.name}
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
              { val: stats.games || 0,           label: 'Total Runs'  },
              { val: globalHi || '—',            label: 'Best Score'  },
              { val: totalChars + ' / 4',        label: 'Pets Used'   },
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
                  background: isYou ? (dark ? 'rgba(232,117,92,.17)' : 'var(--brand-tint)') : 'transparent',
                }}>
                  {/* Rank */}
                  <div style={{ width: 22, textAlign: 'center', flexShrink: 0, ...rankStyle }}>
                    {rankGlyph}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    <CharFacePortrait charId={entry.char} size={36} />
                  </div>

                  {/* Name + character */}
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

                  {/* Score */}
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                    color: 'var(--game-text)', flexShrink: 0,
                  }}>
                    {String(entry.score).padStart(5, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tips ── */}
        <div style={{
          background: dark ? 'rgba(255,255,255,.05)' : 'var(--bg-sunken)',
          borderRadius: 12, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: mutedColor, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tips</div>
          {[
            '🦴 Bone — jump clean over it',
            '🚒 Hydrant — jump early, it\'s tall',
            '🍍 Pineapple — spiky and mid-height',
            '🐿️ Squirrel — small but sneaky',
            '🌵 Cactus — wide, time it right',
            '🕊️ Seagull — flies at different heights',
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
window.BendLeaderboardScreen = BendLeaderboardScreen;
