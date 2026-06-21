// POURL — Settings Screen (shared chrome + Pourl-specific colour-blind toggle)
function PourlSettingsScreen({ theme, setTheme }) {
  var dark = theme === 'clean-dark' || theme === 'funky';

  var [sound, setSound] = React.useState(function() { return localStorage.getItem('pourl-sound') !== '0'; });
  // Colour-blind labels: overlay a distinct symbol on each liquid colour.
  var [cblind, setCblind] = React.useState(function() { return localStorage.getItem('pourl-cblind') === '1'; });

  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var divColor   = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  var saveSound  = function(v) { setSound(v);  localStorage.setItem('pourl-sound',  v ? '1' : '0'); };
  var saveCblind = function(v) { setCblind(v); localStorage.setItem('pourl-cblind', v ? '1' : '0'); };

  function Toggle(props) {
    return React.createElement('div', {
      onClick: function() { props.onChange(!props.value); },
      style: {
        width: 46, height: 26, borderRadius: 999, flexShrink: 0,
        background: props.value ? 'var(--brand)' : (dark ? 'rgba(255,255,255,.2)' : 'var(--ink-3)'),
        position: 'relative', cursor: 'pointer',
        transition: 'background 180ms ease',
        boxShadow: props.value ? '0 0 0 3px var(--brand-tint)' : 'none',
      }
    },
      React.createElement('div', {
        style: {
          position: 'absolute', top: 3,
          left: props.value ? 23 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)',
          transition: 'left 180ms var(--ease-bounce)',
        }
      })
    );
  }

  function Row(props) {
    return React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 0', gap: 12,
      }
    },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontWeight: 600, fontSize: 14, color: 'var(--game-text)', lineHeight: 1.2 } }, props.label),
        props.desc && React.createElement('div', { style: { fontSize: 12, color: mutedColor, marginTop: 3, lineHeight: 1.4 } }, props.desc)
      ),
      props.control
    );
  }

  function SectionLabel(props) {
    return React.createElement('div', {
      style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, marginTop: 6, marginBottom: 2, paddingTop: 8 }
    }, props.children);
  }

  var THEMES = [
    { id: 'clean-light', label: 'Light',   dot: '#FBF7F0', border: '#E8755C', text: '#2E2A28' },
    { id: 'clean-dark',  label: 'Dark',    dot: '#2B2A28', border: '#56C98A', text: '#F4F1EC' },
    { id: 'classic',     label: 'Classic', dot: '#FFFFFF', border: '#6AAA64', text: '#1A1A1B' },
    { id: 'funky',       label: 'Funky',   dot: '#2C3A4B', border: '#F58BB0', text: '#FFFFFF' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', color: 'var(--game-text)', minHeight: 0 }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--title-font)', fontWeight: 'var(--title-weight)', color: 'var(--title-color)', textTransform: 'var(--title-transform)', letterSpacing: 'var(--title-spacing)', fontSize: 22 }}>
          Settings
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 32px', minHeight: 0 }}>

        {/* Profile */}
        {window.YanIdentity && (
          <React.Fragment>
            <SectionLabel>Profile</SectionLabel>
            <Row label="Your name" desc="Shown on the leaderboard across all our games" control={null} />
            <div style={{ paddingBottom: 6 }}>
              {React.createElement(window.YanIdentity.NameField, { theme: theme })}
            </div>
          </React.Fragment>
        )}

        {/* Appearance */}
        <SectionLabel>Appearance</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          {THEMES.map(function(t) {
            var active = theme === t.id;
            return React.createElement('button', {
              key: t.id,
              onClick: function() { setTheme(t.id); },
              style: {
                border: '2px solid ' + (active ? t.border : divColor),
                borderRadius: 'var(--radius-md)', padding: '12px 14px',
                background: t.dot, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
                boxShadow: active ? '0 0 0 3px ' + t.border + '40' : 'none',
              }
            },
              React.createElement('div', { style: { width: 18, height: 18, borderRadius: '50%', background: t.border } }),
              React.createElement('span', { style: { fontFamily: 'var(--font-body)', fontWeight: active ? 700 : 500, fontSize: 13, color: t.text } }, t.label)
            );
          })}
        </div>

        {/* Gameplay */}
        <SectionLabel>Gameplay</SectionLabel>
        <Row label="Colour-Blind Labels"
          desc="Show a distinct symbol on each colour so tubes are easy to tell apart."
          control={React.createElement(Toggle, { value: cblind, onChange: saveCblind })} />
        <Row label="Sound Effects"
          control={React.createElement(Toggle, { value: sound, onChange: saveSound })} />

        {/* About */}
        <SectionLabel>About</SectionLabel>
        <Row label="Pourl" desc="Water sort — pour and sort the liquids, one colour per tube" control={
          React.createElement('span', { style: { fontSize: 12, color: mutedColor, fontWeight: 600 } }, 'v1.0')
        } />
        <Row label="Built in 🇨🇦" desc="Arlington Ave labs." control={
          React.createElement('span', { style: { fontSize: 18 } }, '🧪')
        } />
      </div>
    </div>
  );
}
window.PourlSettingsScreen = PourlSettingsScreen;
