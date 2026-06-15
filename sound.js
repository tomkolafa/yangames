/* YanGames sound effects — tiny Web Audio synth, no audio files.
   Gentle tones to match the soft brand. Respects each game's Sound
   toggle (localStorage 'yandl-sound' / 'bend-sound'; '0' = off).
   The AudioContext is created lazily on the first play() — which is
   always triggered by a user gesture (tap / keypress) — to satisfy
   browser autoplay policies. */
window.YanSound = (function () {
  var ctx = null;

  function ac() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (_) { ctx = null; }
    return ctx;
  }

  function enabled(key) {
    if (!key) return true;
    try { return localStorage.getItem(key) !== '0'; } catch (_) { return true; }
  }

  // One tone with a soft attack + exponential release.
  function tone(c, t0, n) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = n.type || 'triangle';
    o.frequency.setValueAtTime(n.f0, t0);
    if (n.f1 != null) o.frequency.exponentialRampToValueAtTime(Math.max(1, n.f1), t0 + n.dur);
    var peak = n.gain != null ? n.gain : 0.1;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + n.dur + 0.03);
  }

  function seq(notes) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + 0.001;
    notes.forEach(function (n) { tone(c, t, n); t += (n.gap != null ? n.gap : n.dur); });
  }

  var RECIPES = {
    key:       function () { seq([{ f0: 660, dur: 0.045, gain: 0.05 }]); },
    back:      function () { seq([{ f0: 360, dur: 0.045, gain: 0.04 }]); },
    invalid:   function () { seq([{ f0: 175, f1: 120, dur: 0.22, gain: 0.12, type: 'sine' }]); },
    flip:      function () { seq([{ f0: 440, f1: 560, dur: 0.07, gain: 0.06 }]); },
    win:       function () { seq([{ f0: 523, dur: 0.10, gain: 0.12 }, { f0: 659, dur: 0.10, gain: 0.12 }, { f0: 784, dur: 0.10, gain: 0.12 }, { f0: 1046, dur: 0.20, gain: 0.13 }]); },
    lose:      function () { seq([{ f0: 392, dur: 0.14, gain: 0.10, type: 'sine' }, { f0: 330, dur: 0.14, gain: 0.10, type: 'sine' }, { f0: 262, dur: 0.24, gain: 0.10, type: 'sine' }]); },
    jump:      function () { seq([{ f0: 300, f1: 640, dur: 0.12, gain: 0.09 }]); },
    start:     function () { seq([{ f0: 440, f1: 660, dur: 0.12, gain: 0.09 }]); },
    milestone: function () { seq([{ f0: 880, dur: 0.04, gain: 0.05 }, { f0: 1175, dur: 0.05, gain: 0.05 }]); },
    gameover:  function () { seq([{ f0: 392, dur: 0.12, gain: 0.11, type: 'sawtooth' }, { f0: 311, dur: 0.12, gain: 0.11, type: 'sawtooth' }, { f0: 196, dur: 0.30, gain: 0.11, type: 'sawtooth' }]); },
  };

  function play(name, key) {
    if (!enabled(key)) return;
    var r = RECIPES[name];
    if (r) { try { r(); } catch (_) {} }
  }

  return { play: play };
})();
