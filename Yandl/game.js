// Yandl — game engine, daily puzzle, stats
// The answer pool + valid-guess dictionary live in words.js (window.YandlWords),
// loaded before this file. FALLBACK keeps the game playable if it ever fails.
window.YandlGame = (function () {
  const FALLBACK = [
    'brave','crane','flute','ghost','heart','ivory','lemon','magic','night','ocean',
    'paint','queen','raven','shelf','tiger','voice','river','storm','noble','quiet',
  ];

  function answerPool() {
    var w = window.YandlWords;
    return (w && w.ANSWERS && w.ANSWERS.length) ? w.ANSWERS : FALLBACK;
  }

  function isValidWord(guess) {
    var g = String(guess || '').toLowerCase();
    if (!/^[a-z]{5}$/.test(g)) return false;
    var w = window.YandlWords;
    return (w && typeof w.isAllowed === 'function') ? w.isAllowed(g) : true;
  }

  function getDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function getPuzzleNumber() {
    const start = new Date('2024-01-01T00:00:00');
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.floor((now - start) / 86400000) + 1;
  }

  function getDailyWord() {
    const WORDS = answerPool();
    const start = new Date('2024-01-01T00:00:00');
    const now = new Date(); now.setHours(0,0,0,0);
    const diff = Math.floor((now - start) / 86400000);
    return WORDS[((diff % WORDS.length) + WORDS.length) % WORDS.length];
  }

  function evaluate(guess, answer) {
    const g = guess.toLowerCase().split('');
    const a = answer.toLowerCase().split('');
    const res = Array(a.length).fill('absent');
    const counts = {};
    a.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
    g.forEach((c, i) => { if (c === a[i]) { res[i] = 'correct'; counts[c]--; } });
    g.forEach((c, i) => {
      if (res[i] === 'correct') return;
      if (counts[c] > 0) { res[i] = 'present'; counts[c]--; }
    });
    return res;
  }

  function mergeLetters(prev, letters, states) {
    const rank = { absent: 0, present: 1, correct: 2 };
    const next = { ...prev };
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
    if (last.states.every((s) => s === 'correct')) return 'won';
    if (guesses.length >= 6) return 'lost';
    return 'playing';
  }

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem('yandl-stats') || 'null');
      if (s && typeof s === 'object') return s;
    } catch (_) {}
    return { played: 0, wins: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0] };
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
    try { return JSON.parse(localStorage.getItem('yandl-day-' + getDateKey()) || 'null'); }
    catch (_) { return null; }
  }

  function saveTodayResult(data) {
    localStorage.setItem('yandl-day-' + getDateKey(), JSON.stringify(data));
  }

  function buildShareText(guesses, puzzleNum) {
    const rows = guesses.map((g) =>
      g.states.map((s) => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
    ).join('\n');
    return `Yandl #${puzzleNum} ${guesses.length}/6\n\n${rows}`;
  }

  const LEADERBOARD = [
    { name: 'Luna',   emoji: '🐱', guesses: 2, time: '0:42' },
    { name: 'Jasper', emoji: '🦊', guesses: 3, time: '1:14' },
    { name: 'Nova',   emoji: '🐨', guesses: 3, time: '1:55' },
    { name: 'Mochi',  emoji: '🐼', guesses: 4, time: '2:08' },
    { name: 'Pixel',  emoji: '🐧', guesses: 4, time: '2:50' },
    { name: 'Cleo',   emoji: '🦁', guesses: 5, time: '3:31' },
    { name: 'Zara',   emoji: '🐯', guesses: 5, time: '4:12' },
    { name: 'Cosmo',  emoji: '🐻', guesses: 6, time: '5:20' },
  ];

  return {
    getDailyWord, getPuzzleNumber, getDateKey, isValidWord,
    evaluate, mergeLetters, computeLetterStates, determineStatus,
    loadStats, recordResult,
    loadTodayResult, saveTodayResult, buildShareText,
    LEADERBOARD,
  };
})();
