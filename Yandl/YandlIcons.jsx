// Yandl Icons — Lucide-style stroke icons
(function () {
  function mkSvg(childEls, vb) {
    return function (props) {
      var _props = props || {};
      var size = _props.size || 22;
      var rest = Object.assign({}, _props);
      delete rest.size;
      return React.createElement(
        'svg',
        Object.assign({ width: size, height: size, viewBox: vb || '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, rest),
        ...childEls
      );
    };
  }
  var p = function(d) { return React.createElement('path', { key: d.slice(0, 8), d: d }); };
  var ci = function(cx, cy, r) { return React.createElement('circle', { key: cx + '' + cy, cx: cx, cy: cy, r: r }); };
  var li = function(x1, y1, x2, y2) { return React.createElement('line', { key: x1+'-'+y1, x1:x1, y1:y1, x2:x2, y2:y2 }); };
  var re = function(x, y, w, h, rx) { return React.createElement('rect', { key: x+'-'+y, x:x, y:y, width:w, height:h, rx:rx }); };

  var IconHome = mkSvg([
    p('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
    p('M9 22V12h6v10'),
  ]);

  var IconPlay = mkSvg([
    re(3, 3, 7, 7, 1.5), re(14, 3, 7, 7, 1.5),
    re(3, 14, 7, 7, 1.5), re(14, 14, 7, 7, 1.5),
  ]);

  var IconTrophy = mkSvg([
    p('M6 9H4.5a2.5 2.5 0 0 1 0-5H6'),
    p('M18 9h1.5a2.5 2.5 0 0 0 0-5H18'),
    p('M4 22h16'),
    p('M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22'),
    p('M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22'),
    p('M18 2H6v7a6 6 0 0 0 12 0V2z'),
  ]);

  var IconGear = mkSvg([
    ci(12, 12, 3),
    p('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'),
  ]);

  var IconBack   = mkSvg([p('m15 18-6-6 6-6')]);
  var IconClose  = mkSvg([p('M18 6 6 18'), p('m6 6 12 12')]);
  var IconHelp   = mkSvg([ci(12,12,10), p('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'), p('M12 17h.01')]);
  var IconShare  = mkSvg([ci(18,5,3), ci(6,12,3), ci(18,19,3), li(8.59,13.51,15.42,17.49), li(15.41,6.51,8.59,10.49)]);
  var IconStats  = mkSvg([p('M3 3v18h18'), p('M7 16v-5'), p('M12 16V8'), p('M17 16v-3')]);
  var IconCheck  = mkSvg([p('M20 6 9 17l-5-5')]);
  var IconPaw    = mkSvg([
    ci(11, 4, 1.5), ci(15, 3.5, 1.5), ci(7.5, 6.5, 1.5), ci(17.5, 7, 1.5),
    p('M12.7 9.5c-2.1-.9-4.6.3-5.5 2.8L6 16c-.6 2 .5 3.9 2.3 4.5s3.8-.1 4.7-2l.5-1.5.5 1.5c.9 2 3 2.7 4.7 2s2.9-2.5 2.3-4.5l-1.2-3.7c-.9-2.5-3.4-3.7-5.5-2.8z'),
  ]);

  Object.assign(window, { IconHome, IconPlay, IconTrophy, IconGear, IconBack, IconClose, IconHelp, IconShare, IconStats, IconCheck, IconPaw });
})();
