// SPACL — Game engine: pets (shared with Snakl/Rundl), front-face portraits,
// and a Nokia-style side-scrolling shoot-'em-up model + scoring/stats.
// Exposed as window.SpaclGame. All drawing is procedural (no image files).
window.SpaclGame = (function () {

  // ── CHARACTERS (the four shared pets — pilot the ship) ─────────────
  var CHARACTERS = [
    { id: 'B', name: 'Bebe',   species: 'Golden Retriever',        color: '#F4B942' },
    { id: 'E', name: 'Bambi',  species: 'Yandl Cat',               color: '#E8755C' },
    { id: 'N', name: 'Nene',   species: 'King Charles Cavalier',   color: '#4A4A4A' },
    { id: 'D', name: 'Dede',   species: 'Longhair Mini Dachshund', color: '#9B6B3A' },
  ];
  var CHAR_COLOR = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  function charColor(id) { return CHAR_COLOR[id] || '#E8755C'; }

  // ── HELPERS ─────────────────────────────────────────────────────────
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }
  function leg(ctx, x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  // ── SIDE-VIEW PETS (used by the home-screen picker preview) ─────────
  // Origin: (0,0) = foot position, y negative = upward. Faces right.
  function drawBuddy(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.18) * 7;
    var tw = j ? 6 : Math.sin(f * 0.13) * 12;
    ctx.save();
    ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-15, -24);
    ctx.bezierCurveTo(-22, -34 + tw * 0.4, -28, -44 + tw * 0.6, -18, -54 + tw); ctx.stroke();
    ctx.strokeStyle = '#E8AA3A'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-20, -38 + tw * 0.4);
    ctx.quadraticCurveTo(-26, -46 + tw * 0.5, -19, -52 + tw); ctx.stroke();
    ctx.fillStyle = '#F0B030';
    ctx.beginPath(); ctx.ellipse(0, -22, 20, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#D4952A';
    ctx.beginPath(); ctx.ellipse(-6, -26, 12, 6, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath(); ctx.ellipse(12, -18, 10, 12, 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath(); ctx.ellipse(10, -28, 8, 7, 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F0B030';
    ctx.beginPath(); ctx.arc(17, -37, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath(); ctx.ellipse(17, -42, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#D4952A';
    ctx.beginPath(); ctx.ellipse(8, -30, 7, 13, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C8882A';
    ctx.beginPath(); ctx.ellipse(9, -28, 4, 9, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath(); ctx.ellipse(26, -34, 8, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3A2518';
    ctx.beginPath(); ctx.arc(21, -40, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(22, -41, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(21, -42, 4, Math.PI + 0.3, Math.PI * 2 - 0.3); ctx.stroke();
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.ellipse(33, -34, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2E2A28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(30, -32, 4, 0.1, Math.PI - 0.1); ctx.stroke();
    if (!j) {
      ctx.fillStyle = '#E8657C';
      ctx.beginPath(); ctx.ellipse(29, -29, 3, 4.5, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath(); ctx.ellipse(29, -28, 2, 3, 0.15, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#F0B030'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -11, 14, -5); leg(ctx, 3, -11, -2, -5);
      leg(ctx, -7, -11, -4, -5); leg(ctx, -12, -11, -16, -5);
    } else {
      leg(ctx, 8, -11, 8 + sw, 0); leg(ctx, 3, -11, 3 - sw, 0);
      leg(ctx, -7, -11, -7 - sw, 0); leg(ctx, -12, -11, -12 + sw, 0);
    }
    ctx.strokeStyle = '#FBDB7A'; ctx.lineWidth = 2.5;
    if (!j) {
      ctx.beginPath(); ctx.moveTo(6, -8); ctx.lineTo(6 + sw * 0.7, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(-9 - sw * 0.7, -2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawElio(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.2) * 7;
    ctx.save();
    ctx.strokeStyle = '#C45A42'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-15, -18);
    ctx.bezierCurveTo(-28, -30, -26, -46, -14 + Math.sin(f * 0.1) * 5, -52); ctx.stroke();
    ctx.fillStyle = '#E8755C';
    ctx.beginPath(); ctx.ellipse(0, -20, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, -28); ctx.lineTo(-4, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -29); ctx.lineTo(2, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, -28); ctx.lineTo(8, -14); ctx.stroke();
    ctx.fillStyle = '#E8755C';
    ctx.beginPath(); ctx.arc(15, -34, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(12, -44); ctx.lineTo(13, -36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, -45); ctx.lineTo(17, -37); ctx.stroke();
    ctx.fillStyle = '#C45A42';
    ctx.beginPath(); ctx.moveTo(8, -44); ctx.lineTo(13, -36); ctx.lineTo(17, -44); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(19, -45); ctx.lineTo(24, -36); ctx.lineTo(28, -43); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath(); ctx.moveTo(9.5, -43); ctx.lineTo(13, -37); ctx.lineTo(15.5, -42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20.5, -44); ctx.lineTo(23.5, -37); ctx.lineTo(26.5, -42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath(); ctx.ellipse(21, -32, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E76A91';
    ctx.beginPath(); ctx.arc(21, -33, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.arc(17, -38, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(18, -39, 1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(200,160,150,.65)'; ctx.lineWidth = 1;
    [[15,-32,7,-30],[15,-31,7,-32],[27,-32,35,-30],[27,-31,35,-32]].forEach(function (w) {
      ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke();
    });
    ctx.strokeStyle = '#E8755C'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 7, -10, 13, -4); leg(ctx, 3, -10, -2, -4);
      leg(ctx, -6, -10, -3, -4); leg(ctx, -10, -10, -14, -4);
    } else {
      leg(ctx, 7, -10, 7 + sw, 0); leg(ctx, 3, -10, 3 - sw, 0);
      leg(ctx, -6, -10, -6 - sw, 0); leg(ctx, -10, -10, -10 + sw, 0);
    }
    ctx.restore();
  }

  function drawNoble(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.16) * 6;
    var tw = j ? 4 : Math.sin(f * 0.14) * 10;
    ctx.save();
    ctx.strokeStyle = '#2E2E2E'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-14, -22);
    ctx.bezierCurveTo(-20, -34 + tw * 0.4, -26, -42 + tw * 0.5, -16, -50 + tw); ctx.stroke();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-18, -36 + tw * 0.4);
    ctx.quadraticCurveTo(-24, -44 + tw * 0.5, -17, -48 + tw); ctx.stroke();
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(-1, -21, 18, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(9, -18, 11, 13, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath(); ctx.ellipse(12, -16, 6, 8, 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(11, -28, 9, 7, 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.arc(18, -37, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.arc(18, -38, 12, Math.PI + 0.2, -0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(18, -39, 4, 8.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(18, -46, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(7, -26, 7, 18, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath(); ctx.ellipse(8, -24, 3.5, 12, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, -18); ctx.quadraticCurveTo(3, -14, 6, -10); ctx.stroke();
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(26, -33, 5.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.ellipse(30, -34, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.beginPath(); ctx.ellipse(29, -35, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(21, -39, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.arc(21, -39, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(22, -40, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2E2E2E'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(21, -42, 3.5, Math.PI + 0.4, -0.4); ctx.stroke();
    ctx.fillStyle = '#E8657C';
    ctx.beginPath(); ctx.ellipse(27, -29, 2.5, 4, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F08090';
    ctx.beginPath(); ctx.ellipse(27, -28, 1.5, 2.5, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -9, 13, -3); leg(ctx, 4, -9, -1, -3);
      leg(ctx, -7, -9, -4, -3); leg(ctx, -11, -9, -15, -3);
    } else {
      leg(ctx, 8, -9, 8 + sw, 0); leg(ctx, 4, -9, 4 - sw, 0);
      leg(ctx, -7, -9, -7 - sw, 0); leg(ctx, -11, -9, -11 + sw, 0);
    }
    ctx.strokeStyle = '#F0F0F0'; ctx.lineWidth = 2;
    if (!j) {
      ctx.beginPath(); ctx.moveTo(6, -6); ctx.lineTo(6 + sw * 0.6, -1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(-9 - sw * 0.6, -1); ctx.stroke();
    }
    ctx.restore();
  }

  function drawDash(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.28) * 5;
    var tw = j ? 3 : Math.sin(f * 0.18) * 6;
    ctx.save();
    ctx.strokeStyle = '#6A4020'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22, -16);
    ctx.quadraticCurveTo(-30, -22 + tw, -26, -30 + tw); ctx.stroke();
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath(); ctx.ellipse(0, -16, 24, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7A5028';
    ctx.beginPath(); ctx.ellipse(-2, -16, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C8956A';
    ctx.beginPath(); ctx.ellipse(6, -11, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath(); ctx.arc(21, -25, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6A4020';
    ctx.beginPath(); ctx.ellipse(15, -18, 5.5, 12, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(25, -18, 5, 11, 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C8956A';
    ctx.beginPath(); ctx.ellipse(28, -24, 9, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.ellipse(36, -24, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.arc(23, -28, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(24, -29, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#9B6B3A'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 12, -7, 15, -3); leg(ctx, 7, -7, 5, -3);
      leg(ctx, -8, -7, -6, -3); leg(ctx, -13, -7, -15, -3);
    } else {
      leg(ctx, 12, -7, 12 + sw, 0); leg(ctx, 7, -7, 7 - sw, 0);
      leg(ctx, -8, -7, -8 + sw, 0); leg(ctx, -13, -7, -13 - sw, 0);
    }
    ctx.restore();
  }

  function drawCharacter(ctx, id, frame, jumping) {
    switch (id) {
      case 'B': return drawBuddy(ctx, frame, jumping);
      case 'E': return drawElio(ctx, frame, jumping);
      case 'N': return drawNoble(ctx, frame, jumping);
      case 'D': return drawDash(ctx, frame, jumping);
    }
  }

  // ── FRONT-FACING FACE PORTRAITS (used for the ship + leaderboard) ──
  // Draws centered on the current origin. `size` maps the ~60-unit portrait
  // space to roughly `size` pixels. Caller translates to the desired center.
  function drawFace(ctx, id, size) {
    ctx.save();
    var sc = (size || 60) / 60;
    ctx.scale(sc, sc);

    if (id === 'B') {
      ctx.fillStyle = '#D4952A';
      ctx.beginPath(); ctx.ellipse(-18, 6, 9, 16, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, 6, 9, 16, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8882A';
      ctx.beginPath(); ctx.ellipse(-17, 8, 5, 10, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 8, 5, 10, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0B030';
      ctx.beginPath(); ctx.ellipse(0, -2, 20, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F5C84E';
      ctx.beginPath(); ctx.ellipse(0, -12, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FBDB7A';
      ctx.beginPath(); ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3A2518';
      ctx.beginPath(); ctx.arc(-8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -5, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(8, -7, 4, Math.PI + 0.3, -0.3); ctx.stroke();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 4.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2E2A28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.quadraticCurveTo(0, 14, 4, 10); ctx.stroke();
      ctx.fillStyle = '#E8657C';
      ctx.beginPath(); ctx.ellipse(0, 13, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath(); ctx.ellipse(0, 12.5, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    } else if (id === 'E') {
      ctx.fillStyle = '#C45A42';
      ctx.beginPath(); ctx.moveTo(-12, -28); ctx.lineTo(-6, -10); ctx.lineTo(-20, -10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -28); ctx.lineTo(6, -10); ctx.lineTo(20, -10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.moveTo(-12, -25); ctx.lineTo(-8, -12); ctx.lineTo(-18, -12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -25); ctx.lineTo(8, -12); ctx.lineTo(18, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#E8755C';
      ctx.beginPath(); ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, -18); ctx.lineTo(-3, -8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(0, -9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -18); ctx.lineTo(3, -8); ctx.stroke();
      ctx.fillStyle = '#FAC8B8';
      ctx.beginPath(); ctx.ellipse(0, 7, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#E76A91';
      ctx.beginPath(); ctx.ellipse(0, 4, 2.8, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#C45A42'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
      ctx.strokeStyle = 'rgba(200,160,150,.6)'; ctx.lineWidth = 1;
      [[-8,6,-20,3],[-8,7,-20,8],[8,6,20,3],[8,7,20,8]].forEach(function (w) {
        ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke();
      });

    } else if (id === 'N') {
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(-17, 6, 8, 18, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 6, 8, 18, 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath(); ctx.ellipse(-16, 8, 4, 12, -0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(16, 8, 4, 12, 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -2, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.arc(0, -3, 18, Math.PI + 0.15, -0.15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, -5, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2E2E';
      ctx.beginPath(); ctx.ellipse(0, -16, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath(); ctx.ellipse(0, 8, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.arc(-7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -2, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -3, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath(); ctx.ellipse(0, 6, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath(); ctx.ellipse(-1, 5, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 10); ctx.quadraticCurveTo(0, 13, 3, 10); ctx.stroke();

    } else if (id === 'D') {
      ctx.fillStyle = '#6A4020';
      ctx.beginPath(); ctx.ellipse(-15, 6, 7, 16, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(15, 6, 7, 16, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9B6B3A';
      ctx.beginPath(); ctx.ellipse(0, -2, 17, 19, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7A5028';
      ctx.beginPath(); ctx.ellipse(0, -10, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.ellipse(0, 7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.arc(-7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-6, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -4, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#C8956A';
      ctx.beginPath(); ctx.arc(-6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(6, -7, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2E2A28';
      ctx.beginPath(); ctx.ellipse(0, 4, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#6A4020'; ctx.lineWidth = 1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-3, 8); ctx.quadraticCurveTo(0, 11, 3, 8); ctx.stroke();
    }

    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════════════
  //  SHOOT-'EM-UP MODEL  (continuous, delta-time driven)
  // ════════════════════════════════════════════════════════════════════
  // The ship sits on the left; enemies stream in from the right. Coords are
  // CSS pixels of the play area; the GameScreen drives field size + render.

  var ENEMY_TYPES = ['meteor', 'triship', 'squid', 'shooter'];
  var FIRE_INTERVAL = 0.22;   // primary auto-fire cadence (s)
  var LASER_INTERVAL = 0.12;  // faster cadence while laser buff is active
  var BULLET_SPEED = 480;
  var EBULLET_SPEED = 200;
  var MISSILE_SPEED = 360;
  var MAX_LIVES = 5;

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Build a level's spawn timeline + boss. More & faster enemies each level.
  function buildLevel(level, h) {
    var count = 6 + level * 3;
    var interval = Math.max(0.55, 1.45 - level * 0.09);
    var speed = 70 + level * 7;
    var marginY = 40, spanY = Math.max(60, h - marginY * 2);
    var timeline = [];
    for (var i = 0; i < count; i++) {
      // Weighted type pick — tougher enemies appear from later levels.
      var roll = Math.random();
      var type;
      if (level <= 1)      type = roll < 0.6 ? 'meteor' : 'triship';
      else if (level <= 3) type = roll < 0.4 ? 'meteor' : roll < 0.72 ? 'triship' : roll < 0.9 ? 'squid' : 'shooter';
      else                 type = roll < 0.28 ? 'meteor' : roll < 0.55 ? 'triship' : roll < 0.78 ? 'squid' : 'shooter';
      timeline.push({
        t: 0.8 + i * interval,
        type: type,
        y: marginY + Math.random() * spanY,
        speed: speed,
      });
    }
    return {
      timeline: timeline,
      duration: 0.8 + count * interval + 0.6,
      boss: { hp: 26 + level * 10, speed: 46 + level * 4 },
    };
  }

  function spawnEnemy(s, ev) {
    var t = ev.type, e;
    var base = { x: s.w + 30, y: ev.y, vx: -ev.speed, vy: 0, type: t, fireCd: rand(0.8, 1.8), t: 0 };
    if (t === 'meteor')      e = Object.assign(base, { r: 12, hp: 1, points: 5,  vx: -ev.speed * 1.15, vy: rand(-18, 18), spin: rand(-3, 3), fires: false });
    else if (t === 'triship') e = Object.assign(base, { r: 13, hp: 1, points: 10, amp: rand(26, 54), freq: rand(1.6, 2.6), phase: Math.random() * 6.28, baseY: ev.y, fires: s.level >= 2 });
    else if (t === 'squid')   e = Object.assign(base, { r: 15, hp: 2, points: 15, vx: -ev.speed * 0.72, fires: true });
    else                      e = Object.assign(base, { r: 14, hp: 2, points: 20, hover: s.w * (0.55 + Math.random() * 0.12), fires: true }); // shooter
    s.enemies.push(e);
  }
  // `level` is read by spawnEnemy for triship fire-gating; kept in module scope per state.
  var level = 1;

  function makeSpaceState(opts) {
    opts = opts || {};
    level = opts.level || 1;
    var w = opts.w || 360, h = opts.h || 560;
    var lv = buildLevel(level, h);
    var s = {
      w: w, h: h,
      level: level,
      ship: { x: w * 0.16, y: h * 0.5, r: 15 },
      bullets: [], ebullets: [], enemies: [], powerups: [], particles: [], missiles: [],
      boss: null, bossSpawned: false, bossDefeated: false,
      timeline: lv.timeline, spawnIdx: 0, waveTime: 0, levelDur: lv.duration, bossCfg: lv.boss,
      fireCd: 0,
      score: opts.score || 0,
      lives: opts.lives || 3,
      specials: opts.specials != null ? opts.specials : 2,  // homing-missile charges
      laserTime: 0, shieldTime: 0, invuln: 0,
      starOff: 0,
      alive: true,
      lastMilestone: 0,
    };
    return s;
  }

  function setField(s, w, h) {
    if (!s) return;
    s.w = w; s.h = h;
    if (s.ship.y > h - 10) s.ship.y = h - 10;
  }

  function addExplosion(s, x, y, color, n) {
    n = n || 8;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.28, sp = rand(40, 180);
      s.particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.3, 0.6), max: 0.6, color: color, r: rand(1.5, 3.5) });
    }
  }

  function nearestTarget(s, x, y) {
    var best = null, bd = Infinity;
    for (var i = 0; i < s.enemies.length; i++) {
      var e = s.enemies[i], d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
      if (d < bd) { bd = d; best = e; }
    }
    if (s.boss && !s.boss.dying) { var bd2 = (s.boss.x - x) * (s.boss.x - x) + (s.boss.y - y) * (s.boss.y - y); if (bd2 < bd) best = s.boss; }
    return best;
  }

  // Fire a volley of homing missiles (consumes one special charge). Returns true if fired.
  function fireSpecial(s) {
    if (!s || !s.alive || s.specials <= 0) return false;
    s.specials--;
    for (var i = -1; i <= 1; i++) {
      s.missiles.push({ x: s.ship.x + 12, y: s.ship.y + i * 8, vx: MISSILE_SPEED * 0.7, vy: i * 60, r: 5, life: 2.4 });
    }
    return true;
  }

  function damageEnemy(s, e, dmg, ev) {
    e.hp -= dmg;
    if (e.hp <= 0) {
      ev.kills++;
      s.score += e.points;
      addExplosion(s, e.x, e.y, charColorForEnemy(e), 10);
      // Power-up drop (~16%).
      if (Math.random() < 0.16) {
        var types = ['missile', 'laser', 'shield', 'life'];
        var pt = types[Math.floor(Math.random() * (s.lives >= MAX_LIVES ? 3 : 4))];
        s.powerups.push({ x: e.x, y: e.y, vx: -70, r: 11, type: pt, t: 0 });
      }
      var idx = s.enemies.indexOf(e);
      if (idx >= 0) s.enemies.splice(idx, 1);
      return true;
    }
    e.flash = 0.08;
    return false;
  }

  function charColorForEnemy(e) {
    return e.type === 'meteor' ? '#A88B6A' : e.type === 'triship' ? '#E8755C' : e.type === 'squid' ? '#9B6BD6' : '#4FA3E0';
  }

  function hitShip(s, ev) {
    if (s.shieldTime > 0 || s.invuln > 0) return;
    s.lives--;
    s.invuln = 1.6;
    addExplosion(s, s.ship.x, s.ship.y, '#E8755C', 14);
    ev.hit = true;
    if (s.lives <= 0) { s.alive = false; ev.died = true; }
  }

  // Advance the whole world by dt seconds. `input` = { firing, dt }. Returns
  // an events object the GameScreen turns into sounds.
  function updateGame(s, dt, input) {
    var ev = { kills: 0, shots: 0, hit: false, died: false, levelClear: false, powerup: false, milestone: false };
    if (!s || !s.alive) return ev;
    dt = Math.min(dt, 0.05);
    input = input || {};

    s.starOff = (s.starOff + dt * 40) % 1000;
    if (s.laserTime > 0) s.laserTime -= dt;
    if (s.shieldTime > 0) s.shieldTime -= dt;
    if (s.invuln > 0) s.invuln -= dt;

    // ── Primary auto-fire ──────────────────────────────────────────
    s.fireCd -= dt;
    if (input.firing && s.fireCd <= 0) {
      var laser = s.laserTime > 0;
      s.fireCd = laser ? LASER_INTERVAL : FIRE_INTERVAL;
      s.bullets.push({ x: s.ship.x + 14, y: s.ship.y, vx: BULLET_SPEED, vy: 0, r: laser ? 6 : 4, dmg: laser ? 2 : 1, pierce: laser });
      ev.shots++;
    }

    // ── Spawn from the timeline ────────────────────────────────────
    s.waveTime += dt;
    while (s.spawnIdx < s.timeline.length && s.timeline[s.spawnIdx].t <= s.waveTime) {
      spawnEnemy(s, s.timeline[s.spawnIdx]); s.spawnIdx++;
    }
    // Boss appears once the wave is exhausted and the field is clear.
    if (!s.bossSpawned && s.spawnIdx >= s.timeline.length && s.enemies.length === 0) {
      s.bossSpawned = true;
      s.boss = { x: s.w + 60, y: s.h * 0.5, r: 38, hp: s.bossCfg.hp, maxHp: s.bossCfg.hp, vy: s.bossCfg.speed, fireCd: 1.2, t: 0, entering: true, dying: false };
    }

    // ── Player bullets ─────────────────────────────────────────────
    for (var i = s.bullets.length - 1; i >= 0; i--) {
      var b = s.bullets[i]; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x > s.w + 20) { s.bullets.splice(i, 1); continue; }
      var consumed = false;
      for (var j = s.enemies.length - 1; j >= 0; j--) {
        var en = s.enemies[j];
        if (Math.hypot(b.x - en.x, b.y - en.y) < b.r + en.r) {
          damageEnemy(s, en, b.dmg, ev);
          if (!b.pierce) { consumed = true; break; }
        }
      }
      if (!consumed && s.boss && !s.boss.dying && b.x > s.boss.x - s.boss.r && Math.hypot(b.x - s.boss.x, b.y - s.boss.y) < b.r + s.boss.r) {
        damageBoss(s, b.dmg, ev); if (!b.pierce) consumed = true;
      }
      if (consumed) s.bullets.splice(i, 1);
    }

    // ── Homing missiles ────────────────────────────────────────────
    for (var m = s.missiles.length - 1; m >= 0; m--) {
      var mi = s.missiles[m]; mi.life -= dt;
      var tgt = nearestTarget(s, mi.x, mi.y);
      if (tgt) {
        var ang = Math.atan2(tgt.y - mi.y, tgt.x - mi.x);
        var cur = Math.atan2(mi.vy, mi.vx);
        var na = cur + Math.max(-4 * dt, Math.min(4 * dt, Math.atan2(Math.sin(ang - cur), Math.cos(ang - cur))));
        mi.vx = Math.cos(na) * MISSILE_SPEED; mi.vy = Math.sin(na) * MISSILE_SPEED;
      }
      mi.x += mi.vx * dt; mi.y += mi.vy * dt;
      if (mi.life <= 0 || mi.x > s.w + 30 || mi.x < -30 || mi.y < -30 || mi.y > s.h + 30) { s.missiles.splice(m, 1); continue; }
      var hit = false;
      for (var k = s.enemies.length - 1; k >= 0; k--) {
        if (Math.hypot(mi.x - s.enemies[k].x, mi.y - s.enemies[k].y) < mi.r + s.enemies[k].r) { damageEnemy(s, s.enemies[k], 3, ev); hit = true; break; }
      }
      if (!hit && s.boss && !s.boss.dying && Math.hypot(mi.x - s.boss.x, mi.y - s.boss.y) < mi.r + s.boss.r) { damageBoss(s, 3, ev); hit = true; }
      if (hit) { addExplosion(s, mi.x, mi.y, '#F4D58D', 6); s.missiles.splice(m, 1); }
    }

    // ── Enemies ────────────────────────────────────────────────────
    for (var e2 = s.enemies.length - 1; e2 >= 0; e2--) {
      var e = s.enemies[e2]; e.t += dt;
      if (e.flash > 0) e.flash -= dt;
      if (e.type === 'triship') { e.x += e.vx * dt; e.y = e.baseY + Math.sin(e.t * e.freq + e.phase) * e.amp; }
      else if (e.type === 'squid') { e.x += e.vx * dt; e.y += Math.sign(s.ship.y - e.y) * 55 * dt; }
      else if (e.type === 'shooter') {
        if (e.x > e.hover) e.x += e.vx * dt; else e.y += Math.sin(e.t * 2) * 30 * dt;
      } else { e.x += e.vx * dt; e.y += e.vy * dt; }

      // Enemy fire (aimed at the ship).
      if (e.fires) {
        e.fireCd -= dt;
        if (e.fireCd <= 0 && e.x < s.w && e.x > s.ship.x) {
          e.fireCd = rand(1.1, 2.4) - Math.min(1.0, s.level * 0.08);
          var a2 = Math.atan2(s.ship.y - e.y, s.ship.x - e.x);
          s.ebullets.push({ x: e.x - e.r, y: e.y, vx: Math.cos(a2) * EBULLET_SPEED, vy: Math.sin(a2) * EBULLET_SPEED, r: 4 });
        }
      }

      // Collide with ship — the enemy is destroyed on contact regardless of shield.
      if (Math.hypot(e.x - s.ship.x, e.y - s.ship.y) < e.r + s.ship.r) {
        hitShip(s, ev);
        damageEnemy(s, e, 999, ev);
        continue;
      }
      if (e.x < -40) s.enemies.splice(e2, 1);
    }

    // ── Boss ───────────────────────────────────────────────────────
    if (s.boss) updateBoss(s, dt, ev);

    // ── Enemy bullets ──────────────────────────────────────────────
    for (var eb = s.ebullets.length - 1; eb >= 0; eb--) {
      var b2 = s.ebullets[eb]; b2.x += b2.vx * dt; b2.y += b2.vy * dt;
      if (b2.x < -20 || b2.x > s.w + 20 || b2.y < -20 || b2.y > s.h + 20) { s.ebullets.splice(eb, 1); continue; }
      if (Math.hypot(b2.x - s.ship.x, b2.y - s.ship.y) < b2.r + s.ship.r) { hitShip(s, ev); s.ebullets.splice(eb, 1); }
    }

    // ── Power-ups ──────────────────────────────────────────────────
    for (var p = s.powerups.length - 1; p >= 0; p--) {
      var pu = s.powerups[p]; pu.t += dt; pu.x += pu.vx * dt; pu.y += Math.sin(pu.t * 3) * 20 * dt;
      if (pu.x < -30) { s.powerups.splice(p, 1); continue; }
      if (Math.hypot(pu.x - s.ship.x, pu.y - s.ship.y) < pu.r + s.ship.r + 4) {
        applyPowerup(s, pu.type); ev.powerup = true; s.powerups.splice(p, 1);
      }
    }

    // ── Particles ──────────────────────────────────────────────────
    for (var pa = s.particles.length - 1; pa >= 0; pa--) {
      var q = s.particles[pa]; q.life -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.92; q.vy *= 0.92;
      if (q.life <= 0) s.particles.splice(pa, 1);
    }

    // Milestone chime every 250 pts.
    if (Math.floor(s.score / 250) > s.lastMilestone) { s.lastMilestone = Math.floor(s.score / 250); ev.milestone = true; }

    // Level cleared once the boss is gone.
    if (s.bossDefeated && s.particles.length === 0) ev.levelClear = true;

    return ev;
  }

  function applyPowerup(s, type) {
    if (type === 'missile') s.specials = Math.min(9, s.specials + 2);
    else if (type === 'laser') s.laserTime = 6;
    else if (type === 'shield') s.shieldTime = 5;
    else if (type === 'life') s.lives = Math.min(MAX_LIVES, s.lives + 1);
  }

  function damageBoss(s, dmg, ev) {
    if (!s.boss || s.boss.dying) return;
    s.boss.hp -= dmg; s.boss.flash = 0.07;
    if (s.boss.hp <= 0) {
      s.boss.dying = true;
      s.score += 150 + s.level * 50;
      ev.kills++;
      addExplosion(s, s.boss.x, s.boss.y, '#F4D58D', 26);
    }
  }

  function updateBoss(s, dt, ev) {
    var bo = s.boss; bo.t += dt;
    if (bo.flash > 0) bo.flash -= dt;
    if (bo.dying) {
      // Death throes then award level clear.
      bo.deadT = (bo.deadT || 0) + dt;
      if (Math.random() < 0.3) addExplosion(s, bo.x + rand(-30, 30), bo.y + rand(-30, 30), '#E8755C', 5);
      if (bo.deadT > 0.9) { s.boss = null; s.bossDefeated = true; }
      return;
    }
    if (bo.entering) { bo.x -= 80 * dt; if (bo.x <= s.w * 0.78) { bo.x = s.w * 0.78; bo.entering = false; } }
    else {
      bo.y += bo.vy * dt;
      if (bo.y < 60) { bo.y = 60; bo.vy = Math.abs(bo.vy); }
      if (bo.y > s.h - 60) { bo.y = s.h - 60; bo.vy = -Math.abs(bo.vy); }
      bo.fireCd -= dt;
      if (bo.fireCd <= 0) {
        bo.fireCd = Math.max(0.7, 1.6 - s.level * 0.08);
        // Spread of 3–5 aimed bullets.
        var n = 3 + Math.min(2, Math.floor(s.level / 2));
        var base = Math.atan2(s.ship.y - bo.y, s.ship.x - bo.x);
        for (var i = 0; i < n; i++) {
          var a = base + (i - (n - 1) / 2) * 0.22;
          s.ebullets.push({ x: bo.x - bo.r, y: bo.y, vx: Math.cos(a) * EBULLET_SPEED, vy: Math.sin(a) * EBULLET_SPEED, r: 5 });
        }
      }
    }
    // Boss body contact.
    if (Math.hypot(bo.x - s.ship.x, bo.y - s.ship.y) < bo.r + s.ship.r) hitShip(s, ev);
  }

  // ── SCORES & STATS (per character, with spacl- keys) ───────────────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('spacl-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('spacl-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('spacl-stats') || '{}'); } catch (_) { return { games: 0, bestLevel: 0 }; }
  }
  function recordGame(level) {
    var s = loadStats(); s.games = (s.games || 0) + 1;
    if (level && level > (s.bestLevel || 0)) s.bestLevel = level;
    localStorage.setItem('spacl-stats', JSON.stringify(s));
  }

  return {
    CHARACTERS: CHARACTERS, charColor: charColor,
    drawCharacter: drawCharacter, drawFace: drawFace, charColorForEnemy: charColorForEnemy,
    makeSpaceState: makeSpaceState, updateGame: updateGame, setField: setField, fireSpecial: fireSpecial,
    MAX_LIVES: MAX_LIVES,
    loadHighScores: loadHighScores, saveHighScore: saveHighScore, getGlobalHi: getGlobalHi,
    loadStats: loadStats, recordGame: recordGame,
  };
})();
