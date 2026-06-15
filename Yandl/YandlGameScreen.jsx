// Yandl — Game Screen
function GameScreen({ theme, onBack, onHelp, onStats }) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Board    = DS.Board;
  var Keyboard = DS.Keyboard;
  var Game     = window.YandlGame;
  var ANSWER   = Game.getDailyWord();
  var dark     = theme === 'clean-dark' || theme === 'funky';
  var tbColor  = dark ? 'rgba(255,255,255,.85)' : 'var(--text-body)';

  // Restore or init state
  var saved = Game.loadTodayResult() || {};

  var [guesses,       setGuesses]       = React.useState(saved.guesses || []);
  var [current,       setCurrent]       = React.useState('');
  var [letterStates,  setLetterStates]  = React.useState(function() { return Game.computeLetterStates(saved.guesses || []); });
  var [status,        setStatus]        = React.useState(function() { return Game.determineStatus(saved.guesses || []); });
  var [reveal,        setReveal]        = React.useState(false);
  var [invalidRow,    setInvalidRow]    = React.useState(-1);
  var [toast,         setToast]         = React.useState('');
  var [recorded,      setRecorded]      = React.useState(saved.recorded || false);
  var lockRef = React.useRef(false);
  // Solve timer (persisted so it survives a reload mid-puzzle)
  var startRef = React.useRef(saved.startedAt || Date.now());
  var endRef   = React.useRef(saved.endedAt || null);

  // Record result once
  React.useEffect(function() {
    if ((status === 'won' || status === 'lost') && !recorded) {
      if (status === 'won' && !endRef.current) endRef.current = Date.now();
      snd(status === 'won' ? 'win' : 'lose');
      Game.recordResult(status === 'won', guesses.length);
      setRecorded(true);
      Game.saveTodayResult({ guesses: guesses, recorded: true, startedAt: startRef.current, endedAt: endRef.current });
    }
  }, [status]);

  var showToast = function(m) {
    setToast(m);
    setTimeout(function() { setToast(''); }, 1400);
  };

  var snd = function(n) { if (window.YanSound) window.YanSound.play(n, 'yandl-sound'); };

  var submit = React.useCallback(function() {
    if (current.length < 5) {
      snd('invalid');
      setInvalidRow(guesses.length);
      showToast('Not enough letters');
      setTimeout(function() { setInvalidRow(-1); }, 500);
      return;
    }
    if (!Game.isValidWord(current)) {
      snd('invalid');
      setInvalidRow(guesses.length);
      showToast('Not in word list');
      setTimeout(function() { setInvalidRow(-1); }, 500);
      return;
    }
    var letters = current.split('');
    var states  = Game.evaluate(current, ANSWER);
    var newGuesses = guesses.concat([{ letters: letters, states: states }]);
    setGuesses(newGuesses);
    setLetterStates(function(p) { return Game.mergeLetters(p, letters, states); });
    setCurrent('');
    setReveal(true);
    snd('flip');
    lockRef.current = true;
    setTimeout(function() { setReveal(false); lockRef.current = false; }, 1900);
    var newStatus = Game.determineStatus(newGuesses);
    if (newStatus !== 'playing') {
      setTimeout(function() { setStatus(newStatus); }, 1950);
    }
    Game.saveTodayResult({ guesses: newGuesses, recorded: recorded, startedAt: startRef.current, endedAt: endRef.current });
  }, [current, guesses, recorded]);

  var onKey = React.useCallback(function(k) {
    if (lockRef.current || status !== 'playing') return;
    if (k === 'enter') submit();
    else if (k === 'back') { snd('back'); setCurrent(function(c) { return c.slice(0, -1); }); }
    else if (/^[a-z]$/.test(k)) { snd('key'); setCurrent(function(c) { return c.length < 5 ? c + k : c; }); }
  }, [submit, status]);

  React.useEffect(function() {
    var h = function(e) {
      if (e.key === 'Enter') onKey('enter');
      else if (e.key === 'Backspace') onKey('back');
      else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', h);
    return function() { window.removeEventListener('keydown', h); };
  }, [onKey]);

  var isDone = status !== 'playing';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--game-bg)', minHeight: 0 }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', flexShrink: 0,
        borderBottom: theme === 'classic' ? '1px solid var(--hairline)' : 'none',
      }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: 8, borderRadius: 10, display: 'flex' }}>
            <IconBack size={20} />
          </button>
          <button onClick={onHelp} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: 8, borderRadius: 10, display: 'flex' }}>
            <IconHelp size={20} />
          </button>
        </div>
        <div style={{
          fontFamily: 'var(--title-font)', fontWeight: 'var(--title-weight)',
          color: 'var(--title-color)', textTransform: 'var(--title-transform)',
          letterSpacing: 'var(--title-spacing)', fontSize: 26,
        }}>Yandl</div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={onStats} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: tbColor, padding: 8, borderRadius: 10, display: 'flex' }}>
            <IconStats size={20} />
          </button>
        </div>
      </div>

      {/* Board */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 0 }}>
        {toast && (
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            background: dark ? '#fff' : 'var(--ink)', color: dark ? 'var(--ink)' : '#fff',
            padding: '9px 18px', borderRadius: 'var(--radius-pill)', fontSize: 13,
            fontWeight: 700, boxShadow: 'var(--shadow-md)', zIndex: 10, whiteSpace: 'nowrap',
          }}>{toast}</div>
        )}
        <Board
          guesses={guesses} current={current}
          tileSize={52} rainbow={theme === 'funky'}
          reveal={reveal} invalidRow={invalidRow}
        />
      </div>

      {/* Keyboard or Result panel */}
      {!isDone ? (
        <div style={{ padding: '0 8px 18px', flexShrink: 0 }}>
          <Keyboard letterStates={letterStates} onKey={onKey} />
        </div>
      ) : (
        <ResultPanel
          theme={theme} dark={dark} status={status}
          guesses={guesses} answer={ANSWER}
          timeMs={(endRef.current && startRef.current) ? Math.max(0, endRef.current - startRef.current) : null}
          onStats={onStats} onBack={onBack}
        />
      )}
    </div>
  );
}

function ResultPanel({ theme, dark, status, guesses, answer, timeMs, onStats, onBack }) {
  var DS = window.WordlingDesignSystem_ea77b4;
  var Button = DS.Button;
  var won = status === 'won';
  var puzzleNum = window.YandlGame.getPuzzleNumber();
  var [copied, setCopied] = React.useState(false);

  var LB = window.YanLeaderboard;
  var lbOn = !!(LB && LB.ENABLED);
  var [saved, setSaved] = React.useState(false);
  var [nameInput, setNameInput] = React.useState(function() { return (LB && LB.getName()) || ''; });

  function saveScore(rawName) {
    if (!lbOn) return;
    var nm = LB.setName(rawName);
    if (!nm) return;
    setNameInput(nm);
    LB.submit({ game: 'yandl', name: nm, emoji: '😺', guesses: guesses.length, time_ms: timeMs, puzzle: puzzleNum });
    setSaved(true);
  }

  // Auto-submit a win if we already know the player's name
  React.useEffect(function() {
    if (won && lbOn && !saved && LB.getName()) {
      LB.submit({ game: 'yandl', name: LB.getName(), emoji: '😺', guesses: guesses.length, time_ms: timeMs, puzzle: puzzleNum });
      setSaved(true);
    }
  }, []);

  var handleShare = function() {
    var text = window.YandlGame.buildShareText(guesses, puzzleNum);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() { setCopied(true); setTimeout(function() { setCopied(false); }, 2000); });
    }
  };

  var bgGrad = won
    ? (dark ? 'linear-gradient(160deg, rgba(91,196,138,.15) 0%, transparent 60%)' : 'linear-gradient(160deg, #e8fdf2 0%, var(--game-bg) 60%)')
    : (dark ? 'rgba(255,255,255,.03)' : 'var(--bg-sunken)');

  return (
    <div style={{
      flexShrink: 0, padding: '16px 20px 18px',
      background: bgGrad,
      borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.1)' : 'var(--hairline)'),
      display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: won ? 'var(--accent-success)' : 'var(--game-text)' }}>
          {won ? '🎉 You got it!' : 'Better luck next time'}
        </div>
        {!won && (
          <div style={{ marginTop: 4, fontSize: 13, color: dark ? 'rgba(255,255,255,.65)' : 'var(--text-body)', fontWeight: 600 }}>
            The word was <strong style={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand)' }}>{answer}</strong>
          </div>
        )}
        {won && (
          <div style={{ marginTop: 4, fontSize: 13, color: dark ? 'rgba(255,255,255,.65)' : 'var(--text-body)', fontWeight: 600 }}>
            Solved in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
          </div>
        )}
      </div>
      {won && lbOn && (
        saved ? (
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-success)' }}>Added to leaderboard ✓</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 280 }}>
            <input
              value={nameInput}
              onChange={function(e) { setNameInput(e.target.value); }}
              onKeyDown={function(e) { if (e.key === 'Enter') saveScore(nameInput); }}
              placeholder="Your name"
              maxLength={24}
              style={{
                flex: 1, minWidth: 0,
                border: '2px solid ' + (dark ? 'rgba(255,255,255,.22)' : 'var(--hairline)'),
                background: dark ? 'rgba(255,255,255,.08)' : '#fff',
                color: dark ? '#fff' : 'var(--text-body)',
                borderRadius: 999, padding: '9px 14px', fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-body)', outline: 'none',
              }}
            />
            <button
              onClick={function() { saveScore(nameInput); }}
              style={{
                border: 'none', background: 'var(--brand)', color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                padding: '10px 16px', borderRadius: 999, cursor: 'pointer', flexShrink: 0,
                boxShadow: '0 3px 0 rgba(0,0,0,.15)', WebkitTapHighlightColor: 'transparent',
              }}>Add</button>
          </div>
        )
      )}
      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 280 }}>
        <Button variant="secondary" size="sm" fullWidth onClick={handleShare}
          style={{ flex: 1 }}>
          <IconShare size={16} style={{ marginRight: 4 }} />
          {copied ? 'Copied!' : 'Share'}
        </Button>
        <Button variant="primary" size="sm" fullWidth onClick={onStats}
          style={{ flex: 1 }}>
          <IconStats size={16} style={{ marginRight: 4 }} />
          Stats
        </Button>
      </div>
    </div>
  );
}
window.GameScreen = GameScreen;
