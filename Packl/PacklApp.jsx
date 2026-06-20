// PACKL — App root: full-viewport mobile shell, nav, screen routing

function PacklBottomNav({ screen, onTab, theme }) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var tabs = [
    { id: 'home',        label: 'Home',  icon: React.createElement('svg', {width:20,height:20,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}, React.createElement('path', {d:'M3 12L12 3l9 9'}), React.createElement('path', {d:'M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9'})) },
    { id: 'game',        label: 'Play',  icon: React.createElement('svg', {width:20,height:20,viewBox:'0 0 24 24',fill:'currentColor',stroke:'none'}, React.createElement('path', {d:'M6 4l15 8-15 8V4z'})) },
    { id: 'leaderboard', label: 'Board', icon: React.createElement('svg', {width:20,height:20,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}, React.createElement('rect', {x:2,y:14,width:5,height:8,rx:1}), React.createElement('rect', {x:9.5,y:6,width:5,height:16,rx:1}), React.createElement('rect', {x:17,y:10,width:5,height:12,rx:1})) },
    { id: 'settings',    label: 'More',  icon: React.createElement('svg', {width:20,height:20,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}, React.createElement('circle', {cx:12,cy:12,r:3}), React.createElement('path', {d:'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'})) },
  ];
  return (
    <div style={{
      height: 62, display: 'flex', flexShrink: 0,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.07)' : 'var(--hairline)'),
      background: 'var(--game-bg)',
    }}>
      {tabs.map(function (tab) {
        var active = tab.id === screen;
        return (
          <button key={tab.id} onClick={function () { onTab(tab.id); }} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: active ? 'var(--brand)' : (dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)'),
            fontFamily: 'var(--font-body)', fontSize: 10,
            fontWeight: active ? 700 : 500,
            transition: 'color 120ms ease',
            position: 'relative',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {active && (
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: 20, height: 3, borderRadius: '3px 3px 0 0',
                background: 'var(--brand)',
              }}></div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PacklApp() {
  var [screen,  setScreen]  = React.useState('home');
  var [theme,   setTheme]   = React.useState(function () { return localStorage.getItem('packl-theme') || 'clean-light'; });
  var [charId,  setCharId]  = React.useState(function () { return localStorage.getItem('packl-char')  || 'B'; });
  var [gameKey, setGameKey] = React.useState(0);
  var ID = window.YanIdentity;
  var [showNamePrompt, setShowNamePrompt] = React.useState(function () { return !!ID && !ID.getName() && !ID.isOnboarded(); });

  var saveTheme = function (t) { setTheme(t); localStorage.setItem('packl-theme', t); };
  var saveChar  = function (c) { setCharId(c); localStorage.setItem('packl-char', c); };

  var startGame = function () {
    setScreen('game');
    setGameKey(function (k) { return k + 1; });
  };

  var handleTab = function (id) {
    if (id === 'game') { startGame(); return; }
    setScreen(id);
  };

  var showNav = screen !== 'game';

  return (
    <div className="app-root" data-theme={theme}>
      <div className="phone-shell">
        {screen === 'home' && React.createElement(window.PacklHomeScreen, {
          theme, charId, setCharId: saveChar, onPlay: startGame,
        })}
        {screen === 'game' && React.createElement(window.PacklGameScreen, {
          key: gameKey,
          theme, charId,
          onBack:  function () { setScreen('home'); },
          onBoard: function () { setScreen('leaderboard'); },
        })}
        {screen === 'leaderboard' && React.createElement(window.PacklLeaderboardScreen, {
          theme, charId,
        })}
        {screen === 'settings' && React.createElement(window.PacklSettingsScreen, {
          theme, setTheme: saveTheme,
        })}
        {showNav && React.createElement(PacklBottomNav, { screen, onTab: handleTab, theme })}
        {showNamePrompt && ID && React.createElement(ID.NamePrompt, {
          theme, dismissible: true,
          onSave: function () { setShowNamePrompt(false); },
          onClose: function () { setShowNamePrompt(false); },
        })}
      </div>
    </div>
  );
}
window.PacklApp = PacklApp;
