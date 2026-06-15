// Yandl — How To Play Screen
function HowToPlayScreen({ onBack, theme }) {
  var DS   = window.WordlingDesignSystem_ea77b4;
  var dark = theme === 'clean-dark' || theme === 'funky';
  var tbColor = dark ? 'rgba(255,255,255,.85)' : 'var(--text-body)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  function ExTile(props) {
    var stateMap = {
      correct: { bg: 'var(--state-correct-bg)', color: 'var(--state-correct-text)' },
      present: { bg: 'var(--state-present-bg)', color: 'var(--state-present-text)' },
      absent:  { bg: 'var(--state-absent-bg)',  color: 'var(--state-absent-text)'  },
      empty:   { bg: 'var(--tile-empty-bg)',    color: 'var(--tile-text)',  border: '2px solid var(--tile-empty-border)' },
      filled:  { bg: 'var(--tile-filled-bg)',   color: 'var(--tile-text)',  border: '2px solid var(--tile-filled-border)' },
    };
    var s = stateMap[props.state] || stateMap.empty;
    return React.createElement('div', {
      style: {
        width: 40, height: 40, borderRadius: 'var(--tile-radius)',
        background: s.bg, border: s.border || 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 17,
        color: s.color, textTransform: 'uppercase',
        boxShadow: 'var(--tile-shadow)',
      }
    }, props.letter);
  }

  function ExRow(props) {
    return React.createElement('div', {
      style: { display: 'flex', gap: 5, alignItems: 'center' }
    }, ...props.children);
  }

  var exRows = [
    {
      tiles: [
        { letter: 'W', state: 'correct' },
        { letter: 'E', state: 'filled' },
        { letter: 'A', state: 'filled' },
        { letter: 'R', state: 'filled' },
        { letter: 'Y', state: 'filled' },
      ],
      highlight: 0,
      color: 'var(--state-correct-bg)',
      text: 'W is in the word and in the correct spot.',
    },
    {
      tiles: [
        { letter: 'P', state: 'filled' },
        { letter: 'I', state: 'present' },
        { letter: 'L', state: 'filled' },
        { letter: 'O', state: 'filled' },
        { letter: 'T', state: 'filled' },
      ],
      highlight: 1,
      color: 'var(--state-present-bg)',
      text: 'I is in the word but in the wrong spot.',
    },
    {
      tiles: [
        { letter: 'V', state: 'filled' },
        { letter: 'A', state: 'filled' },
        { letter: 'G', state: 'filled' },
        { letter: 'U', state: 'absent' },
        { letter: 'E', state: 'filled' },
      ],
      highlight: 3,
      color: 'var(--state-absent-bg)',
      text: 'U is not in the word at all.',
    },
  ];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--game-bg)', color: 'var(--game-text)',
      overflowY: 'auto', minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px 10px',
        borderBottom: '1px solid ' + divColor,
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: tbColor, display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
          padding: '6px 4px', borderRadius: 8,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <IconBack size={20} /> Back
        </button>
        <div style={{
          fontFamily: 'var(--title-font)', fontWeight: 'var(--title-weight)',
          color: 'var(--title-color)', textTransform: 'var(--title-transform)',
          letterSpacing: 'var(--title-spacing)', fontSize: 18, whiteSpace: 'nowrap',
        }}>How to Play</div>
        <div style={{ width: 60 }}></div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 22px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: bodyColor, lineHeight: 1.55, textAlign: 'center' }}>
          Guess the <strong style={{ color: 'var(--brand)' }}>YANDL</strong> in 6 tries.<br />
          Each guess must be a 5-letter word.
        </p>

        <div style={{ borderTop: '1px solid ' + divColor }}></div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor }}>
          Examples
        </div>

        {exRows.map(function(row, ri) {
          return React.createElement('div', { key: ri, style: { display: 'flex', flexDirection: 'column', gap: 10 } },
            React.createElement('div', { style: { display: 'flex', gap: 5 } },
              row.tiles.map(function(t, ti) {
                return React.createElement(ExTile, { key: ti, letter: t.letter, state: t.state });
              })
            ),
            React.createElement('p', {
              style: { margin: 0, fontSize: 13.5, fontWeight: 500, color: bodyColor, lineHeight: 1.5 }
            },
              React.createElement('span', {
                style: {
                  display: 'inline-block', width: 14, height: 14, borderRadius: 3,
                  background: row.color, verticalAlign: 'middle', marginRight: 6,
                }
              }),
              row.text
            ),
            ri < exRows.length - 1 && React.createElement('div', { style: { borderTop: '1px solid ' + divColor } })
          );
        })}

        <div style={{ borderTop: '1px solid ' + divColor }}></div>

        <div style={{
          background: dark ? 'rgba(255,255,255,.06)' : 'var(--bg-sunken)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: bodyColor, lineHeight: 1.55, fontWeight: 500 }}>
            🗓 A new Yandl is available <strong>every day</strong>. Come back tomorrow for the next puzzle!
          </p>
        </div>
      </div>
    </div>
  );
}
window.HowToPlayScreen = HowToPlayScreen;
