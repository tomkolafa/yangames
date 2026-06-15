/* @ds-bundle: {"format":3,"namespace":"WordlingDesignSystem_ea77b4","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Board","sourcePath":"components/game/Board.jsx"},{"name":"Keyboard","sourcePath":"components/game/Keyboard.jsx"},{"name":"Tile","sourcePath":"components/game/Tile.jsx"}],"sourceHashes":{"Bend/BendApp.jsx":"13256766929a","Bend/BendHomeScreen.jsx":"17d3d4464b61","Bend/BendLeaderboardScreen.jsx":"9fa877ff50df","Bend/BendSettingsScreen.jsx":"d010f14a9bd7","Bend/RunnerScreen.jsx":"3ba7b9f74d07","Bend/game.js":"d0d73294a0bd","Yandl/HomeScreen.jsx":"b05cf164bce8","Yandl/HowToPlayScreen.jsx":"fcf4e4cebd0e","Yandl/LeaderboardScreen.jsx":"2d2bff282e28","Yandl/SettingsScreen.jsx":"7ffafee0d711","Yandl/YandlApp.jsx":"1e3f27eb313a","Yandl/YandlGameScreen.jsx":"82ad9fc22770","Yandl/YandlIcons.jsx":"be61442f75da","Yandl/game.js":"f8040a347af3","components/core/Badge.jsx":"74037539577f","components/core/Button.jsx":"fbd2031ad266","components/core/Card.jsx":"e5c31be1b92d","components/core/IconButton.jsx":"31db34a8cd55","components/game/Board.jsx":"f4b9f1375ad3","components/game/Keyboard.jsx":"9b1340e98adb","components/game/Tile.jsx":"dea6cf2d2edd","ui_kits/wordling/App.jsx":"e0a44802e9d7","ui_kits/wordling/GameScreen.jsx":"361e3e2fe648","ui_kits/wordling/Icons.jsx":"487a1dd25eb9","ui_kits/wordling/MenuScreen.jsx":"d5a20c6693b6","ui_kits/wordling/RewardScreen.jsx":"dd7a6a075b74","ui_kits/wordling/game.js":"eef1de03d1c7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WordlingDesignSystem_ea77b4 = window.WordlingDesignSystem_ea77b4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// Bend/BendApp.jsx
try { (() => {
// BEND — App root: phone frame, nav, screen routing

var BEND_THEMES = [{
  id: 'classic',
  label: 'Classic'
}, {
  id: 'clean-light',
  label: 'Light'
}, {
  id: 'clean-dark',
  label: 'Dark'
}, {
  id: 'funky',
  label: 'Funky'
}];
function BendPhoneFrame({
  theme,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      height: 620,
      borderRadius: 46,
      padding: 11,
      flexShrink: 0,
      background: '#1c1a19',
      boxShadow: '0 32px 80px rgba(46,42,40,.30), inset 0 0 0 2px #38342f, 0 0 0 1px #0e0c0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: 36,
      overflow: 'hidden',
      background: 'var(--game-bg)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 22,
      background: '#1c1a19',
      borderRadius: 999
    }
  })), children));
}
function BendBottomNav({
  screen,
  onTab,
  theme
}) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var tabs = [{
    id: 'home',
    label: 'Home',
    icon: React.createElement('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, React.createElement('path', {
      d: 'M3 12L12 3l9 9'
    }), React.createElement('path', {
      d: 'M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9'
    }))
  }, {
    id: 'game',
    label: 'Play',
    icon: React.createElement('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      stroke: 'none'
    }, React.createElement('path', {
      d: 'M6 4l15 8-15 8V4z'
    }))
  }, {
    id: 'leaderboard',
    label: 'Board',
    icon: React.createElement('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, React.createElement('rect', {
      x: 2,
      y: 14,
      width: 5,
      height: 8,
      rx: 1
    }), React.createElement('rect', {
      x: 9.5,
      y: 6,
      width: 5,
      height: 16,
      rx: 1
    }), React.createElement('rect', {
      x: 17,
      y: 10,
      width: 5,
      height: 12,
      rx: 1
    }))
  }, {
    id: 'settings',
    label: 'More',
    icon: React.createElement('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, React.createElement('circle', {
      cx: 12,
      cy: 12,
      r: 3
    }), React.createElement('path', {
      d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'
    }))
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 62,
      display: 'flex',
      flexShrink: 0,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.07)' : 'var(--hairline)'),
      background: 'var(--game-bg)'
    }
  }, tabs.map(function (tab) {
    var active = tab.id === screen;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: function () {
        onTab(tab.id);
      },
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: active ? 'var(--brand)' : dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: active ? 700 : 500,
        transition: 'color 120ms ease',
        position: 'relative',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20,
        lineHeight: 1
      }
    }, tab.icon), /*#__PURE__*/React.createElement("span", null, tab.label), active && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 3,
        borderRadius: '3px 3px 0 0',
        background: 'var(--brand)'
      }
    }));
  }));
}
function BendThemeSwitcher({
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 5,
      background: '#fff',
      borderRadius: 999,
      boxShadow: '0 8px 28px rgba(46,42,40,.14)'
    }
  }, BEND_THEMES.map(function (t) {
    var active = t.id === theme;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function () {
        setTheme(t.id);
      },
      style: {
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        padding: '8px 16px',
        borderRadius: 999,
        background: active ? 'var(--coral)' : 'transparent',
        color: active ? '#fff' : 'var(--ink-2)',
        transition: 'all 160ms cubic-bezier(.4,0,.2,1)'
      }
    }, t.label);
  }));
}
function BendApp() {
  var [screen, setScreen] = React.useState('home');
  var [theme, setTheme] = React.useState(function () {
    return localStorage.getItem('bend-theme') || 'clean-light';
  });
  var [charId, setCharId] = React.useState(function () {
    return localStorage.getItem('bend-char') || 'B';
  });
  var [gameKey, setGameKey] = React.useState(0);
  var saveTheme = function (t) {
    setTheme(t);
    localStorage.setItem('bend-theme', t);
  };
  var saveChar = function (c) {
    setCharId(c);
    localStorage.setItem('bend-char', c);
  };
  var startGame = function () {
    setScreen('game');
    setGameKey(function (k) {
      return k + 1;
    });
  };
  var handleTab = function (id) {
    if (id === 'game') {
      startGame();
      return;
    }
    setScreen(id);
  };
  var showNav = screen !== 'game';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: '24px 16px',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement(BendPhoneFrame, {
    theme: theme
  }, screen === 'home' && React.createElement(window.BendHomeScreen, {
    theme,
    charId,
    setCharId: saveChar,
    onPlay: startGame
  }), screen === 'game' && React.createElement(window.BendRunnerScreen, {
    key: gameKey,
    theme,
    charId,
    onBack: function () {
      setScreen('home');
    },
    onBoard: function () {
      setScreen('leaderboard');
    }
  }), screen === 'leaderboard' && React.createElement(window.BendLeaderboardScreen, {
    theme,
    charId
  }), screen === 'settings' && React.createElement(window.BendSettingsScreen, {
    theme,
    setTheme: saveTheme
  }), showNav && React.createElement(BendBottomNav, {
    screen,
    onTab: handleTab,
    theme
  })), /*#__PURE__*/React.createElement(BendThemeSwitcher, {
    theme: theme,
    setTheme: saveTheme
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 500,
      textAlign: 'center'
    }
  }, "Switch themes above \xB7 Pick your runner \xB7 Beat your high score"));
}
window.BendApp = BendApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/BendApp.jsx", error: String((e && e.message) || e) }); }

// Bend/BendHomeScreen.jsx
try { (() => {
// BEND — Home Screen with animated character selector

// Mini canvas preview — draws a character running in a card
function CharPreviewCanvas({
  charId,
  size
}) {
  var canvasRef = React.useRef(null);
  var rafRef = React.useRef(null);
  var frameRef = React.useRef(0);
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;

    // Draw immediately (sync) so preview is never blank
    function drawFrame(f) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(Math.round(size * 0.43), size - 8);
      try {
        window.BendGame.drawCharacter(ctx, charId, f, false);
      } catch (e) {
        console.error(e);
      }
      ctx.restore();
    }

    // First draw right away
    drawFrame(30);

    // Then animate
    function loop() {
      frameRef.current++;
      drawFrame(frameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return function () {
      cancelAnimationFrame(rafRef.current);
    };
  }, [charId, size]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    width: size,
    height: size,
    style: {
      display: 'block',
      pointerEvents: 'none',
      width: size + 'px',
      height: size + 'px'
    }
  });
}
function BendHomeScreen({
  theme,
  charId,
  setCharId,
  onPlay
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Button = DS.Button;
  var Game = window.BendGame;
  var dark = theme === 'clean-dark' || theme === 'funky';
  var hs = Game.loadHighScores();
  var stats = Game.loadStats();
  var globalHi = Game.getGlobalHi();
  var mutedColor = dark ? 'rgba(255,255,255,.5)' : 'var(--text-muted)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor = dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)';
  var stripBg = dark ? 'rgba(255,255,255,.07)' : 'var(--bg-sunken)';
  var LOGO_COLORS = ['#E8755C', '#F4D58D', '#8FD3B6', '#C7B6E8', '#F4B942', '#A8D8EA'];
  var LOGO_LETTERS = ['R', 'U', 'N', 'D', 'L', 'E'];
  var CHAR_COLOR = {
    B: '#F4B942',
    E: '#E8755C',
    N: '#4A4A4A',
    D: '#9B6B3A'
  };
  var CHAR_BG = {
    B: 'rgba(244,185,66,.13)',
    E: 'rgba(232,117,92,.13)',
    N: 'rgba(74,74,74,.13)',
    D: 'rgba(155,107,58,.13)'
  };
  var CHAR_LABEL = {
    B: 'B',
    E: 'E',
    N: 'N',
    D: 'D'
  };
  var selectedChar = Game.CHARACTERS.find(function (c) {
    return c.id === charId;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 14px',
      gap: 14,
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      overflowY: 'auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, LOGO_LETTERS.map(function (letter, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: letter,
      style: {
        width: 38,
        height: 38,
        borderRadius: 9,
        background: LOGO_COLORS[i],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 18,
        color: '#fff',
        boxShadow: '0 3px 0 rgba(0,0,0,.18)'
      }
    }, letter);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: mutedColor,
      marginBottom: 8,
      marginTop: 20
    }
  }, "Choose Your Runner"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, Game.CHARACTERS.map(function (char) {
    var active = charId === char.id;
    var cc = CHAR_COLOR[char.id];
    return /*#__PURE__*/React.createElement("button", {
      key: char.id,
      onClick: function () {
        setCharId(char.id);
      },
      style: {
        border: '2px solid ' + (active ? cc : dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)'),
        borderRadius: 14,
        background: active ? CHAR_BG[char.id] : dark ? 'rgba(255,255,255,.03)' : '#fff',
        cursor: 'pointer',
        padding: '6px 4px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        boxShadow: active ? '0 0 0 3px ' + cc + '28' : 'none',
        transition: 'all 150ms ease',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement(CharPreviewCanvas, {
      charId: char.id,
      size: 86
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: active ? cc : 'var(--game-text)',
        lineHeight: 1
      }
    }, char.name), hs[char.id] ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: mutedColor,
        marginTop: 1
      }
    }, "Best: ", hs[char.id]) : null);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: onPlay
  }, "Let's Rundle!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'transparent',
      borderRadius: 'var(--radius-lg)',
      padding: '6px 0',
      width: '100%',
      opacity: 0.5
    }
  }, [{
    val: globalHi > 0 ? String(globalHi).padStart(5, '0') : '—',
    label: 'Best Run'
  }, {
    val: hs[charId] ? String(hs[charId]).padStart(5, '0') : '—',
    label: charId + ' Best'
  }, {
    val: stats.games || 0,
    label: 'Total Runs'
  }].map(function (item, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: item.label
    }, i > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: divColor
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '0 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--game-text)',
        lineHeight: 1
      }
    }, item.val), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        fontWeight: 600,
        color: mutedColor,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginTop: 3
      }
    }, item.label)));
  })));
}
window.BendHomeScreen = BendHomeScreen;
window.CharPreviewCanvas = CharPreviewCanvas;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/BendHomeScreen.jsx", error: String((e && e.message) || e) }); }

// Bend/BendLeaderboardScreen.jsx
try { (() => {
// BEND — Leaderboard Screen

// Front-facing 2D portrait faces (head only, centered)
function CharFacePortrait({
  charId,
  size
}) {
  var canvasRef = React.useRef(null);
  var s = size || 40;
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var r = window.devicePixelRatio || 1;
    canvas.width = s * r;
    canvas.height = s * r;
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
      ctx.beginPath();
      ctx.ellipse(-18, 6, 9, 16, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(18, 6, 9, 16, 0.15, 0, Math.PI * 2);
      ctx.fill();
      // Ear inner
      ctx.fillStyle = '#C8882A';
      ctx.beginPath();
      ctx.ellipse(-17, 8, 5, 10, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(17, 8, 5, 10, 0.15, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#F0B030';
      ctx.beginPath();
      ctx.ellipse(0, -2, 20, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      // Forehead lighter
      ctx.fillStyle = '#F5C84E';
      ctx.beginPath();
      ctx.ellipse(0, -12, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Muzzle
      ctx.fillStyle = '#FBDB7A';
      ctx.beginPath();
      ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#3A2518';
      ctx.beginPath();
      ctx.arc(-8, -4, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -4, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-7, -5, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(9, -5, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Brows
      ctx.strokeStyle = '#D4952A';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-8, -7, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8, -7, 4, Math.PI + 0.3, -0.3);
      ctx.stroke();
      // Nose
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath();
      ctx.ellipse(0, 4, 4.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      ctx.strokeStyle = '#2E2A28';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 10);
      ctx.quadraticCurveTo(0, 14, 4, 10);
      ctx.stroke();
      // Tongue
      ctx.fillStyle = '#E8657C';
      ctx.beginPath();
      ctx.ellipse(0, 13, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath();
      ctx.ellipse(0, 12.5, 2, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (charId === 'E') {
      // Bambi — Yandl Cat front portrait
      // Ears (tall, pointy cat ears)
      ctx.fillStyle = '#C45A42';
      ctx.beginPath();
      ctx.moveTo(-12, -28);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-20, -10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(12, -28);
      ctx.lineTo(6, -10);
      ctx.lineTo(20, -10);
      ctx.closePath();
      ctx.fill();
      // Ear inner
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath();
      ctx.moveTo(-12, -25);
      ctx.lineTo(-8, -12);
      ctx.lineTo(-18, -12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(12, -25);
      ctx.lineTo(8, -12);
      ctx.lineTo(18, -12);
      ctx.closePath();
      ctx.fill();
      // Head
      ctx.fillStyle = '#E8755C';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Forehead stripes
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, -18);
      ctx.lineTo(-3, -8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -19);
      ctx.lineTo(0, -9);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, -18);
      ctx.lineTo(3, -8);
      ctx.stroke();
      // Muzzle
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath();
      ctx.ellipse(0, 7, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath();
      ctx.arc(-7, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-6, -4, 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -4, 1.1, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = '#E76A91';
      ctx.beginPath();
      ctx.ellipse(0, 4, 2.8, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      ctx.strokeStyle = '#C45A42';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3, 8);
      ctx.quadraticCurveTo(0, 11, 3, 8);
      ctx.stroke();
      // Whiskers
      ctx.strokeStyle = 'rgba(200,160,150,.6)';
      ctx.lineWidth = 1;
      [[-8, 6, -20, 3], [-8, 7, -20, 8], [8, 6, 20, 3], [8, 7, 20, 8]].forEach(function (w) {
        ctx.beginPath();
        ctx.moveTo(w[0], w[1]);
        ctx.lineTo(w[2], w[3]);
        ctx.stroke();
      });
    } else if (charId === 'N') {
      // Nene — King Charles Cavalier front portrait
      // Long silky ears (behind head)
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath();
      ctx.ellipse(-17, 6, 8, 18, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(17, 6, 8, 18, 0.08, 0, Math.PI * 2);
      ctx.fill();
      // Ear highlights
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath();
      ctx.ellipse(-16, 8, 4, 12, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(16, 8, 4, 12, 0.08, 0, Math.PI * 2);
      ctx.fill();
      // Head (round dome)
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(0, -2, 18, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Black cap on top
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath();
      ctx.arc(0, -3, 18, Math.PI + 0.15, -0.15);
      ctx.closePath();
      ctx.fill();
      // White blaze
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(0, -5, 5, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Lozenge spot
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath();
      ctx.ellipse(0, -16, 3, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Muzzle
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.ellipse(0, 8, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes (large, round, gentle)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-7, -2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(-7, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-6, -3, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -3, 1.4, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.ellipse(0, 6, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath();
      ctx.ellipse(-1, 5, 1.3, 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3, 10);
      ctx.quadraticCurveTo(0, 13, 3, 10);
      ctx.stroke();
    } else if (charId === 'D') {
      // Dede — Longhair Mini Dachshund front portrait
      // Long floppy ears
      ctx.fillStyle = '#6A4020';
      ctx.beginPath();
      ctx.ellipse(-15, 6, 7, 16, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(15, 6, 7, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#9B6B3A';
      ctx.beginPath();
      ctx.ellipse(0, -2, 17, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      // Darker top
      ctx.fillStyle = '#7A5028';
      ctx.beginPath();
      ctx.ellipse(0, -10, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      // Lighter muzzle area
      ctx.fillStyle = '#C8956A';
      ctx.beginPath();
      ctx.ellipse(0, 7, 10, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath();
      ctx.arc(-7, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-6, -4, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, -4, 0.9, 0, Math.PI * 2);
      ctx.fill();
      // Eyebrow dots
      ctx.fillStyle = '#C8956A';
      ctx.beginPath();
      ctx.arc(-6, -7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(6, -7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mouth
      ctx.strokeStyle = '#6A4020';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3, 8);
      ctx.quadraticCurveTo(0, 11, 3, 8);
      ctx.stroke();
    }
    ctx.restore();
  }, [charId, s]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      display: 'block',
      width: s + 'px',
      height: s + 'px',
      margin: '0 auto'
    }
  });
}
window.CharFacePortrait = CharFacePortrait;
function BendLeaderboardScreen({
  theme,
  charId
}) {
  var Game = window.BendGame;
  var dark = theme === 'clean-dark' || theme === 'funky';
  var hs = Game.loadHighScores();
  var stats = Game.loadStats();
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var CharPreview = window.CharPreviewCanvas;
  var CHAR_COLOR = {
    B: '#F4B942',
    E: '#E8755C',
    N: '#4A4A4A',
    D: '#9B6B3A'
  };
  var CHAR_EMOJI = {
    B: '🐕',
    E: '🐱',
    N: '👑',
    D: '🌭'
  };

  // Build global leaderboard, inject user's scores
  var fullLb = Game.LEADERBOARD.slice();
  Game.CHARACTERS.forEach(function (c) {
    if (hs[c.id]) {
      fullLb.push({
        name: 'You',
        emoji: CHAR_EMOJI[c.id],
        char: c.id,
        score: hs[c.id],
        isYou: true
      });
    }
  });
  fullLb.sort(function (a, b) {
    return b.score - a.score;
  });
  fullLb = fullLb.slice(0, 10);
  var globalHi = Game.getGlobalHi();
  var totalChars = Object.keys(hs).length;
  var MEDALS = ['🥇', '🥈', '🥉'];
  function SectionLabel({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: mutedColor,
        marginBottom: 8
      }
    }, children);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px 12px',
      flexShrink: 0,
      borderBottom: '1px solid ' + divColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: '0.05em'
    }
  }, "Leaderboard")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px 18px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Your Best Per Character"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, Game.CHARACTERS.map(function (char) {
    var score = hs[char.id];
    var active = char.id === charId;
    var cc = CHAR_COLOR[char.id];
    return /*#__PURE__*/React.createElement("div", {
      key: char.id,
      style: {
        background: active ? dark ? 'rgba(255,255,255,.09)' : 'var(--brand-tint)' : cardBg,
        border: '1px solid ' + (active ? cc : cardBorder),
        borderRadius: 12,
        padding: '12px 10px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(CharFacePortrait, {
      charId: char.id,
      size: 44
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: cc,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, char.name));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: cardBg,
      border: '1px solid ' + cardBorder,
      borderRadius: 14,
      padding: '14px 12px'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "Your Stats"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, [{
    val: stats.games || 0,
    label: 'Total Runs'
  }, {
    val: globalHi || '—',
    label: 'Best Score'
  }, {
    val: totalChars + ' / 4',
    label: 'Pets Used'
  }].map(function (item, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: item.label
    }, i > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: divColor
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: 'var(--game-text)',
        lineHeight: 1
      }
    }, item.val), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 600,
        color: mutedColor,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginTop: 4
      }
    }, item.label)));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Global Rankings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, fullLb.map(function (entry, i) {
    var isYou = entry.isYou;
    var entryChar = Game.CHARACTERS.find(function (c) {
      return c.id === entry.char;
    });
    var rankGlyph = i < 3 ? MEDALS[i] : '#' + (i + 1);
    var rankStyle = i === 0 ? {
      color: '#F4D58D',
      fontSize: 18
    } : i === 1 ? {
      color: '#C0C0C0',
      fontSize: 18
    } : i === 2 ? {
      color: '#CD7F32',
      fontSize: 18
    } : {
      color: mutedColor,
      fontSize: 12,
      fontFamily: 'var(--font-body)',
      fontWeight: 700
    };
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 10px',
        borderRadius: 10,
        background: isYou ? dark ? 'rgba(232,117,92,.17)' : 'var(--brand-tint)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        textAlign: 'center',
        flexShrink: 0,
        ...rankStyle
      }
    }, rankGlyph), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(CharFacePortrait, {
      charId: entry.char,
      size: 36
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: isYou ? 'var(--brand)' : 'var(--game-text)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, entry.name, isYou ? ' (You)' : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: mutedColor
      }
    }, entryChar ? entryChar.name : entry.char)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--game-text)',
        flexShrink: 0
      }
    }, String(entry.score).padStart(5, '0')));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? 'rgba(255,255,255,.05)' : 'var(--bg-sunken)',
      borderRadius: 12,
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: mutedColor,
      marginBottom: 6,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, "Tips"), ['🦴 Bone — jump clean over it', '🚒 Hydrant — jump early, it\'s tall', '🍍 Pineapple — spiky and mid-height', '🐿️ Squirrel — small but sneaky', '🌵 Cactus — wide, time it right', '🕊️ Seagull — flies at different heights'].map(function (tip) {
    return /*#__PURE__*/React.createElement("div", {
      key: tip,
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: bodyColor,
        lineHeight: 1.6
      }
    }, tip);
  }))));
}
window.BendLeaderboardScreen = BendLeaderboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/BendLeaderboardScreen.jsx", error: String((e && e.message) || e) }); }

// Bend/BendSettingsScreen.jsx
try { (() => {
// BEND — Settings Screen (mirrors Yandl's settings)
function BendSettingsScreen({
  theme,
  setTheme
}) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var [sound, setSound] = React.useState(function () {
    return localStorage.getItem('bend-sound') !== '0';
  });
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var saveSound = function (v) {
    setSound(v);
    localStorage.setItem('bend-sound', v ? '1' : '0');
  };
  function Toggle(props) {
    return React.createElement('div', {
      onClick: function () {
        props.onChange(!props.value);
      },
      style: {
        width: 46,
        height: 26,
        borderRadius: 999,
        flexShrink: 0,
        background: props.value ? 'var(--brand)' : dark ? 'rgba(255,255,255,.2)' : 'var(--ink-3)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 180ms ease',
        boxShadow: props.value ? '0 0 0 3px var(--brand-tint)' : 'none'
      }
    }, React.createElement('div', {
      style: {
        position: 'absolute',
        top: 3,
        left: props.value ? 23 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,.25)',
        transition: 'left 180ms var(--ease-bounce)'
      }
    }));
  }
  function Row(props) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: '1px solid ' + divColor,
        gap: 12
      }
    }, React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: 'var(--game-text)',
        lineHeight: 1.2
      }
    }, props.label), props.desc && React.createElement('div', {
      style: {
        fontSize: 12,
        color: mutedColor,
        marginTop: 3,
        lineHeight: 1.4
      }
    }, props.desc)), props.control);
  }
  function SectionLabel(props) {
    return React.createElement('div', {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: mutedColor,
        marginTop: 6,
        marginBottom: 2,
        paddingTop: 8
      }
    }, props.children);
  }
  var THEMES = [{
    id: 'clean-light',
    label: 'Light',
    dot: '#FBF7F0',
    border: '#E8755C',
    text: '#2E2A28'
  }, {
    id: 'clean-dark',
    label: 'Dark',
    dot: '#2B2A28',
    border: '#56C98A',
    text: '#F4F1EC'
  }, {
    id: 'classic',
    label: 'Classic',
    dot: '#FFFFFF',
    border: '#6AAA64',
    text: '#1A1A1B'
  }, {
    id: 'funky',
    label: 'Funky',
    dot: '#2C3A4B',
    border: '#F58BB0',
    text: '#FFFFFF'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 12px',
      flexShrink: 0,
      borderBottom: '1px solid ' + divColor
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 22
    }
  }, "Settings")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px 32px',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "Appearance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, THEMES.map(function (t) {
    var active = theme === t.id;
    return React.createElement('button', {
      key: t.id,
      onClick: function () {
        setTheme(t.id);
      },
      style: {
        border: '2px solid ' + (active ? t.border : divColor),
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        background: t.dot,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxShadow: active ? '0 0 0 3px ' + t.border + '40' : 'none'
      }
    }, React.createElement('div', {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: t.border
      }
    }), React.createElement('span', {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        color: t.text
      }
    }, t.label));
  })), /*#__PURE__*/React.createElement(SectionLabel, null, "Gameplay"), /*#__PURE__*/React.createElement(Row, {
    label: "Sound Effects",
    control: React.createElement(Toggle, {
      value: sound,
      onChange: saveSound
    })
  }), /*#__PURE__*/React.createElement(SectionLabel, null, "About"), /*#__PURE__*/React.createElement(Row, {
    label: "Rundle",
    desc: "An endless runner \u2014 dodge obstacles, beat your score",
    control: React.createElement('span', {
      style: {
        fontSize: 12,
        color: mutedColor,
        fontWeight: 600
      }
    }, 'v1.0')
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Built in \uD83C\uDDE8\uD83C\uDDE6",
    desc: "Arlington Ave labs.",
    control: React.createElement('span', {
      style: {
        fontSize: 18
      }
    }, '🐾')
  })));
}
window.BendSettingsScreen = BendSettingsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/BendSettingsScreen.jsx", error: String((e && e.message) || e) }); }

// Bend/RunnerScreen.jsx
try { (() => {
// BEND — Runner Game Screen (canvas-based endless runner)

function BendRunnerScreen({
  theme,
  charId,
  onBack,
  onBoard
}) {
  var canvasRef = React.useRef(null);
  var stateRef = React.useRef(null);
  var rafRef = React.useRef(null);
  var phaseRef = React.useRef('idle');
  var initFnRef = React.useRef(null);
  var hiRef = React.useRef(window.BendGame.loadHighScores()[charId] || 0);
  var Game = window.BendGame;
  var [phase, setPhase] = React.useState('idle');
  var [finalScore, setFinalScore] = React.useState(0);
  var [hiScore, setHiScore] = React.useState(hiRef.current);
  var [isNewRecord, setIsNewRecord] = React.useState(false);
  var dark = theme === 'clean-dark' || theme === 'funky';
  var CHAR_CLR = {
    B: '#F4B942',
    E: '#E8755C',
    N: '#4A4A4A',
    D: '#9B6B3A'
  };
  var charColor = CHAR_CLR[charId] || '#E8755C';
  var tbColor = dark ? 'rgba(255,255,255,.82)' : 'var(--text-body)';

  // ── Start / restart game ──────────────────────────────────────────
  function startGame() {
    if (initFnRef.current) stateRef.current = initFnRef.current();
    phaseRef.current = 'playing';
    setPhase('playing');
    setFinalScore(0);
    setIsNewRecord(false);
  }

  // ── Jump ─────────────────────────────────────────────────────────
  function doJump() {
    var s = stateRef.current;
    if (!s || phaseRef.current !== 'playing') return;
    if (s.charY >= -2) {
      s.charVY = s.JUMP_VY;
      s.jumping = true;
    }
  }

  // ── Keyboard input ────────────────────────────────────────────────
  React.useEffect(function () {
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (phaseRef.current === 'idle') {
          startGame();
          return;
        }
        if (phaseRef.current === 'dead') {
          startGame();
          return;
        }
        doJump();
      }
    }
    window.addEventListener('keydown', onKey);
    return function () {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // ── Canvas tap ────────────────────────────────────────────────────
  function handleTap() {
    if (phaseRef.current === 'idle') {
      startGame();
      return;
    }
    if (phaseRef.current === 'dead') {
      startGame();
      return;
    }
    doJump();
  }

  // ── Main effect: canvas resize + game loop ─────────────────────────
  React.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return;

    // Reset state on remount / theme-change
    phaseRef.current = 'idle';
    setPhase('idle');

    // Measure container (phone frame inner area)
    var container = canvas.parentElement;
    var W = Math.floor(container.offsetWidth) || 320;
    var H = Math.floor(container.offsetHeight) || 500;
    canvas.width = W;
    canvas.height = H;
    var GW = W;
    var GH = H;
    var GROUND_Y = Math.round(GH * 0.60);
    var CHAR_X = Math.round(GW * 0.19);
    var GRAVITY = 0.60;
    var JUMP_VY = -14;

    // ── Create initial game state ─────────────────────────────────
    function makeState() {
      return {
        charY: 0,
        charVY: 0,
        jumping: false,
        obstacles: [],
        clouds: [{
          x: GW * 0.22,
          y: GH * 0.09,
          w: 62
        }, {
          x: GW * 0.62,
          y: GH * 0.06,
          w: 48
        }, {
          x: GW * 0.88,
          y: GH * 0.13,
          w: 38
        }],
        score: 0,
        speed: 5,
        frame: 0,
        spawnTimer: 0,
        nextSpawn: 70,
        JUMP_VY: JUMP_VY
      };
    }
    initFnRef.current = makeState;
    stateRef.current = makeState();

    // ── Theme palette ─────────────────────────────────────────────
    var skyTop, skyBot, gndFill, gndLine, gndDash, scoreCol, cloudCol;
    if (theme === 'clean-dark') {
      skyTop = '#1A1918';
      skyBot = '#2B2A28';
      gndFill = '#3A3633';
      gndLine = '#4A4744';
      gndDash = '#2D2B29';
      scoreCol = 'rgba(255,255,255,.65)';
      cloudCol = 'rgba(255,255,255,.06)';
    } else if (theme === 'funky') {
      skyTop = '#1A2535';
      skyBot = '#2C3A4B';
      gndFill = '#374958';
      gndLine = '#4A6070';
      gndDash = '#2E3C4A';
      scoreCol = 'rgba(255,255,255,.7)';
      cloudCol = 'rgba(255,255,255,.07)';
    } else if (theme === 'classic') {
      skyTop = '#EDEDED';
      skyBot = '#F8F8F8';
      gndFill = '#DCDCDC';
      gndLine = '#B2B2B2';
      gndDash = '#CACACA';
      scoreCol = '#787C7E';
      cloudCol = 'rgba(255,255,255,.9)';
    } else {
      skyTop = '#C6E6FF';
      skyBot = '#EEF7FF';
      gndFill = '#E8D4A8';
      gndLine = '#C8A87A';
      gndDash = '#D6C090';
      scoreCol = '#9B9085';
      cloudCol = 'rgba(255,255,255,.95)';
    }

    // ── Render frame ─────────────────────────────────────────────
    function render(s) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, GW, GH);

      // Sky gradient
      var sg = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sg.addColorStop(0, skyTop);
      sg.addColorStop(1, skyBot);
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, GW, GROUND_Y);

      // Clouds
      ctx.fillStyle = cloudCol;
      s.clouds.forEach(function (c) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.w * 0.38, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.32, c.y - c.w * 0.13, c.w * 0.26, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.62, c.y, c.w * 0.30, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground fill
      ctx.fillStyle = gndFill;
      ctx.fillRect(0, GROUND_Y, GW, GH - GROUND_Y);
      // Ground line
      ctx.fillStyle = gndLine;
      ctx.fillRect(0, GROUND_Y, GW, 3);
      // Scrolling dashes
      ctx.fillStyle = gndDash;
      var dOff = s.frame * s.speed * 0.55 % 34;
      for (var dx = -dOff; dx < GW; dx += 34) {
        ctx.fillRect(dx, GROUND_Y + 11, 22, 4);
      }

      // Obstacles
      s.obstacles.forEach(function (ob) {
        if (ob.type === 'bone') Game.drawBone(ctx, ob.x, GROUND_Y);
        if (ob.type === 'hydrant') Game.drawHydrant(ctx, ob.x, GROUND_Y);
        if (ob.type === 'pineapple') Game.drawPineapple(ctx, ob.x, GROUND_Y);
        if (ob.type === 'seagull') Game.drawSeagull(ctx, ob.x, ob.birdY, s.frame);
        if (ob.type === 'squirrel') Game.drawSquirrel(ctx, ob.x, GROUND_Y);
        if (ob.type === 'cactus') Game.drawCactus(ctx, ob.x, GROUND_Y);
      });

      // Character
      ctx.save();
      ctx.translate(CHAR_X, GROUND_Y + s.charY);
      Game.drawCharacter(ctx, charId, s.frame, s.jumping || s.charY < -2);
      ctx.restore();

      // Score HUD
      var scoreStr = String(Math.floor(s.score)).padStart(5, '0');
      var hiStr = 'HI ' + String(hiRef.current).padStart(5, '0');
      ctx.fillStyle = scoreCol;
      ctx.font = 'bold 13px Nunito, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(hiStr + '    ' + scoreStr, GW - 10, 10);

      // Idle prompt
      if (phaseRef.current === 'idle') {
        ctx.fillStyle = dark ? 'rgba(255,255,255,.48)' : 'rgba(46,42,40,.40)';
        ctx.font = '700 14px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Tap or press SPACE to start', GW / 2, GROUND_Y - Math.round(GH * 0.14));
        var bob = Math.sin(Date.now() * 0.004) * 4;
        ctx.fillText('▲', GW / 2, GROUND_Y - Math.round(GH * 0.09) + bob);
      }
    }

    // ── Game loop ────────────────────────────────────────────────
    function loop() {
      var s = stateRef.current;
      if (!s) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Always tick frame for idle/dead animation
      s.frame++;
      if (phaseRef.current === 'playing') {
        // Physics
        s.charVY += GRAVITY;
        s.charY += s.charVY;
        if (s.charY >= 0) {
          s.charY = 0;
          s.charVY = 0;
          s.jumping = false;
        }

        // Speed ramp (caps at 13px/frame around score 3000)
        s.speed = Math.min(13, 5 + s.score * 0.0026);

        // Score
        s.score += s.speed * 0.05;

        // Clouds drift
        s.clouds.forEach(function (c) {
          c.x -= s.speed * 0.25;
        });
        s.clouds = s.clouds.filter(function (c) {
          return c.x > -110;
        });
        if (s.clouds.length < 4 && Math.random() < 0.007) {
          s.clouds.push({
            x: GW + 50,
            y: GH * 0.04 + Math.random() * GH * 0.18,
            w: 36 + Math.random() * 56
          });
        }

        // Obstacle spawning
        s.spawnTimer++;
        if (s.spawnTimer >= s.nextSpawn) {
          s.spawnTimer = 0;
          var gap = Math.max(42, 75 - s.score * 0.013);
          s.nextSpawn = gap + Math.random() * 40;
          var types = ['bone', 'bone', 'hydrant', 'pineapple', 'squirrel'];
          if (s.score > 150) types.push('cactus');
          if (s.score > 220) types.push('seagull');
          if (s.score > 600) types.push('seagull', 'cactus', 'squirrel');
          var t = types[Math.floor(Math.random() * types.length)];
          var ob = {
            type: t,
            x: GW + 30
          };
          if (t === 'seagull') ob.birdY = GROUND_Y - 72 - Math.random() * 52;
          s.obstacles.push(ob);
        }

        // Move obstacles left
        s.obstacles.forEach(function (ob) {
          ob.x -= s.speed;
        });
        s.obstacles = s.obstacles.filter(function (ob) {
          return ob.x > -90;
        });

        // ── Collision detection ───────────────────────────────────
        var hb = Game.getCharHitbox(charId);
        var cL = CHAR_X + hb.l;
        var cR = CHAR_X + hb.r;
        var cT = GROUND_Y + s.charY + hb.t;
        var cB = GROUND_Y + s.charY;
        var M = 5; // shrink both hitboxes by M pixels for fairness
        var hit = false;
        for (var i = 0; i < s.obstacles.length; i++) {
          var ob = s.obstacles[i];
          var ohb = Game.getObstacleHitbox(ob, GROUND_Y);
          if (cR - M > ohb.l + M && cL + M < ohb.r - M && cB - M > ohb.t + M && cT + M < ohb.b - M) {
            hit = true;
            break;
          }
        }
        if (hit) {
          var score = Math.floor(s.score);
          var prevHi = hiRef.current;
          Game.saveHighScore(charId, score);
          Game.recordGame();
          var newHi = Game.loadHighScores()[charId] || 0;
          var isRecord = newHi > prevHi && score > 0;
          hiRef.current = Math.max(prevHi, newHi);
          setHiScore(hiRef.current);
          setFinalScore(score);
          setIsNewRecord(isRecord);
          phaseRef.current = 'dead';
          setPhase('dead');
        }
      }
      render(s);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return function () {
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme, charId]);

  // ── Render UI ────────────────────────────────────────────────────
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px 12px',
      flexShrink: 0,
      borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      padding: '5px 8px',
      borderRadius: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      WebkitTapHighlightColor: 'transparent'
    }
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: '0.08em',
      color: charColor
    }
  }, "RUNDLE"), /*#__PURE__*/React.createElement("button", {
    onClick: onBoard,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      padding: '5px 8px',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
      WebkitTapHighlightColor: 'transparent'
    }
  }, "Scores")), /*#__PURE__*/React.createElement("div", {
    onClick: handleTap,
    style: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      cursor: phase === 'playing' ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }), phase === 'dead' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      background: dark ? 'rgba(0,0,0,.58)' : 'rgba(251,247,240,.80)',
      backdropFilter: 'blur(5px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 30,
      color: charColor,
      letterSpacing: '0.08em'
    }
  }, "GAME OVER"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      marginTop: 8,
      color: dark ? 'rgba(255,255,255,.92)' : 'var(--text-body)'
    }
  }, String(finalScore).padStart(5, '0')), isNewRecord && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: 700,
      color: '#F4D58D',
      animation: 'bend-bounce 0.9s ease-in-out infinite'
    }
  }, "\uD83C\uDFC5 New Record!"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: 600,
      color: dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)'
    }
  }, 'HI ' + String(hiScore).padStart(5, '0'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function (e) {
      e.stopPropagation();
      startGame();
    },
    style: {
      border: 'none',
      background: charColor,
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      padding: '12px 28px',
      borderRadius: 999,
      cursor: 'pointer',
      boxShadow: '0 4px 0 rgba(0,0,0,.22)',
      WebkitTapHighlightColor: 'transparent'
    }
  }, "Try Again"), /*#__PURE__*/React.createElement("button", {
    onClick: function (e) {
      e.stopPropagation();
      onBoard();
    },
    style: {
      border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
      background: 'transparent',
      color: dark ? 'rgba(255,255,255,.8)' : 'var(--text-body)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      padding: '12px 20px',
      borderRadius: 999,
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent'
    }
  }, "Scores")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: dark ? 'rgba(255,255,255,.3)' : 'var(--text-muted)',
      animation: 'bend-pulse 2s ease infinite'
    }
  }, "Tap anywhere or press SPACE to restart"))));
}
window.BendRunnerScreen = BendRunnerScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/RunnerScreen.jsx", error: String((e && e.message) || e) }); }

// Bend/game.js
try { (() => {
// BEND — Game engine: characters, canvas drawing, scoring, leaderboard
window.BendGame = function () {
  // ── CHARACTERS ─────────────────────────────────────────────────────
  var CHARACTERS = [{
    id: 'B',
    name: 'Bebe',
    species: 'Golden Retriever',
    color: '#F4B942'
  }, {
    id: 'E',
    name: 'Bambi',
    species: 'Yandl Cat',
    color: '#E8755C'
  }, {
    id: 'N',
    name: 'Nene',
    species: 'King Charles Cavalier',
    color: '#4A4A4A'
  }, {
    id: 'D',
    name: 'Dede',
    species: 'Longhair Mini Dachshund',
    color: '#9B6B3A'
  }];

  // ── HELPERS ─────────────────────────────────────────────────────────
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
  function leg(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // ── BUDDY — Golden Retriever ────────────────────────────────────────
  // Origin: (0,0) = foot position, y negative = upward
  function drawBuddy(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.18) * 7;
    var tw = j ? 6 : Math.sin(f * 0.13) * 12;
    ctx.save();
    // Feathered tail (long, flowing)
    ctx.strokeStyle = '#D4952A';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-15, -24);
    ctx.bezierCurveTo(-22, -34 + tw * 0.4, -28, -44 + tw * 0.6, -18, -54 + tw);
    ctx.stroke();
    // Tail fluff fringe
    ctx.strokeStyle = '#E8AA3A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, -38 + tw * 0.4);
    ctx.quadraticCurveTo(-26, -46 + tw * 0.5, -19, -52 + tw);
    ctx.stroke();
    // Body (broad, fluffy)
    ctx.fillStyle = '#F0B030';
    ctx.beginPath();
    ctx.ellipse(0, -22, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    // Back fur texture
    ctx.fillStyle = '#D4952A';
    ctx.beginPath();
    ctx.ellipse(-6, -26, 12, 6, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Chest fluff (thick, lighter golden)
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath();
    ctx.ellipse(12, -18, 10, 12, 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Neck ruff
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath();
    ctx.ellipse(10, -28, 8, 7, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Head (broader, rounder)
    ctx.fillStyle = '#F0B030';
    ctx.beginPath();
    ctx.arc(17, -37, 13, 0, Math.PI * 2);
    ctx.fill();
    // Forehead lighter
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath();
    ctx.ellipse(17, -42, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears (large, floppy, feathered — left ear only)
    ctx.fillStyle = '#D4952A';
    ctx.beginPath();
    ctx.ellipse(8, -30, 7, 13, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Ear inner highlight
    ctx.fillStyle = '#C8882A';
    ctx.beginPath();
    ctx.ellipse(9, -28, 4, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Muzzle (longer, golden retriever snout)
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath();
    ctx.ellipse(26, -34, 8, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#3A2518';
    ctx.beginPath();
    ctx.arc(21, -40, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(22, -41, 1.1, 0, Math.PI * 2);
    ctx.fill();
    // Eyebrow ridge
    ctx.strokeStyle = '#D4952A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(21, -42, 4, Math.PI + 0.3, Math.PI * 2 - 0.3);
    ctx.stroke();
    // Nose (big, dark)
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath();
    ctx.ellipse(33, -34, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Happy mouth
    ctx.strokeStyle = '#2E2A28';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(30, -32, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
    // Tongue (running, panting)
    if (!j) {
      ctx.fillStyle = '#E8657C';
      ctx.beginPath();
      ctx.ellipse(29, -29, 3, 4.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath();
      ctx.ellipse(29, -28, 2, 3, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    // Legs (feathered, golden)
    ctx.strokeStyle = '#F0B030';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -11, 14, -5);
      leg(ctx, 3, -11, -2, -5);
      leg(ctx, -7, -11, -4, -5);
      leg(ctx, -12, -11, -16, -5);
    } else {
      leg(ctx, 8, -11, 8 + sw, 0);
      leg(ctx, 3, -11, 3 - sw, 0);
      leg(ctx, -7, -11, -7 - sw, 0);
      leg(ctx, -12, -11, -12 + sw, 0);
    }
    // Leg feathering (back of legs)
    ctx.strokeStyle = '#FBDB7A';
    ctx.lineWidth = 2.5;
    if (!j) {
      ctx.beginPath();
      ctx.moveTo(6, -8);
      ctx.lineTo(6 + sw * 0.7, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-9, -8);
      ctx.lineTo(-9 - sw * 0.7, -2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── ELIO — Yandl Cat ────────────────────────────────────────────────
  function drawElio(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.2) * 7;
    ctx.save();
    // Tail
    ctx.strokeStyle = '#C45A42';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-15, -18);
    ctx.bezierCurveTo(-28, -30, -26, -46, -14 + Math.sin(f * 0.1) * 5, -52);
    ctx.stroke();
    // Body
    ctx.fillStyle = '#E8755C';
    ctx.beginPath();
    ctx.ellipse(0, -20, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // White stripes on body
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -28);
    ctx.lineTo(-4, -13);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -29);
    ctx.lineTo(2, -13);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -28);
    ctx.lineTo(8, -14);
    ctx.stroke();
    // Head
    ctx.fillStyle = '#E8755C';
    ctx.beginPath();
    ctx.arc(15, -34, 12, 0, Math.PI * 2);
    ctx.fill();
    // White stripes on head
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, -44);
    ctx.lineTo(13, -36);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(17, -45);
    ctx.lineTo(17, -37);
    ctx.stroke();
    // Ears (pointed)
    ctx.fillStyle = '#C45A42';
    ctx.beginPath();
    ctx.moveTo(8, -44);
    ctx.lineTo(13, -36);
    ctx.lineTo(17, -44);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(19, -45);
    ctx.lineTo(24, -36);
    ctx.lineTo(28, -43);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath();
    ctx.moveTo(9.5, -43);
    ctx.lineTo(13, -37);
    ctx.lineTo(15.5, -42);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20.5, -44);
    ctx.lineTo(23.5, -37);
    ctx.lineTo(26.5, -42);
    ctx.closePath();
    ctx.fill();
    // Muzzle
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath();
    ctx.ellipse(21, -32, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E76A91';
    ctx.beginPath();
    ctx.arc(21, -33, 2, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath();
    ctx.arc(17, -38, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(18, -39, 1, 0, Math.PI * 2);
    ctx.fill();
    // Whiskers
    ctx.strokeStyle = 'rgba(200,160,150,.65)';
    ctx.lineWidth = 1;
    [[15, -32, 7, -30], [15, -31, 7, -32], [27, -32, 35, -30], [27, -31, 35, -32]].forEach(function (w) {
      ctx.beginPath();
      ctx.moveTo(w[0], w[1]);
      ctx.lineTo(w[2], w[3]);
      ctx.stroke();
    });
    // Legs
    ctx.strokeStyle = '#E8755C';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 7, -10, 13, -4);
      leg(ctx, 3, -10, -2, -4);
      leg(ctx, -6, -10, -3, -4);
      leg(ctx, -10, -10, -14, -4);
    } else {
      leg(ctx, 7, -10, 7 + sw, 0);
      leg(ctx, 3, -10, 3 - sw, 0);
      leg(ctx, -6, -10, -6 - sw, 0);
      leg(ctx, -10, -10, -10 + sw, 0);
    }
    ctx.restore();
  }

  // ── NOBLE — King Charles Cavalier ──────────────────────────────────
  function drawNoble(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.16) * 6;
    var tw = j ? 4 : Math.sin(f * 0.14) * 10;
    ctx.save();
    // Feathered tail (high, wagging)
    ctx.strokeStyle = '#2E2E2E';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, -22);
    ctx.bezierCurveTo(-20, -34 + tw * 0.4, -26, -42 + tw * 0.5, -16, -50 + tw);
    ctx.stroke();
    // Tail feathering
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -36 + tw * 0.4);
    ctx.quadraticCurveTo(-24, -44 + tw * 0.5, -17, -48 + tw);
    ctx.stroke();
    // Body (compact, slightly rounded)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath();
    ctx.ellipse(-1, -21, 18, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    // White chest bib (large, prominent)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(9, -18, 11, 13, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Chest feathering detail
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.ellipse(12, -16, 6, 8, 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Neck ruff
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(11, -28, 9, 7, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Head (round dome — signature Cavalier)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.arc(18, -37, 12, 0, Math.PI * 2);
    ctx.fill();
    // Black cap/markings on top of head
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath();
    ctx.arc(18, -38, 12, Math.PI + 0.2, -0.2);
    ctx.closePath();
    ctx.fill();
    // White blaze down center (signature marking)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(18, -39, 4, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lozenge spot on top of head (breed hallmark)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath();
    ctx.ellipse(18, -46, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Long silky ear (near side — extra long, feathered)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath();
    ctx.ellipse(7, -26, 7, 18, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Ear silk highlights
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath();
    ctx.ellipse(8, -24, 3.5, 12, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Ear wave detail
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(5, -18);
    ctx.quadraticCurveTo(3, -14, 6, -10);
    ctx.stroke();
    // Flat muzzle (brachycephalic — short snout)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.ellipse(26, -33, 5.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose (prominent, dark, slightly upturned)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.ellipse(30, -34, 3, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose shine
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.beginPath();
    ctx.ellipse(29, -35, 1.3, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eyes (round, wide-set — signature gentle expression)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(21, -39, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(21, -39, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(22, -40, 1.3, 0, Math.PI * 2);
    ctx.fill();
    // Gentle brow
    ctx.strokeStyle = '#2E2E2E';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(21, -42, 3.5, Math.PI + 0.4, -0.4);
    ctx.stroke();
    // Tongue (panting)
    ctx.fillStyle = '#E8657C';
    ctx.beginPath();
    ctx.ellipse(27, -29, 2.5, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F08090';
    ctx.beginPath();
    ctx.ellipse(27, -28, 1.5, 2.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Legs (feathered, white)
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -9, 13, -3);
      leg(ctx, 4, -9, -1, -3);
      leg(ctx, -7, -9, -4, -3);
      leg(ctx, -11, -9, -15, -3);
    } else {
      leg(ctx, 8, -9, 8 + sw, 0);
      leg(ctx, 4, -9, 4 - sw, 0);
      leg(ctx, -7, -9, -7 - sw, 0);
      leg(ctx, -11, -9, -11 + sw, 0);
    }
    // Leg feathering
    ctx.strokeStyle = '#F0F0F0';
    ctx.lineWidth = 2;
    if (!j) {
      ctx.beginPath();
      ctx.moveTo(6, -6);
      ctx.lineTo(6 + sw * 0.6, -1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-9, -6);
      ctx.lineTo(-9 - sw * 0.6, -1);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── DASH — Longhair Mini Dachshund ──────────────────────────────────
  function drawDash(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.28) * 5;
    var tw = j ? 3 : Math.sin(f * 0.18) * 6;
    ctx.save();
    // Tail
    ctx.strokeStyle = '#6A4020';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-22, -16);
    ctx.quadraticCurveTo(-30, -22 + tw, -26, -30 + tw);
    ctx.stroke();
    // Long body
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath();
    ctx.ellipse(0, -16, 24, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Dark saddle
    ctx.fillStyle = '#7A5028';
    ctx.beginPath();
    ctx.ellipse(-2, -16, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Belly (lighter)
    ctx.fillStyle = '#C8956A';
    ctx.beginPath();
    ctx.ellipse(6, -11, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head (smaller — dachshund proportion)
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath();
    ctx.arc(21, -25, 10, 0, Math.PI * 2);
    ctx.fill();
    // Long floppy ears
    ctx.fillStyle = '#6A4020';
    ctx.beginPath();
    ctx.ellipse(15, -18, 5.5, 12, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(25, -18, 5, 11, 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Long snout (dachshund characteristic)
    ctx.fillStyle = '#C8956A';
    ctx.beginPath();
    ctx.ellipse(28, -24, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath();
    ctx.ellipse(36, -24, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath();
    ctx.arc(23, -28, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(24, -29, 0.8, 0, Math.PI * 2);
    ctx.fill();
    // Short stubby legs (rapid scurry)
    ctx.strokeStyle = '#9B6B3A';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 12, -7, 15, -3);
      leg(ctx, 7, -7, 5, -3);
      leg(ctx, -8, -7, -6, -3);
      leg(ctx, -13, -7, -15, -3);
    } else {
      leg(ctx, 12, -7, 12 + sw, 0);
      leg(ctx, 7, -7, 7 - sw, 0);
      leg(ctx, -8, -7, -8 + sw, 0);
      leg(ctx, -13, -7, -13 - sw, 0);
    }
    ctx.restore();
  }

  // ── DISPATCH ────────────────────────────────────────────────────────
  function drawCharacter(ctx, id, frame, jumping) {
    switch (id) {
      case 'B':
        return drawBuddy(ctx, frame, jumping);
      case 'E':
        return drawElio(ctx, frame, jumping);
      case 'N':
        return drawNoble(ctx, frame, jumping);
      case 'D':
        return drawDash(ctx, frame, jumping);
    }
  }

  // ── OBSTACLES ────────────────────────────────────────────────────────
  function drawBone(ctx, x, gy) {
    ctx.save();
    ctx.translate(x, gy);
    ctx.fillStyle = '#F0E8D4';
    rrect(ctx, -18, -30, 36, 9, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-20, -34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-20, -22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,178,148,.4)';
    ctx.lineWidth = 1.5;
    rrect(ctx, -18, -30, 36, 9, 4);
    ctx.stroke();
    ctx.restore();
  }
  function drawHydrant(ctx, x, gy) {
    ctx.save();
    ctx.translate(x, gy);
    ctx.fillStyle = '#E8755C';
    rrect(ctx, -11, -52, 22, 42, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -52, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#C45A42';
    ctx.beginPath();
    ctx.arc(0, -63, 8, 0, Math.PI * 2);
    ctx.fill();
    rrect(ctx, -19, -40, 9, 7, 3);
    ctx.fill();
    rrect(ctx, 10, -40, 9, 7, 3);
    ctx.fill();
    rrect(ctx, -14, -12, 28, 12, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath();
    ctx.arc(-3, -38, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawPineapple(ctx, x, gy) {
    ctx.save();
    ctx.translate(x, gy);
    // Leaves (crown)
    ctx.fillStyle = '#5DAA3B';
    ctx.beginPath();
    ctx.moveTo(0, -58);
    ctx.lineTo(-5, -42);
    ctx.lineTo(5, -42);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, -54);
    ctx.lineTo(-12, -40);
    ctx.lineTo(-2, -40);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, -54);
    ctx.lineTo(2, -40);
    ctx.lineTo(12, -40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4A9030';
    ctx.beginPath();
    ctx.moveTo(-3, -50);
    ctx.lineTo(-9, -38);
    ctx.lineTo(0, -38);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, -50);
    ctx.lineTo(0, -38);
    ctx.lineTo(9, -38);
    ctx.closePath();
    ctx.fill();
    // Body (oval)
    ctx.fillStyle = '#F4B042';
    ctx.beginPath();
    ctx.ellipse(0, -22, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cross-hatch pattern
    ctx.strokeStyle = '#D4902A';
    ctx.lineWidth = 1.2;
    for (var dy = -36; dy < -4; dy += 7) {
      ctx.beginPath();
      ctx.moveTo(-12, dy);
      ctx.lineTo(12, dy);
      ctx.stroke();
    }
    for (var dx = -10; dx <= 10; dx += 7) {
      ctx.beginPath();
      ctx.moveTo(dx, -40);
      ctx.lineTo(dx, -4);
      ctx.stroke();
    }
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath();
    ctx.ellipse(-4, -26, 5, 10, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawSeagull(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x, y);
    var fl = Math.sin(frame * 0.25) * 0.55;
    // Wings
    ctx.fillStyle = '#D8D4CE';
    ctx.beginPath();
    ctx.ellipse(-11, fl * -11, 14, 5, fl, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(11, fl * -11, 14, 5, -fl, 0, Math.PI * 2);
    ctx.fill();
    // Wing tips (dark)
    ctx.fillStyle = '#4A4744';
    ctx.beginPath();
    ctx.ellipse(-22, fl * -13, 5, 3, fl + 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(22, fl * -13, 5, 3, -fl - 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = '#F5F3F0';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#F5F3F0';
    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(2, -11, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Beak (orange-yellow)
    ctx.fillStyle = '#E8A030';
    ctx.beginPath();
    ctx.moveTo(5, -11);
    ctx.lineTo(12, -10);
    ctx.lineTo(5, -8);
    ctx.closePath();
    ctx.fill();
    // Red spot on beak
    ctx.fillStyle = '#D04030';
    ctx.beginPath();
    ctx.arc(8, -9.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawSquirrel(ctx, x, gy) {
    ctx.save();
    ctx.translate(x, gy);
    // Bushy tail (big, curling up)
    ctx.fillStyle = '#B87840';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.bezierCurveTo(-18, -28, -22, -48, -8, -52);
    ctx.bezierCurveTo(4, -56, 2, -38, -4, -28);
    ctx.closePath();
    ctx.fill();
    // Tail highlight
    ctx.fillStyle = '#D09050';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.bezierCurveTo(-14, -30, -16, -44, -6, -48);
    ctx.bezierCurveTo(0, -50, 0, -38, -3, -28);
    ctx.closePath();
    ctx.fill();
    // Body
    ctx.fillStyle = '#A06830';
    ctx.beginPath();
    ctx.ellipse(0, -16, 10, 12, 0.15, 0, Math.PI * 2);
    ctx.fill();
    // White belly
    ctx.fillStyle = '#F0E0C8';
    ctx.beginPath();
    ctx.ellipse(3, -12, 6, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#A06830';
    ctx.beginPath();
    ctx.arc(10, -28, 8, 0, Math.PI * 2);
    ctx.fill();
    // Cheek
    ctx.fillStyle = '#F0E0C8';
    ctx.beginPath();
    ctx.ellipse(14, -26, 4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ear
    ctx.fillStyle = '#8A5820';
    ctx.beginPath();
    ctx.ellipse(6, -35, 3, 4.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(13, -30, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(13.8, -30.8, 0.8, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = '#3A2518';
    ctx.beginPath();
    ctx.ellipse(17, -27, 1.8, 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Front paws
    ctx.strokeStyle = '#A06830';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(6, -6);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, -6);
    ctx.lineTo(0, 0);
    ctx.stroke();
    // Back paws
    ctx.beginPath();
    ctx.moveTo(-5, -6);
    ctx.lineTo(-6, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-9, -7);
    ctx.lineTo(-11, 0);
    ctx.stroke();
    ctx.restore();
  }
  function drawCactus(ctx, x, gy) {
    ctx.save();
    ctx.translate(x, gy);
    // Main stem
    ctx.fillStyle = '#5DAA3B';
    rrect(ctx, -8, -48, 16, 48, 6);
    ctx.fill();
    // Left arm
    ctx.fillStyle = '#5DAA3B';
    rrect(ctx, -22, -40, 14, 10, 5);
    ctx.fill();
    rrect(ctx, -22, -40, 10, 22, 5);
    ctx.fill();
    // Right arm
    rrect(ctx, 8, -34, 14, 10, 5);
    ctx.fill();
    rrect(ctx, 12, -34, 10, 18, 5);
    ctx.fill();
    // Darker center lines
    ctx.strokeStyle = '#4A9030';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.lineTo(0, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-18, -34);
    ctx.lineTo(-18, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18, -28);
    ctx.lineTo(18, -18);
    ctx.stroke();
    // Spines (tiny)
    ctx.strokeStyle = '#7BC060';
    ctx.lineWidth = 1;
    [[-8, -42], [-8, -30], [8, -38], [8, -26], [-8, -18], [8, -14], [-22, -32], [18, -24]].forEach(function (p) {
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(p[0] + (p[0] < 0 ? -4 : 4), p[1] - 3);
      ctx.stroke();
    });
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.beginPath();
    ctx.ellipse(-3, -30, 3, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── HITBOXES ─────────────────────────────────────────────────────────
  var CHAR_HB = {
    B: {
      l: -8,
      r: 20,
      t: -42
    },
    E: {
      l: -5,
      r: 17,
      t: -40
    },
    N: {
      l: -9,
      r: 22,
      t: -44
    },
    D: {
      l: -8,
      r: 28,
      t: -30
    }
  };
  function getCharHitbox(id) {
    return CHAR_HB[id] || CHAR_HB.B;
  }
  function getObstacleHitbox(ob, gy) {
    if (ob.type === 'bone') return {
      l: ob.x - 14,
      r: ob.x + 14,
      t: gy - 38,
      b: gy
    };
    if (ob.type === 'hydrant') return {
      l: ob.x - 8,
      r: ob.x + 8,
      t: gy - 58,
      b: gy
    };
    if (ob.type === 'pineapple') return {
      l: ob.x - 10,
      r: ob.x + 10,
      t: gy - 52,
      b: gy
    };
    if (ob.type === 'seagull') return {
      l: ob.x - 14,
      r: ob.x + 14,
      t: ob.birdY - 9,
      b: ob.birdY + 9
    };
    if (ob.type === 'squirrel') return {
      l: ob.x - 8,
      r: ob.x + 14,
      t: gy - 34,
      b: gy
    };
    if (ob.type === 'cactus') return {
      l: ob.x - 18,
      r: ob.x + 18,
      t: gy - 46,
      b: gy
    };
    return {
      l: ob.x - 10,
      r: ob.x + 10,
      t: gy - 30,
      b: gy
    };
  }

  // ── SCORES & STATS ───────────────────────────────────────────────────
  function loadHighScores() {
    try {
      return JSON.parse(localStorage.getItem('bend-hi') || '{}');
    } catch (_) {
      return {};
    }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) {
      hs[id] = Math.floor(score);
      localStorage.setItem('bend-hi', JSON.stringify(hs));
    }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores());
    return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem('bend-stats') || '{}');
    } catch (_) {
      return {
        games: 0
      };
    }
  }
  function recordGame() {
    var s = loadStats();
    s.games = (s.games || 0) + 1;
    localStorage.setItem('bend-stats', JSON.stringify(s));
  }

  // ── LEADERBOARD ──────────────────────────────────────────────────────
  var LEADERBOARD = [{
    name: 'Luna',
    emoji: '🐱',
    char: 'E',
    score: 2840
  }, {
    name: 'Max',
    emoji: '🦴',
    char: 'B',
    score: 2210
  }, {
    name: 'Cleo',
    emoji: '👑',
    char: 'N',
    score: 1980
  }, {
    name: 'Zara',
    emoji: '🌭',
    char: 'D',
    score: 1750
  }, {
    name: 'Pip',
    emoji: '🐾',
    char: 'B',
    score: 1320
  }, {
    name: 'Mochi',
    emoji: '🎀',
    char: 'N',
    score: 1100
  }, {
    name: 'Oscar',
    emoji: '🐶',
    char: 'D',
    score: 890
  }, {
    name: 'Bella',
    emoji: '🌸',
    char: 'E',
    score: 740
  }];
  return {
    CHARACTERS,
    LEADERBOARD,
    drawCharacter,
    drawBone,
    drawHydrant,
    drawPineapple,
    drawSeagull,
    drawSquirrel,
    drawCactus,
    getCharHitbox,
    getObstacleHitbox,
    loadHighScores,
    saveHighScore,
    getGlobalHi,
    loadStats,
    recordGame
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "Bend/game.js", error: String((e && e.message) || e) }); }

// Yandl/HomeScreen.jsx
try { (() => {
// Yandl — Home Screen
function HomeScreen({
  onPlay,
  onHowToPlay,
  theme
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Button = DS.Button;
  var Badge = DS.Badge;
  var Game = window.YandlGame;
  var stats = Game.loadStats();
  var puzzleNum = Game.getPuzzleNumber();
  var todayDone = !!Game.loadTodayResult();
  var dark = theme === 'clean-dark' || theme === 'funky';
  var LOGO_COLORS = ['#E8755C', '#8FD3B6', '#F4D58D', '#C7B6E8', '#A7D3E8'];
  var LOGO_LETTERS = ['Y', 'A', 'N', 'D', 'L'];
  var winPct = stats.played > 0 ? Math.round(stats.wins / stats.played * 100) : 0;
  var mutedColor = dark ? 'rgba(255,255,255,.55)' : 'var(--text-muted)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor = dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)';
  var stripBg = dark ? 'rgba(255,255,255,.07)' : 'var(--bg-sunken)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '28px 24px 24px',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      textAlign: 'center',
      overflowY: 'auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, todayDone && /*#__PURE__*/React.createElement(Badge, {
    tone: "mint",
    variant: "solid"
  }, "Played \u2713")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/illustrations/cat.png",
    alt: "Yandl mascot",
    style: {
      width: 110,
      height: 'auto',
      filter: 'drop-shadow(0 8px 18px rgba(46,42,40,.2))',
      animation: 'yandl-dance 1.8s ease-in-out infinite',
      transformOrigin: 'bottom center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, LOGO_LETTERS.map(function (letter, i) {
    return React.createElement('div', {
      key: letter,
      style: {
        width: 46,
        height: 46,
        borderRadius: 10,
        background: LOGO_COLORS[i],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 22,
        color: '#fff',
        boxShadow: '0 3px 0 rgba(0,0,0,.15)'
      }
    }, letter);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: bodyColor,
      letterSpacing: '0.05em'
    }
  }, "Guess the word in 6 tries")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 0,
      background: stripBg,
      borderRadius: 'var(--radius-lg)',
      padding: '14px 0',
      width: '100%',
      maxWidth: 290,
      justifyContent: 'center'
    }
  }, [{
    val: stats.streak,
    label: 'Streak'
  }, {
    val: stats.played,
    label: 'Played'
  }, {
    val: winPct + '%',
    label: 'Win Rate'
  }, {
    val: stats.maxStreak,
    label: 'Best'
  }].map(function (item, i) {
    return React.createElement(React.Fragment, {
      key: item.label
    }, i > 0 && React.createElement('div', {
      style: {
        width: 1,
        background: divColor,
        margin: '0 4px'
      }
    }), React.createElement('div', {
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '0 2px'
      }
    }, React.createElement('div', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 26,
        color: 'var(--game-text)',
        lineHeight: 1
      }
    }, item.val), React.createElement('div', {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: mutedColor,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: 3
      }
    }, item.label)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: '100%',
      maxWidth: 290
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: onPlay
  }, todayDone ? 'See Today\'s Result' : 'Play Today\'s Yandl'), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    onClick: onHowToPlay,
    style: {
      color: bodyColor
    }
  }, "How to play")));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// Yandl/HowToPlayScreen.jsx
try { (() => {
// Yandl — How To Play Screen
function HowToPlayScreen({
  onBack,
  theme
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var dark = theme === 'clean-dark' || theme === 'funky';
  var tbColor = dark ? 'rgba(255,255,255,.85)' : 'var(--text-body)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  function ExTile(props) {
    var stateMap = {
      correct: {
        bg: 'var(--state-correct-bg)',
        color: 'var(--state-correct-text)'
      },
      present: {
        bg: 'var(--state-present-bg)',
        color: 'var(--state-present-text)'
      },
      absent: {
        bg: 'var(--state-absent-bg)',
        color: 'var(--state-absent-text)'
      },
      empty: {
        bg: 'var(--tile-empty-bg)',
        color: 'var(--tile-text)',
        border: '2px solid var(--tile-empty-border)'
      },
      filled: {
        bg: 'var(--tile-filled-bg)',
        color: 'var(--tile-text)',
        border: '2px solid var(--tile-filled-border)'
      }
    };
    var s = stateMap[props.state] || stateMap.empty;
    return React.createElement('div', {
      style: {
        width: 40,
        height: 40,
        borderRadius: 'var(--tile-radius)',
        background: s.bg,
        border: s.border || 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 17,
        color: s.color,
        textTransform: 'uppercase',
        boxShadow: 'var(--tile-shadow)'
      }
    }, props.letter);
  }
  function ExRow(props) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }
    }, ...props.children);
  }
  var exRows = [{
    tiles: [{
      letter: 'W',
      state: 'correct'
    }, {
      letter: 'E',
      state: 'filled'
    }, {
      letter: 'A',
      state: 'filled'
    }, {
      letter: 'R',
      state: 'filled'
    }, {
      letter: 'Y',
      state: 'filled'
    }],
    highlight: 0,
    color: 'var(--state-correct-bg)',
    text: 'W is in the word and in the correct spot.'
  }, {
    tiles: [{
      letter: 'P',
      state: 'filled'
    }, {
      letter: 'I',
      state: 'present'
    }, {
      letter: 'L',
      state: 'filled'
    }, {
      letter: 'O',
      state: 'filled'
    }, {
      letter: 'T',
      state: 'filled'
    }],
    highlight: 1,
    color: 'var(--state-present-bg)',
    text: 'I is in the word but in the wrong spot.'
  }, {
    tiles: [{
      letter: 'V',
      state: 'filled'
    }, {
      letter: 'A',
      state: 'filled'
    }, {
      letter: 'G',
      state: 'filled'
    }, {
      letter: 'U',
      state: 'absent'
    }, {
      letter: 'E',
      state: 'filled'
    }],
    highlight: 3,
    color: 'var(--state-absent-bg)',
    text: 'U is not in the word at all.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      overflowY: 'auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px 10px',
      borderBottom: '1px solid ' + divColor,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      padding: '6px 4px',
      borderRadius: 8,
      WebkitTapHighlightColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement(IconBack, {
    size: 20
  }), " Back"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 18,
      whiteSpace: 'nowrap'
    }
  }, "How to Play"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 600,
      color: bodyColor,
      lineHeight: 1.55,
      textAlign: 'center'
    }
  }, "Guess the ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--brand)'
    }
  }, "YANDL"), " in 6 tries.", /*#__PURE__*/React.createElement("br", null), "Each guess must be a 5-letter word."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid ' + divColor
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: mutedColor
    }
  }, "Examples"), exRows.map(function (row, ri) {
    return React.createElement('div', {
      key: ri,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        gap: 5
      }
    }, row.tiles.map(function (t, ti) {
      return React.createElement(ExTile, {
        key: ti,
        letter: t.letter,
        state: t.state
      });
    })), React.createElement('p', {
      style: {
        margin: 0,
        fontSize: 13.5,
        fontWeight: 500,
        color: bodyColor,
        lineHeight: 1.5
      }
    }, React.createElement('span', {
      style: {
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 3,
        background: row.color,
        verticalAlign: 'middle',
        marginRight: 6
      }
    }), row.text), ri < exRows.length - 1 && React.createElement('div', {
      style: {
        borderTop: '1px solid ' + divColor
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid ' + divColor
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? 'rgba(255,255,255,.06)' : 'var(--bg-sunken)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: bodyColor,
      lineHeight: 1.55,
      fontWeight: 500
    }
  }, "\uD83D\uDDD3 A new Yandl is available ", /*#__PURE__*/React.createElement("strong", null, "every day"), ". Come back tomorrow for the next puzzle!"))));
}
window.HowToPlayScreen = HowToPlayScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/HowToPlayScreen.jsx", error: String((e && e.message) || e) }); }

// Yandl/LeaderboardScreen.jsx
try { (() => {
// Yandl — Leaderboard Screen
function LeaderboardScreen({
  theme
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Badge = DS.Badge;
  var Game = window.YandlGame;
  var dark = theme === 'clean-dark' || theme === 'funky';
  var stats = Game.loadStats();
  var lb = Game.LEADERBOARD;
  var todayResult = Game.loadTodayResult();
  var puzzleNum = Game.getPuzzleNumber();
  var winPct = stats.played > 0 ? Math.round(stats.wins / stats.played * 100) : 0;
  var dist = Array.isArray(stats.dist) ? stats.dist : [0, 0, 0, 0, 0, 0];
  var maxDist = Math.max(1, ...dist);
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor = dark ? 'rgba(255,255,255,.75)' : 'var(--text-body)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var cardBg = dark ? 'rgba(255,255,255,.06)' : '#fff';
  var cardBorder = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';

  // Insert "You" if you played today
  var lbWithYou = lb.slice();
  if (todayResult && todayResult.guesses) {
    var myGuesses = todayResult.guesses.length;
    var insertIdx = lbWithYou.findIndex(function (e) {
      return e.guesses > myGuesses;
    });
    var youEntry = {
      name: 'You',
      emoji: '😺',
      guesses: myGuesses,
      time: '--:--',
      isYou: true
    };
    if (insertIdx === -1) lbWithYou.push(youEntry);else lbWithYou.splice(insertIdx, 0, youEntry);
  }
  function SectionLabel(props) {
    return React.createElement('div', {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: mutedColor,
        marginBottom: 10
      }
    }, props.children);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 12px',
      flexShrink: 0,
      borderBottom: '1px solid ' + divColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 22
    }
  }, "Leaderboard")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px 18px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Your Stats"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, [{
    val: stats.played,
    label: 'Played'
  }, {
    val: winPct + '%',
    label: 'Win Rate'
  }, {
    val: stats.streak,
    label: 'Current Streak',
    icon: '🔥'
  }, {
    val: stats.maxStreak,
    label: 'Best Streak',
    icon: '⭐'
  }].map(function (item) {
    return React.createElement('div', {
      key: item.label,
      style: {
        background: cardBg,
        border: '1px solid ' + cardBorder,
        borderRadius: 'var(--radius-md)',
        padding: '14px 12px',
        textAlign: 'center'
      }
    }, React.createElement('div', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 30,
        color: 'var(--game-text)',
        lineHeight: 1
      }
    }, item.icon === '🔥' ? React.createElement(React.Fragment, null, React.createElement('span', {
      style: {
        display: 'inline-block',
        animation: 'yandl-fire 2.8s ease-in-out infinite',
        transformOrigin: 'bottom center'
      }
    }, '🔥'), ' ' + item.val) : item.icon ? item.icon + ' ' + item.val : item.val), React.createElement('div', {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: mutedColor,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginTop: 4
      }
    }, item.label));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Guess Distribution"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, dist.map(function (count, i) {
    var pct = Math.max(8, Math.round(count / maxDist * 100));
    var isLast = todayResult && todayResult.guesses && todayResult.guesses.length === i + 1;
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement('div', {
      style: {
        width: 16,
        textAlign: 'right',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        color: bodyColor,
        flexShrink: 0
      }
    }, i + 1), React.createElement('div', {
      style: {
        flex: 1,
        height: 26,
        background: dark ? 'rgba(255,255,255,.08)' : 'var(--bg-sunken)',
        borderRadius: 6,
        overflow: 'hidden'
      }
    }, React.createElement('div', {
      style: {
        width: pct + '%',
        height: '100%',
        background: isLast ? 'var(--accent-success)' : 'var(--brand)',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 8,
        transition: 'width 0.5s var(--ease-soft)'
      }
    }, React.createElement('span', {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: '#fff'
      }
    }, count || ''))));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Today's Players"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, lbWithYou.map(function (entry, i) {
    var isYou = entry.isYou;
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        background: isYou ? dark ? 'rgba(232,117,92,.18)' : 'var(--brand-tint)' : 'transparent'
      }
    }, React.createElement('div', {
      style: {
        width: 20,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 12,
        color: mutedColor,
        textAlign: 'right',
        flexShrink: 0
      }
    }, '#' + (i + 1)), React.createElement('div', {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg-sunken)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0
      }
    }, entry.emoji), React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontWeight: 700,
        fontSize: 14,
        color: isYou ? 'var(--brand)' : 'var(--game-text)'
      }
    }, entry.name + (isYou ? ' (You)' : '')), React.createElement('div', {
      style: {
        fontSize: 12,
        color: mutedColor
      }
    }, entry.guesses + ' guess' + (entry.guesses === 1 ? '' : 'es'))), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12,
        color: mutedColor
      }
    }, entry.time));
  })))));
}
window.LeaderboardScreen = LeaderboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/LeaderboardScreen.jsx", error: String((e && e.message) || e) }); }

// Yandl/SettingsScreen.jsx
try { (() => {
// Yandl — Settings Screen
function SettingsScreen({
  theme,
  setTheme
}) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var [hardMode, setHardMode] = React.useState(function () {
    return localStorage.getItem('yandl-hard') === '1';
  });
  var [colorBlind, setColorBlind] = React.useState(function () {
    return localStorage.getItem('yandl-colorblind') === '1';
  });
  var [sound, setSound] = React.useState(function () {
    return localStorage.getItem('yandl-sound') !== '0';
  });
  var mutedColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-muted)';
  var bodyColor = dark ? 'rgba(255,255,255,.8)' : 'var(--text-body)';
  var divColor = dark ? 'rgba(255,255,255,.08)' : 'var(--hairline)';
  var saveHard = function (v) {
    setHardMode(v);
    localStorage.setItem('yandl-hard', v ? '1' : '0');
  };
  var saveBlind = function (v) {
    setColorBlind(v);
    localStorage.setItem('yandl-colorblind', v ? '1' : '0');
  };
  var saveSound = function (v) {
    setSound(v);
    localStorage.setItem('yandl-sound', v ? '1' : '0');
  };
  function Toggle(props) {
    return React.createElement('div', {
      onClick: function () {
        props.onChange(!props.value);
      },
      style: {
        width: 46,
        height: 26,
        borderRadius: 999,
        flexShrink: 0,
        background: props.value ? 'var(--brand)' : dark ? 'rgba(255,255,255,.2)' : 'var(--ink-3)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 180ms ease',
        boxShadow: props.value ? '0 0 0 3px var(--brand-tint)' : 'none'
      }
    }, React.createElement('div', {
      style: {
        position: 'absolute',
        top: 3,
        left: props.value ? 23 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,.25)',
        transition: 'left 180ms var(--ease-bounce)'
      }
    }));
  }
  function Row(props) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: '1px solid ' + divColor,
        gap: 12
      }
    }, React.createElement('div', {
      style: {
        flex: 1
      }
    }, React.createElement('div', {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: 'var(--game-text)',
        lineHeight: 1.2
      }
    }, props.label), props.desc && React.createElement('div', {
      style: {
        fontSize: 12,
        color: mutedColor,
        marginTop: 3,
        lineHeight: 1.4
      }
    }, props.desc)), props.control);
  }
  function SectionLabel(props) {
    return React.createElement('div', {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: mutedColor,
        marginTop: 6,
        marginBottom: 2,
        paddingTop: 8
      }
    }, props.children);
  }
  var THEMES = [{
    id: 'clean-light',
    label: 'Light',
    dot: '#FBF7F0',
    border: '#E8755C',
    text: '#2E2A28'
  }, {
    id: 'clean-dark',
    label: 'Dark',
    dot: '#2B2A28',
    border: '#56C98A',
    text: '#F4F1EC'
  }, {
    id: 'classic',
    label: 'Classic',
    dot: '#FFFFFF',
    border: '#6AAA64',
    text: '#1A1A1B'
  }, {
    id: 'funky',
    label: 'Funky',
    dot: '#2C3A4B',
    border: '#F58BB0',
    text: '#FFFFFF'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 12px',
      flexShrink: 0,
      borderBottom: '1px solid ' + divColor
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 22
    }
  }, "Settings")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px 32px',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "Appearance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, THEMES.map(function (t) {
    var active = theme === t.id;
    return React.createElement('button', {
      key: t.id,
      onClick: function () {
        setTheme(t.id);
      },
      style: {
        border: '2px solid ' + (active ? t.border : divColor),
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        background: t.dot,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxShadow: active ? '0 0 0 3px ' + t.border + '40' : 'none'
      }
    }, React.createElement('div', {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: t.border
      }
    }), React.createElement('span', {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        color: t.text
      }
    }, t.label));
  })), /*#__PURE__*/React.createElement(SectionLabel, null, "Gameplay"), /*#__PURE__*/React.createElement(Row, {
    label: "Hard Mode",
    desc: "Revealed hints must be used in subsequent guesses",
    control: React.createElement(Toggle, {
      value: hardMode,
      onChange: saveHard
    })
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Sound Effects",
    control: React.createElement(Toggle, {
      value: sound,
      onChange: saveSound
    })
  }), /*#__PURE__*/React.createElement(SectionLabel, null, "About"), /*#__PURE__*/React.createElement(Row, {
    label: "Yandl",
    desc: "A daily word puzzle \u2014 new word every day",
    control: React.createElement('span', {
      style: {
        fontSize: 12,
        color: mutedColor,
        fontWeight: 600
      }
    }, 'v1.0')
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Built in \uD83C\uDDE8\uD83C\uDDE6",
    desc: "Arlington Ave labs.",
    control: React.createElement('span', {
      style: {
        fontSize: 18
      }
    }, '🐱')
  })));
}
window.SettingsScreen = SettingsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// Yandl/YandlApp.jsx
try { (() => {
// Yandl — App root: phone frame, nav, screen routing

var THEMES_META = [{
  id: 'classic',
  label: 'Classic'
}, {
  id: 'clean-light',
  label: 'Light'
}, {
  id: 'clean-dark',
  label: 'Dark'
}, {
  id: 'funky',
  label: 'Funky'
}];
function PhoneFrame({
  theme,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      height: 740,
      borderRadius: 46,
      padding: 11,
      flexShrink: 0,
      background: '#1c1a19',
      boxShadow: '0 32px 80px rgba(46,42,40,.30), inset 0 0 0 2px #38342f, 0 0 0 1px #0e0c0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: 36,
      overflow: 'hidden',
      background: 'var(--game-bg)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      zIndex: 2,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 22,
      background: '#1c1a19',
      borderRadius: 999
    }
  })), children));
}
function BottomNav({
  screen,
  onTab,
  theme
}) {
  var dark = theme === 'clean-dark' || theme === 'funky';
  var activeTab = screen === 'howto' ? 'home' : screen;
  var tabs = [{
    id: 'home',
    Icon: window.IconHome,
    label: 'Home'
  }, {
    id: 'game',
    Icon: window.IconPlay,
    label: 'Play'
  }, {
    id: 'leaderboard',
    Icon: window.IconTrophy,
    label: 'Board'
  }, {
    id: 'settings',
    Icon: window.IconGear,
    label: 'More'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 62,
      display: 'flex',
      flexShrink: 0,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.07)' : 'var(--hairline)'),
      background: 'var(--game-bg)'
    }
  }, tabs.map(function (tab) {
    var active = tab.id === activeTab;
    return React.createElement('button', {
      key: tab.id,
      onClick: function () {
        onTab(tab.id);
      },
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: active ? 'var(--brand)' : dark ? 'rgba(255,255,255,.4)' : 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: active ? 700 : 500,
        WebkitTapHighlightColor: 'transparent',
        transition: 'color 120ms ease',
        position: 'relative'
      }
    }, React.createElement(tab.Icon, {
      size: 20
    }), React.createElement('span', null, tab.label), active && React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 3,
        borderRadius: '3px 3px 0 0',
        background: 'var(--brand)'
      }
    }));
  }));
}
function ThemeSwitcher({
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 5,
      background: '#fff',
      borderRadius: 999,
      boxShadow: '0 8px 28px rgba(46,42,40,.14)'
    }
  }, THEMES_META.map(function (t) {
    var active = t.id === theme;
    return React.createElement('button', {
      key: t.id,
      onClick: function () {
        setTheme(t.id);
      },
      style: {
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        padding: '8px 16px',
        borderRadius: 999,
        background: active ? 'var(--coral)' : 'transparent',
        color: active ? '#fff' : 'var(--ink-2)',
        transition: 'all 160ms cubic-bezier(.4,0,.2,1)'
      }
    }, t.label);
  }));
}
function App() {
  var [screen, setScreen] = React.useState('home');
  var [prevScreen, setPrevScreen] = React.useState('home');
  var [theme, setTheme] = React.useState(function () {
    return localStorage.getItem('yandl-theme') || 'clean-light';
  });
  var [gameKey, setGameKey] = React.useState(0);
  var saveTheme = function (t) {
    setTheme(t);
    localStorage.setItem('yandl-theme', t);
  };
  var startGame = function () {
    setScreen('game');
    // only bump gameKey if game was completed (so we don't lose in-progress state)
    var r = window.YandlGame.loadTodayResult();
    if (!r) setGameKey(function (k) {
      return k + 1;
    });
  };
  var goHowTo = function (from) {
    setPrevScreen(from || screen);
    setScreen('howto');
  };
  var handleTab = function (id) {
    if (id === 'game') {
      startGame();
      return;
    }
    setScreen(id);
  };
  var showBottomNav = screen !== 'game';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: '24px 16px',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement(PhoneFrame, {
    theme: theme
  }, screen === 'home' && React.createElement(HomeScreen, {
    theme: theme,
    onPlay: startGame,
    onHowToPlay: function () {
      goHowTo('home');
    }
  }), screen === 'game' && React.createElement(GameScreen, {
    key: gameKey,
    theme: theme,
    onBack: function () {
      setScreen('home');
    },
    onHelp: function () {
      goHowTo('game');
    },
    onStats: function () {
      setScreen('leaderboard');
    }
  }), screen === 'howto' && React.createElement(HowToPlayScreen, {
    theme: theme,
    onBack: function () {
      setScreen(prevScreen || 'home');
    }
  }), screen === 'leaderboard' && React.createElement(LeaderboardScreen, {
    theme: theme
  }), screen === 'settings' && React.createElement(SettingsScreen, {
    theme: theme,
    setTheme: saveTheme
  }), showBottomNav && React.createElement(BottomNav, {
    screen: screen,
    onTab: handleTab,
    theme: theme
  })), /*#__PURE__*/React.createElement(ThemeSwitcher, {
    theme: theme,
    setTheme: saveTheme
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, "Switch themes above \xB7 Play daily puzzles \xB7 Track your streak"));
}
window.YandlApp = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/YandlApp.jsx", error: String((e && e.message) || e) }); }

// Yandl/YandlGameScreen.jsx
try { (() => {
// Yandl — Game Screen
function GameScreen({
  theme,
  onBack,
  onHelp,
  onStats
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Board = DS.Board;
  var Keyboard = DS.Keyboard;
  var Game = window.YandlGame;
  var ANSWER = Game.getDailyWord();
  var dark = theme === 'clean-dark' || theme === 'funky';
  var tbColor = dark ? 'rgba(255,255,255,.85)' : 'var(--text-body)';

  // Restore or init state
  var saved = Game.loadTodayResult() || {};
  var [guesses, setGuesses] = React.useState(saved.guesses || []);
  var [current, setCurrent] = React.useState('');
  var [letterStates, setLetterStates] = React.useState(function () {
    return Game.computeLetterStates(saved.guesses || []);
  });
  var [status, setStatus] = React.useState(function () {
    return Game.determineStatus(saved.guesses || []);
  });
  var [reveal, setReveal] = React.useState(false);
  var [invalidRow, setInvalidRow] = React.useState(-1);
  var [toast, setToast] = React.useState('');
  var [recorded, setRecorded] = React.useState(saved.recorded || false);
  var lockRef = React.useRef(false);

  // Record result once
  React.useEffect(function () {
    if ((status === 'won' || status === 'lost') && !recorded) {
      Game.recordResult(status === 'won', guesses.length);
      setRecorded(true);
      Game.saveTodayResult({
        guesses: guesses,
        recorded: true
      });
    }
  }, [status]);
  var showToast = function (m) {
    setToast(m);
    setTimeout(function () {
      setToast('');
    }, 1400);
  };
  var submit = React.useCallback(function () {
    if (current.length < 5) {
      setInvalidRow(guesses.length);
      showToast('Not enough letters');
      setTimeout(function () {
        setInvalidRow(-1);
      }, 500);
      return;
    }
    var letters = current.split('');
    var states = Game.evaluate(current, ANSWER);
    var newGuesses = guesses.concat([{
      letters: letters,
      states: states
    }]);
    setGuesses(newGuesses);
    setLetterStates(function (p) {
      return Game.mergeLetters(p, letters, states);
    });
    setCurrent('');
    setReveal(true);
    lockRef.current = true;
    setTimeout(function () {
      setReveal(false);
      lockRef.current = false;
    }, 1900);
    var newStatus = Game.determineStatus(newGuesses);
    if (newStatus !== 'playing') {
      setTimeout(function () {
        setStatus(newStatus);
      }, 1950);
    }
    Game.saveTodayResult({
      guesses: newGuesses,
      recorded: recorded
    });
  }, [current, guesses, recorded]);
  var onKey = React.useCallback(function (k) {
    if (lockRef.current || status !== 'playing') return;
    if (k === 'enter') submit();else if (k === 'back') setCurrent(function (c) {
      return c.slice(0, -1);
    });else if (/^[a-z]$/.test(k)) setCurrent(function (c) {
      return c.length < 5 ? c + k : c;
    });
  }, [submit, status]);
  React.useEffect(function () {
    var h = function (e) {
      if (e.key === 'Enter') onKey('enter');else if (e.key === 'Backspace') onKey('back');else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', h);
    return function () {
      window.removeEventListener('keydown', h);
    };
  }, [onKey]);
  var isDone = status !== 'playing';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      flexShrink: 0,
      borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      padding: 8,
      borderRadius: 10,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(IconBack, {
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onHelp,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      padding: 8,
      borderRadius: 10,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(IconHelp, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 26
    }
  }, "Yandl"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onStats,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tbColor,
      padding: 8,
      borderRadius: 10,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(IconStats, {
    size: 20
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      minHeight: 0
    }
  }, toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: '50%',
      transform: 'translateX(-50%)',
      background: dark ? '#fff' : 'var(--ink)',
      color: dark ? 'var(--ink)' : '#fff',
      padding: '9px 18px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 13,
      fontWeight: 700,
      boxShadow: 'var(--shadow-md)',
      zIndex: 10,
      whiteSpace: 'nowrap'
    }
  }, toast), /*#__PURE__*/React.createElement(Board, {
    guesses: guesses,
    current: current,
    tileSize: 52,
    rainbow: theme === 'funky',
    reveal: reveal,
    invalidRow: invalidRow
  })), !isDone ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px 18px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Keyboard, {
    letterStates: letterStates,
    onKey: onKey
  })) : /*#__PURE__*/React.createElement(ResultPanel, {
    theme: theme,
    dark: dark,
    status: status,
    guesses: guesses,
    answer: ANSWER,
    onStats: onStats,
    onBack: onBack
  }));
}
function ResultPanel({
  theme,
  dark,
  status,
  guesses,
  answer,
  onStats,
  onBack
}) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Button = DS.Button;
  var won = status === 'won';
  var puzzleNum = window.YandlGame.getPuzzleNumber();
  var [copied, setCopied] = React.useState(false);
  var handleShare = function () {
    var text = window.YandlGame.buildShareText(guesses, puzzleNum);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        setCopied(true);
        setTimeout(function () {
          setCopied(false);
        }, 2000);
      });
    }
  };
  var bgGrad = won ? dark ? 'linear-gradient(160deg, rgba(91,196,138,.15) 0%, transparent 60%)' : 'linear-gradient(160deg, #e8fdf2 0%, var(--game-bg) 60%)' : dark ? 'rgba(255,255,255,.03)' : 'var(--bg-sunken)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '16px 20px 18px',
      background: bgGrad,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)'),
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: won ? 'var(--accent-success)' : 'var(--game-text)'
    }
  }, won ? '🎉 You got it!' : 'Better luck next time'), !won && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 13,
      color: dark ? 'rgba(255,255,255,.65)' : 'var(--text-body)',
      fontWeight: 600
    }
  }, "The word was ", /*#__PURE__*/React.createElement("strong", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--brand)'
    }
  }, answer)), won && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 13,
      color: dark ? 'rgba(255,255,255,.65)' : 'var(--text-body)',
      fontWeight: 600
    }
  }, "Solved in ", guesses.length, " ", guesses.length === 1 ? 'guess' : 'guesses')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      width: '100%',
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    fullWidth: true,
    onClick: handleShare,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(IconShare, {
    size: 16,
    style: {
      marginRight: 4
    }
  }), copied ? 'Copied!' : 'Share'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    fullWidth: true,
    onClick: onStats,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(IconStats, {
    size: 16,
    style: {
      marginRight: 4
    }
  }), "Stats")));
}
window.GameScreen = GameScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/YandlGameScreen.jsx", error: String((e && e.message) || e) }); }

// Yandl/YandlIcons.jsx
try { (() => {
// Yandl Icons — Lucide-style stroke icons
(function () {
  function mkSvg(childEls, vb) {
    return function (props) {
      var _props = props || {};
      var size = _props.size || 22;
      var rest = Object.assign({}, _props);
      delete rest.size;
      return React.createElement('svg', Object.assign({
        width: size,
        height: size,
        viewBox: vb || '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }, rest), ...childEls);
    };
  }
  var p = function (d) {
    return React.createElement('path', {
      key: d.slice(0, 8),
      d: d
    });
  };
  var ci = function (cx, cy, r) {
    return React.createElement('circle', {
      key: cx + '' + cy,
      cx: cx,
      cy: cy,
      r: r
    });
  };
  var li = function (x1, y1, x2, y2) {
    return React.createElement('line', {
      key: x1 + '-' + y1,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    });
  };
  var re = function (x, y, w, h, rx) {
    return React.createElement('rect', {
      key: x + '-' + y,
      x: x,
      y: y,
      width: w,
      height: h,
      rx: rx
    });
  };
  var IconHome = mkSvg([p('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'), p('M9 22V12h6v10')]);
  var IconPlay = mkSvg([re(3, 3, 7, 7, 1.5), re(14, 3, 7, 7, 1.5), re(3, 14, 7, 7, 1.5), re(14, 14, 7, 7, 1.5)]);
  var IconTrophy = mkSvg([p('M6 9H4.5a2.5 2.5 0 0 1 0-5H6'), p('M18 9h1.5a2.5 2.5 0 0 0 0-5H18'), p('M4 22h16'), p('M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'), p('M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'), p('M18 2H6v7a6 6 0 0 0 12 0V2z')]);
  var IconGear = mkSvg([ci(12, 12, 3), p('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z')]);
  var IconBack = mkSvg([p('m15 18-6-6 6-6')]);
  var IconClose = mkSvg([p('M18 6 6 18'), p('m6 6 12 12')]);
  var IconHelp = mkSvg([ci(12, 12, 10), p('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'), p('M12 17h.01')]);
  var IconShare = mkSvg([ci(18, 5, 3), ci(6, 12, 3), ci(18, 19, 3), li(8.59, 13.51, 15.42, 17.49), li(15.41, 6.51, 8.59, 10.49)]);
  var IconStats = mkSvg([p('M3 3v18h18'), p('M7 16v-5'), p('M12 16V8'), p('M17 16v-3')]);
  var IconCheck = mkSvg([p('M20 6 9 17l-5-5')]);
  var IconPaw = mkSvg([ci(11, 4, 1.5), ci(15, 3.5, 1.5), ci(7.5, 6.5, 1.5), ci(17.5, 7, 1.5), p('M12.7 9.5c-2.1-.9-4.6.3-5.5 2.8L6 16c-.6 2 .5 3.9 2.3 4.5s3.8-.1 4.7-2l.5-1.5.5 1.5c.9 2 3 2.7 4.7 2s2.9-2.5 2.3-4.5l-1.2-3.7c-.9-2.5-3.4-3.7-5.5-2.8z')]);
  Object.assign(window, {
    IconHome,
    IconPlay,
    IconTrophy,
    IconGear,
    IconBack,
    IconClose,
    IconHelp,
    IconShare,
    IconStats,
    IconCheck,
    IconPaw
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/YandlIcons.jsx", error: String((e && e.message) || e) }); }

// Yandl/game.js
try { (() => {
// Yandl — game engine, word bank, daily puzzle, stats
window.YandlGame = function () {
  const WORDS = ['brave', 'crane', 'flute', 'ghost', 'heart', 'ivory', 'joust', 'karma', 'lemon', 'magic', 'night', 'ocean', 'paint', 'queen', 'raven', 'shelf', 'tiger', 'union', 'voice', 'waltz', 'yacht', 'zesty', 'adobe', 'blaze', 'crisp', 'dwell', 'epoch', 'frost', 'globe', 'honey', 'input', 'knack', 'lucid', 'maple', 'noble', 'optic', 'prism', 'quiet', 'river', 'storm', 'talon', 'ultra', 'vapor', 'wrath', 'axiom', 'bliss', 'cedar', 'delta', 'elbow', 'flair', 'gloom', 'holly', 'irony', 'jewel', 'kudos', 'latch', 'mercy', 'ninja', 'orbit', 'pearl', 'quirk', 'rebel', 'shape', 'trove', 'unity', 'venom', 'worry', 'expel', 'yield', 'acorn', 'brisk', 'chunk', 'dwarf', 'ember', 'flint', 'grove', 'haste', 'ingot', 'jetty', 'knave', 'lunar', 'month', 'nymph', 'olive', 'plumb', 'rally', 'spine', 'thumb', 'usher', 'visor', 'witch', 'yearn', 'aloof', 'boxer', 'cloth', 'depot', 'envoy', 'finch', 'guava', 'hazel'];
  function getDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function getPuzzleNumber() {
    const start = new Date('2024-01-01T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.floor((now - start) / 86400000) + 1;
  }
  function getDailyWord() {
    const start = new Date('2024-01-01T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((now - start) / 86400000);
    return WORDS[(diff % WORDS.length + WORDS.length) % WORDS.length];
  }
  function evaluate(guess, answer) {
    const g = guess.toLowerCase().split('');
    const a = answer.toLowerCase().split('');
    const res = Array(a.length).fill('absent');
    const counts = {};
    a.forEach(c => counts[c] = (counts[c] || 0) + 1);
    g.forEach((c, i) => {
      if (c === a[i]) {
        res[i] = 'correct';
        counts[c]--;
      }
    });
    g.forEach((c, i) => {
      if (res[i] === 'correct') return;
      if (counts[c] > 0) {
        res[i] = 'present';
        counts[c]--;
      }
    });
    return res;
  }
  function mergeLetters(prev, letters, states) {
    const rank = {
      absent: 0,
      present: 1,
      correct: 2
    };
    const next = {
      ...prev
    };
    letters.forEach((c, i) => {
      const s = states[i];
      if (next[c] === undefined || rank[s] > rank[next[c]]) next[c] = s;
    });
    return next;
  }
  function computeLetterStates(guesses) {
    return guesses.reduce((acc, g) => mergeLetters(acc, g.letters, g.states), {});
  }
  function determineStatus(guesses) {
    if (!guesses.length) return 'playing';
    const last = guesses[guesses.length - 1];
    if (last.states.every(s => s === 'correct')) return 'won';
    if (guesses.length >= 6) return 'lost';
    return 'playing';
  }
  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem('yandl-stats') || 'null');
      if (s && typeof s === 'object') return s;
    } catch (_) {}
    return {
      played: 0,
      wins: 0,
      streak: 0,
      maxStreak: 0,
      dist: [0, 0, 0, 0, 0, 0]
    };
  }
  function recordResult(won, guessCount) {
    const stats = loadStats();
    stats.played = (stats.played || 0) + 1;
    if (won) {
      stats.wins = (stats.wins || 0) + 1;
      if (!Array.isArray(stats.dist)) stats.dist = [0, 0, 0, 0, 0, 0];
      stats.dist[Math.min(guessCount - 1, 5)]++;
      stats.streak = (stats.streak || 0) + 1;
      if (stats.streak > (stats.maxStreak || 0)) stats.maxStreak = stats.streak;
    } else {
      stats.streak = 0;
    }
    localStorage.setItem('yandl-stats', JSON.stringify(stats));
    return stats;
  }
  function loadTodayResult() {
    try {
      return JSON.parse(localStorage.getItem('yandl-day-' + getDateKey()) || 'null');
    } catch (_) {
      return null;
    }
  }
  function saveTodayResult(data) {
    localStorage.setItem('yandl-day-' + getDateKey(), JSON.stringify(data));
  }
  function buildShareText(guesses, puzzleNum) {
    const rows = guesses.map(g => g.states.map(s => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')).join('\n');
    return `Yandl #${puzzleNum} ${guesses.length}/6\n\n${rows}`;
  }
  const LEADERBOARD = [{
    name: 'Luna',
    emoji: '🐱',
    guesses: 2,
    time: '0:42'
  }, {
    name: 'Jasper',
    emoji: '🦊',
    guesses: 3,
    time: '1:14'
  }, {
    name: 'Nova',
    emoji: '🐨',
    guesses: 3,
    time: '1:55'
  }, {
    name: 'Mochi',
    emoji: '🐼',
    guesses: 4,
    time: '2:08'
  }, {
    name: 'Pixel',
    emoji: '🐧',
    guesses: 4,
    time: '2:50'
  }, {
    name: 'Cleo',
    emoji: '🦁',
    guesses: 5,
    time: '3:31'
  }, {
    name: 'Zara',
    emoji: '🐯',
    guesses: 5,
    time: '4:12'
  }, {
    name: 'Cosmo',
    emoji: '🐻',
    guesses: 6,
    time: '5:20'
  }];
  return {
    getDailyWord,
    getPuzzleNumber,
    getDateKey,
    evaluate,
    mergeLetters,
    computeLetterStates,
    determineStatus,
    loadStats,
    recordResult,
    loadTodayResult,
    saveTodayResult,
    buildShareText,
    LEADERBOARD
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "Yandl/game.js", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small rounded label / pill for streaks, counts, "New" flags.
 * tone selects a soft pastel; variant 'solid' or 'soft'.
 */
function Badge({
  children,
  tone = 'coral',
  variant = 'soft',
  style = {},
  ...rest
}) {
  const palette = {
    coral: ['#E8755C', 'var(--coral-soft)', 'var(--coral-deep)'],
    mint: ['#5AB98A', 'var(--mint-soft)', '#2E7A55'],
    lavender: ['#9B7FD4', 'var(--lavender-soft)', '#5E4A8C'],
    butter: ['#E0A93C', 'var(--butter-soft)', '#8A6510'],
    sky: ['#5C9FCB', 'var(--sky-soft)', '#2E6488'],
    blush: ['#E06B96', 'var(--blush-soft)', '#9C3B62'],
    neutral: ['#8A827B', 'var(--bg-sunken)', 'var(--ink-2)']
  };
  const [solidBg, softBg, softText] = palette[tone] || palette.coral;
  const styles = variant === 'solid' ? {
    background: solidBg,
    color: '#fff'
  } : {
    background: softBg,
    color: softText
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 12.5,
      lineHeight: 1,
      letterSpacing: '0.01em',
      padding: '5px 10px',
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...styles,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — friendly rounded pill button.
 * Variants: primary (brand coral), secondary (soft tint), ghost (text only).
 * Sizes: sm | md | lg. Press = gentle shrink.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: 14,
      padding: '8px 16px',
      minHeight: 36,
      gap: 6
    },
    md: {
      fontSize: 16,
      padding: '12px 22px',
      minHeight: 46,
      gap: 8
    },
    lg: {
      fontSize: 18,
      padding: '15px 28px',
      minHeight: 54,
      gap: 10
    }
  };
  const variants = {
    primary: {
      background: 'var(--brand)',
      color: 'var(--on-brand)',
      border: 'none',
      boxShadow: '0 4px 0 var(--brand-press), 0 6px 14px rgba(232,117,92,.30)'
    },
    secondary: {
      background: 'var(--brand-tint)',
      color: 'var(--brand-press)',
      border: 'none',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: 'none',
      boxShadow: 'none'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: s.fontSize,
      padding: s.padding,
      minHeight: s.minHeight,
      width: fullWidth ? '100%' : 'auto',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
      WebkitTapHighlightColor: 'transparent',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — soft raised surface with generous rounding.
 * elevation: 'flat' | 'sm' | 'md' | 'lg'. tone tints the surface.
 */
function Card({
  children,
  elevation = 'md',
  tone = 'card',
  pad = 'md',
  style = {},
  ...rest
}) {
  const shadows = {
    flat: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  const tones = {
    card: 'var(--surface-card)',
    paper: 'var(--bg-app)',
    sunken: 'var(--bg-sunken)',
    coral: 'var(--coral-soft)',
    mint: 'var(--mint-soft)',
    lavender: 'var(--lavender-soft)',
    butter: 'var(--butter-soft)',
    sky: 'var(--sky-soft)'
  };
  const pads = {
    none: 0,
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-8)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: tones[tone] || tones.card,
      borderRadius: 'var(--radius-lg)',
      boxShadow: shadows[elevation] || shadows.md,
      padding: pads[pad] ?? pads.md,
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square, soft-tinted control for toolbar icons
 * (menu, help, stats, settings). Pass a Lucide SVG (or any node) as children.
 * shape: 'rounded' (default) | 'circle'.
 */
function IconButton({
  children,
  label,
  size = 'md',
  shape = 'rounded',
  tone = 'soft',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 36,
    md: 44,
    lg: 52
  };
  const dim = sizes[size] || sizes.md;
  const tones = {
    soft: {
      background: 'var(--bg-sunken)',
      color: 'var(--text-body)'
    },
    plain: {
      background: 'transparent',
      color: 'var(--text-body)'
    },
    brand: {
      background: 'var(--brand-tint)',
      color: 'var(--brand-press)'
    }
  };
  const t = tones[tone] || tones.soft;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flex: '0 0 auto',
      border: 'none',
      borderRadius: shape === 'circle' ? '999px' : 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'transform var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
      WebkitTapHighlightColor: 'transparent',
      ...t,
      ...style
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/game/Keyboard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ROWS = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back']];

/**
 * Keyboard — on-screen QWERTY. Reskins via theme CSS variables.
 * letterStates: { [letter]: 'correct'|'present'|'absent' }
 * onKey(key): key is a single lowercase letter, 'enter', or 'back'.
 */
function Keyboard({
  letterStates = {},
  onKey = () => {},
  style = {},
  ...rest
}) {
  const keyBase = {
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    color: 'var(--key-text)',
    background: 'var(--key-bg)',
    borderRadius: 'var(--key-radius)',
    boxShadow: 'var(--key-shadow)',
    height: 54,
    textTransform: 'uppercase',
    transition: 'transform var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none'
  };
  function stateStyle(letter) {
    const st = letterStates[letter];
    if (!st) return {};
    if (st === 'correct') return {
      background: 'var(--key-correct-bg)',
      color: '#fff',
      boxShadow: 'var(--key-shadow)'
    };
    if (st === 'present') return {
      background: 'var(--key-present-bg)',
      color: '#fff',
      boxShadow: 'var(--key-shadow)'
    };
    if (st === 'absent') return {
      background: 'var(--key-absent-bg)',
      color: 'var(--key-absent-text)',
      boxShadow: 'none'
    };
    return {};
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      width: '100%',
      maxWidth: 500,
      ...style
    }
  }, rest), ROWS.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'center'
    }
  }, row.map(k => {
    const wide = k === 'enter' || k === 'back';
    const label = k === 'enter' ? 'Enter' : k === 'back' ? '⌫' : k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      "aria-label": k === 'back' ? 'Backspace' : k,
      onClick: () => onKey(k),
      onMouseDown: e => {
        e.currentTarget.style.transform = 'translateY(1px) scale(0.95)';
      },
      onMouseUp: e => {
        e.currentTarget.style.transform = 'none';
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = 'none';
      },
      style: {
        ...keyBase,
        ...stateStyle(k),
        flex: wide ? '1.5 1 0' : '1 1 0',
        minWidth: wide ? 48 : 28,
        fontSize: wide ? 12.5 : 16,
        letterSpacing: wide ? '0.02em' : 0
      }
    }, label);
  }))));
}
Object.assign(__ds_scope, { Keyboard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/Keyboard.jsx", error: String((e && e.message) || e) }); }

// components/game/Tile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tile — a single letter cell. Reskins via theme CSS variables.
 * state: 'empty' | 'tbd' (typed, unsubmitted) | 'absent' | 'present' | 'correct'
 * accent / accentText: optional bg/text override (used by the funky rainbow skin).
 * pop: brief scale when a letter is entered. reveal: flip-in for evaluated tiles.
 */
function Tile({
  letter = '',
  state = 'empty',
  size = 58,
  accent = null,
  accentText = null,
  pop = false,
  reveal = false,
  revealDelay = 0,
  style = {},
  ...rest
}) {
  const evaluated = state === 'absent' || state === 'present' || state === 'correct';
  let bg, border, color;
  if (state === 'empty') {
    bg = 'var(--tile-empty-bg)';
    border = '2px solid var(--tile-empty-border)';
    color = 'var(--tile-text)';
  } else if (state === 'tbd') {
    bg = 'var(--tile-filled-bg)';
    border = '2px solid var(--tile-filled-border)';
    color = 'var(--tile-text)';
  } else {
    bg = `var(--state-${state}-bg)`;
    border = '2px solid transparent';
    color = `var(--state-${state}-text)`;
  }
  if (accent && evaluated) {
    bg = accent;
    color = accentText || '#fff';
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      border,
      color,
      borderRadius: 'var(--tile-radius)',
      boxShadow: evaluated ? 'var(--tile-shadow)' : 'none',
      fontFamily: 'var(--font-tile)',
      fontWeight: 'var(--tile-weight)',
      fontSize: Math.round(size * 0.46),
      lineHeight: 1,
      textTransform: 'uppercase',
      userSelect: 'none',
      transition: 'background var(--dur-base) var(--ease-soft), border-color var(--dur-base) var(--ease-soft), transform var(--dur-fast) var(--ease-bounce)',
      animation: pop ? 'wl-pop 140ms var(--ease-bounce)' : reveal ? `wl-reveal 650ms var(--ease-soft) ${revealDelay}ms both` : 'none',
      ...style
    }
  }, rest), letter);
}
Object.assign(__ds_scope, { Tile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/Tile.jsx", error: String((e && e.message) || e) }); }

// components/game/Board.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FUNKY = ['var(--funky-1)', 'var(--funky-2)', 'var(--funky-3)', 'var(--funky-4)', 'var(--funky-5)', 'var(--funky-6)'];
const FUNKY_TEXT = ['#7A1F45', '#7A3B0A', '#4A3B05', '#15321F', '#143A5C', '#3A2566'];

/**
 * Board — the guess grid. Pure presentation.
 * guesses: Array<{ letters: string[], states: string[] }>  (submitted rows)
 * current: string (the row being typed)
 * rows / cols: grid shape (default 6 × 5)
 * rainbow: funky skin — evaluated tiles colored by column
 * reveal: animate the last submitted row flipping in
 */
function Board({
  guesses = [],
  current = '',
  rows = 6,
  cols = 5,
  tileSize = 58,
  rainbow = false,
  reveal = false,
  invalidRow = -1,
  style = {},
  ...rest
}) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const submitted = guesses[r];
    const isCurrent = r === guesses.length;
    const cells = [];
    for (let c = 0; c < cols; c++) {
      let letter = '',
        state = 'empty',
        accent = null,
        accentText = null;
      if (submitted) {
        letter = submitted.letters[c] || '';
        state = submitted.states[c] || 'absent';
        if (rainbow && state !== 'empty') {
          accent = FUNKY[c % FUNKY.length];
          accentText = FUNKY_TEXT[c % FUNKY_TEXT.length];
        }
      } else if (isCurrent) {
        letter = current[c] || '';
        state = letter ? 'tbd' : 'empty';
      }
      cells.push(/*#__PURE__*/React.createElement(__ds_scope.Tile, {
        key: c,
        letter: letter,
        state: state,
        size: tileSize,
        accent: accent,
        accentText: accentText,
        pop: isCurrent && letter && c === current.length - 1,
        reveal: reveal && r === guesses.length - 1,
        revealDelay: c * 300
      }));
    }
    grid.push(/*#__PURE__*/React.createElement("div", {
      key: r,
      style: {
        display: 'flex',
        gap: 'var(--tile-gap)',
        animation: r === invalidRow ? 'wl-shake 480ms var(--ease-soft)' : 'none'
      }
    }, cells));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--tile-gap)',
      ...style
    }
  }, rest), grid);
}
Object.assign(__ds_scope, { Board });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/Board.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/App.jsx
try { (() => {
// App — screen state machine + live theme switcher, inside a phone frame.
const THEMES = [{
  id: 'classic',
  label: 'Classic'
}, {
  id: 'clean-light',
  label: 'Light'
}, {
  id: 'clean-dark',
  label: 'Dark'
}, {
  id: 'funky',
  label: 'Funky'
}];
function ThemeSwitcher({
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 5,
      background: '#fff',
      borderRadius: 999,
      boxShadow: '0 8px 24px rgba(46,42,40,.14)'
    }
  }, THEMES.map(t => {
    const active = t.id === theme;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTheme(t.id),
      style: {
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 14,
        padding: '9px 16px',
        borderRadius: 999,
        background: active ? 'var(--coral)' : 'transparent',
        color: active ? '#fff' : 'var(--ink-2)',
        transition: 'all 160ms cubic-bezier(.4,0,.2,1)'
      }
    }, t.label);
  }));
}
function PhoneFrame({
  theme,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      height: 740,
      borderRadius: 46,
      padding: 11,
      background: '#1c1a19',
      boxShadow: '0 30px 70px rgba(46,42,40,.34), inset 0 0 0 2px #36322f'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: 36,
      overflow: 'hidden',
      background: 'var(--game-bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 22,
      background: '#1c1a19',
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      paddingTop: 30,
      boxSizing: 'border-box'
    }
  }, children)));
}
function App() {
  const [screen, setScreen] = React.useState('menu');
  const [theme, setTheme] = React.useState('clean-light');
  const [tries, setTries] = React.useState(0);
  const [gameKey, setGameKey] = React.useState(0);
  const startGame = () => {
    setGameKey(k => k + 1);
    setScreen('game');
  };
  const win = n => {
    setTries(n);
    setScreen('reward');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26,
      padding: '30px 16px',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement(PhoneFrame, {
    theme: theme
  }, screen === 'menu' && /*#__PURE__*/React.createElement(MenuScreen, {
    theme: theme,
    onPlay: startGame
  }), screen === 'game' && /*#__PURE__*/React.createElement(GameScreen, {
    key: gameKey,
    theme: theme,
    onExit: () => setScreen('menu'),
    onWin: win
  }), screen === 'reward' && /*#__PURE__*/React.createElement(RewardScreen, {
    theme: theme,
    tries: tries,
    onAgain: startGame,
    onMenu: () => setScreen('menu')
  })), /*#__PURE__*/React.createElement(ThemeSwitcher, {
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, "Tip: try the word ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-body)'
    }
  }, "SQUAD"), " \u2014 switch themes any time."));
}
window.WordlingApp = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/GameScreen.jsx
try { (() => {
// GameScreen — toolbar + board + keyboard + guess logic.
function GameScreen({
  theme,
  onExit,
  onWin
}) {
  const {
    Board,
    Keyboard,
    IconButton
  } = window.WordlingDesignSystem_ea77b4;
  const {
    evaluate,
    mergeLetters,
    ANSWER
  } = window.WordlingGame;
  const {
    IconMenu,
    IconHelp,
    IconStats,
    IconGear
  } = window;
  const [guesses, setGuesses] = React.useState([]);
  const [current, setCurrent] = React.useState('');
  const [letterStates, setLetterStates] = React.useState({});
  const [reveal, setReveal] = React.useState(false);
  const [invalidRow, setInvalidRow] = React.useState(-1);
  const [toast, setToast] = React.useState('');
  const lockRef = React.useRef(false);
  const dark = theme === 'clean-dark' || theme === 'funky';
  const showToast = m => {
    setToast(m);
    setTimeout(() => setToast(''), 1300);
  };
  const submit = React.useCallback(() => {
    if (current.length < 5) {
      setInvalidRow(guesses.length);
      showToast('Not enough letters');
      setTimeout(() => setInvalidRow(-1), 500);
      return;
    }
    const letters = current.split('');
    const states = evaluate(current, ANSWER);
    const newGuesses = [...guesses, {
      letters,
      states
    }];
    setGuesses(newGuesses);
    setLetterStates(p => mergeLetters(p, letters, states));
    setCurrent('');
    setReveal(true);
    lockRef.current = true;
    setTimeout(() => {
      setReveal(false);
      lockRef.current = false;
    }, 1100);
    if (current === ANSWER) {
      setTimeout(() => onWin(newGuesses.length), 1300);
    } else if (newGuesses.length >= 6) {
      setTimeout(() => showToast(ANSWER.toUpperCase()), 1200);
    }
  }, [current, guesses, onWin]);
  const onKey = React.useCallback(k => {
    if (lockRef.current) return;
    if (k === 'enter') submit();else if (k === 'back') setCurrent(c => c.slice(0, -1));else if (/^[a-z]$/.test(k)) setCurrent(c => c.length < 5 ? c + k : c);
  }, [submit]);
  React.useEffect(() => {
    const h = e => {
      if (e.key === 'Enter') onKey('enter');else if (e.key === 'Backspace') onKey('back');else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onKey]);
  const tbColor = dark ? 'rgba(255,255,255,.85)' : 'var(--text-body)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--game-bg)',
      color: 'var(--game-text)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px',
      borderBottom: theme === 'classic' ? '1px solid #e6e6e6' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Menu",
    tone: "plain",
    size: "sm",
    onClick: onExit,
    style: {
      color: tbColor
    }
  }, /*#__PURE__*/React.createElement(IconMenu, {
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "How to play",
    tone: "plain",
    size: "sm",
    style: {
      color: tbColor
    }
  }, /*#__PURE__*/React.createElement(IconHelp, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 26
    }
  }, "Wordling"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Stats",
    tone: "plain",
    size: "sm",
    style: {
      color: tbColor
    }
  }, /*#__PURE__*/React.createElement(IconStats, {
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Settings",
    tone: "plain",
    size: "sm",
    style: {
      color: tbColor
    }
  }, /*#__PURE__*/React.createElement(IconGear, {
    size: 20
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      left: '50%',
      transform: 'translateX(-50%)',
      background: dark ? '#fff' : 'var(--ink)',
      color: dark ? 'var(--ink)' : '#fff',
      padding: '9px 16px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 14,
      fontWeight: 700,
      boxShadow: 'var(--shadow-md)',
      zIndex: 5
    }
  }, toast), /*#__PURE__*/React.createElement(Board, {
    guesses: guesses,
    current: current,
    tileSize: 56,
    rainbow: theme === 'funky',
    reveal: reveal,
    invalidRow: invalidRow
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px 20px',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Keyboard, {
    letterStates: letterStates,
    onKey: onKey
  })));
}
window.GameScreen = GameScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/GameScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/Icons.jsx
try { (() => {
// Lucide-style stroke icons for the Wordling toolbar.
const _i = (paths, vb = '0 0 24 24') => props => React.createElement('svg', {
  width: props.size || 22,
  height: props.size || 22,
  viewBox: vb,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props
}, paths.map((d, i) => React.createElement('path', {
  key: i,
  d
})));
const IconMenu = _i(['M3 6h18', 'M3 12h18', 'M3 18h18']);
const IconHelp = props => React.createElement('svg', {
  width: props.size || 22,
  height: props.size || 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props
}, React.createElement('circle', {
  cx: 12,
  cy: 12,
  r: 10
}), React.createElement('path', {
  d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'
}), React.createElement('path', {
  d: 'M12 17h.01'
}));
const IconStats = _i(['M3 3v18h18', 'M7 16v-5', 'M12 16V8', 'M17 16v-8']);
const IconGear = props => React.createElement('svg', {
  width: props.size || 22,
  height: props.size || 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props
}, React.createElement('circle', {
  cx: 12,
  cy: 12,
  r: 3
}), React.createElement('path', {
  d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
}));
const IconBack = _i(['m15 18-6-6 6-6']);
Object.assign(window, {
  IconMenu,
  IconHelp,
  IconStats,
  IconGear,
  IconBack
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/MenuScreen.jsx
try { (() => {
// MenuScreen — soft, illustrated brand home.
function MenuScreen({
  onPlay,
  theme
}) {
  const {
    Button,
    Badge
  } = window.WordlingDesignSystem_ea77b4;
  const dark = theme === 'clean-dark' || theme === 'funky';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '46px 26px 30px',
      background: 'var(--game-bg)',
      color: 'var(--game-text)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "coral",
    variant: "solid"
  }, "Daily No. 412")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/cat.png",
    alt: "Wordling mascot",
    style: {
      width: 132,
      height: 'auto',
      filter: 'drop-shadow(0 10px 18px rgba(46,42,40,.18))',
      animation: 'wl-float 5s var(--ease-soft) infinite'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--title-font)',
      fontWeight: 'var(--title-weight)',
      color: 'var(--title-color)',
      textTransform: 'var(--title-transform)',
      letterSpacing: 'var(--title-spacing)',
      fontSize: 46,
      lineHeight: 1
    }
  }, "Wordling"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: 600,
      color: dark ? 'rgba(255,255,255,.7)' : 'var(--text-body)',
      maxWidth: 240,
      lineHeight: 1.45
    }
  }, "Six guesses. One little word. A new friend to find."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: onPlay
  }, "Play"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    style: {
      color: dark ? 'rgba(255,255,255,.78)' : 'var(--text-body)'
    }
  }, "How to play")));
}
window.MenuScreen = MenuScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/MenuScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/RewardScreen.jsx
try { (() => {
// RewardScreen — "You found the Cat!" celebration.
function RewardScreen({
  tries,
  onAgain,
  onMenu,
  theme
}) {
  const {
    Button,
    Card,
    Badge
  } = window.WordlingDesignSystem_ea77b4;
  const dark = theme === 'clean-dark' || theme === 'funky';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '40px 26px 30px',
      background: theme === 'funky' ? 'var(--game-bg)' : 'var(--coral)',
      color: '#fff',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "butter",
    variant: "solid"
  }, "Solved in ", tries, "/6")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1.1
    }
  }, "You found the\xA0Cat!"), /*#__PURE__*/React.createElement(Card, {
    tone: "card",
    elevation: "lg",
    pad: "lg",
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustrations/cat.png",
    alt: "A happy cat",
    style: {
      width: 150,
      height: 'auto',
      display: 'block',
      margin: '0 auto',
      animation: 'wl-float 4.5s var(--ease-soft) infinite'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22
    }
  }, "Well done!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: onAgain,
    style: {
      background: '#fff',
      color: 'var(--coral-deep)',
      boxShadow: '0 4px 0 rgba(0,0,0,.12)'
    }
  }, "Play again"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    onClick: onMenu,
    style: {
      color: 'rgba(255,255,255,.9)'
    }
  }, "Back to menu")));
}
window.RewardScreen = RewardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/RewardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/wordling/game.js
try { (() => {
// Wordling — tiny game helpers (no dictionary; accepts any 5-letter guess)
window.WordlingGame = function () {
  function evaluate(guess, answer) {
    const res = Array(answer.length).fill('absent');
    const a = answer.split('');
    const counts = {};
    a.forEach(c => counts[c] = (counts[c] || 0) + 1);
    for (let i = 0; i < a.length; i++) {
      if (guess[i] === a[i]) {
        res[i] = 'correct';
        counts[guess[i]]--;
      }
    }
    for (let i = 0; i < a.length; i++) {
      if (res[i] === 'correct') continue;
      const c = guess[i];
      if (counts[c] > 0) {
        res[i] = 'present';
        counts[c]--;
      }
    }
    return res;
  }

  // merge new letter states, upgrading absent < present < correct
  function mergeLetters(prev, letters, states) {
    const rank = {
      absent: 0,
      present: 1,
      correct: 2
    };
    const next = {
      ...prev
    };
    letters.forEach((c, i) => {
      const s = states[i];
      if (next[c] === undefined || rank[s] > rank[next[c]]) next[c] = s;
    });
    return next;
  }
  return {
    evaluate,
    mergeLetters,
    ANSWER: 'squad'
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/wordling/game.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Board = __ds_scope.Board;

__ds_ns.Keyboard = __ds_scope.Keyboard;

__ds_ns.Tile = __ds_scope.Tile;

})();
