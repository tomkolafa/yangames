/* YanGames shared player identity — one canonical place to set/view the name
   used on every game's leaderboard. There is no login: the name lives in
   localStorage['yan-name'] (per browser/device) and is read/written through the
   existing YanLeaderboard helpers so storage stays single-sourced.

   Exposes window.YanIdentity:
     getName(), setName(n), hasName()         → name helpers (delegate to YanLeaderboard)
     isOnboarded(), markOnboarded()           → "already asked" flag (yan-onboarded)
     NamePrompt({ theme, dismissible, onSave, onClose })  → first-launch / fallback modal
     NameField({ theme })                                 → editable Settings row

   UI is built with React.createElement (no JSX) so it needs no per-game build
   entry; it only touches window.React at render time. */
window.YanIdentity = (function () {
  var LB = window.YanLeaderboard || {};
  var ONBOARDED_KEY = 'yan-onboarded';

  function getName() { return (LB.getName && LB.getName()) || ''; }
  function setName(n) { return LB.setName ? LB.setName(n) : String(n || '').trim().slice(0, 24); }
  function hasName() { return !!getName(); }
  function isOnboarded() { try { return localStorage.getItem(ONBOARDED_KEY) === '1'; } catch (_) { return false; } }
  function markOnboarded() { try { localStorage.setItem(ONBOARDED_KEY, '1'); } catch (_) {} }

  function isDark(theme) { return theme === 'clean-dark' || theme === 'funky'; }

  // Shared rounded "Your name" input.
  function nameInput(R, opts) {
    var dark = opts.dark;
    return R.createElement('input', {
      value: opts.value,
      onChange: function (e) { opts.onChange(e.target.value); },
      onKeyDown: function (e) { if (e.key === 'Enter' && opts.onEnter) opts.onEnter(); },
      placeholder: 'Your name',
      maxLength: 24,
      autoFocus: opts.autoFocus,
      style: {
        flex: 1, minWidth: 0,
        border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
        background: dark ? 'rgba(255,255,255,.08)' : '#fff',
        color: dark ? '#fff' : 'var(--text-body)',
        borderRadius: 999, padding: '10px 14px', fontSize: 14, fontWeight: 600,
        fontFamily: 'var(--font-body)', outline: 'none',
      },
    });
  }

  // Shared pill button.
  function pillButton(R, opts) {
    return R.createElement('button', {
      onClick: opts.onClick,
      style: {
        border: 'none', background: opts.bg, color: opts.color || '#fff',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
        padding: '10px 18px', borderRadius: 999, cursor: 'pointer', flexShrink: 0,
        boxShadow: opts.flat ? 'none' : '0 3px 0 rgba(0,0,0,.15)',
        WebkitTapHighlightColor: 'transparent',
      },
    }, opts.label);
  }

  // First-launch / game-over fallback modal. `onSave` receives the saved name.
  function NamePrompt(props) {
    var R = window.React;
    var theme = props.theme;
    var dark = isDark(theme);
    var dismissible = props.dismissible !== false;
    var init = getName();
    var st = R.useState(init);
    var value = st[0], setValue = st[1];

    function save() {
      var nm = setName(value);
      if (!nm) return;
      markOnboarded();
      if (props.onSave) props.onSave(nm);
    }
    function skip() {
      markOnboarded();
      if (props.onClose) props.onClose();
    }

    return R.createElement('div', {
      onClick: function () { if (dismissible) skip(); },
      style: {
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      },
    },
      R.createElement('div', {
        onClick: function (e) { e.stopPropagation(); },
        style: {
          width: '100%', maxWidth: 320,
          background: dark ? '#262523' : 'var(--game-bg, #FBF7F0)',
          borderRadius: 'var(--radius-lg, 20px)',
          padding: '22px 20px 18px',
          boxShadow: '0 18px 50px rgba(0,0,0,.35)',
          display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center',
        },
      },
        R.createElement('div', { style: { fontSize: 34, lineHeight: 1 } }, '👋'),
        R.createElement('div', {
          style: {
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
            color: dark ? '#fff' : 'var(--game-text)', textAlign: 'center',
          },
        }, "What's your name?"),
        R.createElement('div', {
          style: {
            fontSize: 13, lineHeight: 1.45, textAlign: 'center',
            color: dark ? 'rgba(255,255,255,.6)' : 'var(--text-muted)',
          },
        }, 'It shows on the leaderboard across all our games. You can change it anytime in Settings.'),
        R.createElement('div', { style: { display: 'flex', gap: 8, width: '100%', marginTop: 2 } },
          nameInput(R, { dark: dark, value: value, onChange: setValue, onEnter: save, autoFocus: true }),
          pillButton(R, { onClick: save, bg: 'var(--brand)', label: 'Save' })
        ),
        dismissible && R.createElement('button', {
          onClick: skip,
          style: {
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
            color: dark ? 'rgba(255,255,255,.5)' : 'var(--text-muted)',
            WebkitTapHighlightColor: 'transparent',
          },
        }, 'Maybe later')
      )
    );
  }

  // Editable name row for Settings. Saves on blur / Enter / Save button.
  function NameField(props) {
    var R = window.React;
    var dark = isDark(props.theme);
    var st = R.useState(getName());
    var value = st[0], setValue = st[1];
    var savedSt = R.useState(false);
    var justSaved = savedSt[0], setJustSaved = savedSt[1];

    function save() {
      var nm = setName(value);
      setValue(nm);
      if (nm) markOnboarded();
      setJustSaved(true);
      setTimeout(function () { setJustSaved(false); }, 1500);
    }

    return R.createElement('div', { style: { display: 'flex', gap: 8, width: '100%', alignItems: 'center' } },
      nameInput(R, { dark: dark, value: value, onChange: function (v) { setValue(v); }, onEnter: save }),
      pillButton(R, { onClick: save, bg: justSaved ? 'var(--accent-success, #56C98A)' : 'var(--brand)', label: justSaved ? 'Saved ✓' : 'Save' })
    );
  }

  return {
    getName: getName, setName: setName, hasName: hasName,
    isOnboarded: isOnboarded, markOnboarded: markOnboarded,
    NamePrompt: NamePrompt, NameField: NameField,
  };
})();
