// Yandl — App root: full-viewport mobile shell, nav, screen routing

function BottomNav({ screen, onTab, theme }) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var activeTab = (screen === 'howto') ? 'home' : screen;
  var tabs = [
    { id: 'home',        Icon: window.IconHome,    label: 'Home'   },
    { id: 'game',        Icon: window.IconPlay,    label: 'Play'   },
    { id: 'leaderboard', Icon: window.IconTrophy,  label: 'Board'  },
    { id: 'settings',    Icon: window.IconGear,    label: 'More'   },
  ];
  return (
    <div style={{
      height: 62, display: 'flex', flexShrink: 0,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.07)' : 'var(--hairline)'),
      background: 'var(--game-bg)',
    }}>
      {tabs.map(function(tab) {
        var active = tab.id === activeTab;
        return React.createElement('button', {
          key: tab.id,
          onClick: function() { onTab(tab.id); },
          style: {
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: active ? 'var(--brand)' : (dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)'),
            fontFamily: 'var(--font-body)', fontSize: 10,
            fontWeight: active ? 700 : 500,
            WebkitTapHighlightColor: 'transparent',
            transition: 'color 120ms ease',
            position: 'relative',
          }
        },
          React.createElement(tab.Icon, { size: 20 }),
          React.createElement('span', null, tab.label),
          active && React.createElement('div', {
            style: {
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: 20, height: 3, borderRadius: '3px 3px 0 0',
              background: 'var(--brand)',
            }
          })
        );
      })}
    </div>
  );
}

function App() {
  var [screen,     setScreen]     = React.useState('home');
  var [prevScreen, setPrevScreen] = React.useState('home');
  var [theme,      setTheme]      = React.useState(function() { return localStorage.getItem('yandl-theme') || 'clean-light'; });
  var [gameKey,    setGameKey]    = React.useState(0);
  var ID = window.YanIdentity;
  var [showNamePrompt, setShowNamePrompt] = React.useState(function() { return !!ID && !ID.getName() && !ID.isOnboarded(); });

  var saveTheme = function(t) { setTheme(t); localStorage.setItem('yandl-theme', t); };

  var startGame = function() {
    setScreen('game');
    // only bump gameKey if game was completed (so we don't lose in-progress state)
    var r = window.YandlGame.loadTodayResult();
    if (!r) setGameKey(function(k) { return k + 1; });
  };

  var goHowTo = function(from) {
    setPrevScreen(from || screen);
    setScreen('howto');
  };

  var handleTab = function(id) {
    if (id === 'game') { startGame(); return; }
    setScreen(id);
  };

  var showBottomNav = screen !== 'game';

  return (
    <div className="app-root" data-theme={theme}>
      <div className="phone-shell">
        {screen === 'home' && React.createElement(HomeScreen, { theme: theme, onPlay: startGame, onHowToPlay: function() { goHowTo('home'); } })}
        {screen === 'game' && React.createElement(GameScreen, { key: gameKey, theme: theme, onBack: function() { setScreen('home'); }, onHelp: function() { goHowTo('game'); }, onStats: function() { setScreen('leaderboard'); } })}
        {screen === 'howto' && React.createElement(HowToPlayScreen, { theme: theme, onBack: function() { setScreen(prevScreen || 'home'); } })}
        {screen === 'leaderboard' && React.createElement(LeaderboardScreen, { theme: theme })}
        {screen === 'settings' && React.createElement(SettingsScreen, { theme: theme, setTheme: saveTheme })}
        {showBottomNav && React.createElement(BottomNav, { screen: screen, onTab: handleTab, theme: theme })}
        {showNamePrompt && ID && React.createElement(ID.NamePrompt, {
          theme: theme, dismissible: true,
          onSave: function() { setShowNamePrompt(false); },
          onClose: function() { setShowNamePrompt(false); },
        })}
      </div>
    </div>
  );
}
window.YandlApp = App;
