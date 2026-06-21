/* YanGames shared leaderboard client — talks to Supabase PostgREST directly
   with the public anon key. No SDK. Degrades gracefully (returns null/false)
   when unconfigured or offline, so screens fall back to their sample data. */
window.YanLeaderboard = (function () {
  var cfg = window.YAN_CONFIG || {};
  var URL = cfg.supabaseUrl;
  var KEY = cfg.supabaseAnonKey;
  var ENABLED = !!(URL && KEY);

  function headers() {
    return {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    };
  }
  function rest(qs) { return URL + '/rest/v1/' + qs; }

  // Top scores. Rundl / Snakl → highest score first. Yandl → fewest guesses
  // then fastest time for a given puzzle number.
  function fetchTop(game, opts) {
    if (!ENABLED) return Promise.resolve(null);
    opts = opts || {};
    var sel = 'select=name,emoji,score,guesses,time_ms,char_id,created_at';
    var qs;
    if (game === 'rundl' || game === 'snakl' || game === 'packl' || game === 'pourl' || game === 'memorl' || game === 'brewl' || game === 'trainl' || game === 'spacl' || game === 'slicl' || game === 'routl') {
      qs = 'scores?game=eq.' + game + '&' + sel + '&order=score.desc&limit=' + (opts.limit || 25);
    } else {
      qs = 'scores?game=eq.yandl&' + sel;
      if (opts.puzzle != null) qs += '&puzzle=eq.' + encodeURIComponent(opts.puzzle);
      qs += '&order=guesses.asc,time_ms.asc.nullslast&limit=' + (opts.limit || 25);
    }
    return fetch(rest(qs), { headers: headers() })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function submit(row) {
    if (!ENABLED) return Promise.resolve(false);
    return fetch(rest('scores'), { method: 'POST', headers: headers(), body: JSON.stringify(row) })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  function getName() { try { return localStorage.getItem('yan-name') || ''; } catch (_) { return ''; } }
  function setName(n) {
    var clean = String(n || '').trim().slice(0, 24);
    try { localStorage.setItem('yan-name', clean); } catch (_) {}
    return clean;
  }

  return { ENABLED: ENABLED, fetchTop: fetchTop, submit: submit, getName: getName, setName: setName };
})();
