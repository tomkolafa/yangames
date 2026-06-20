// SNAKL — Game engine: pets (shared with Rundl), front-face portraits,
// the grid/snake model, food drawing, and scoring/stats.
// Exposed as window.SnaklGame. All drawing is procedural (no image files).
window.SnaklGame = (function () {

  // ── CHARACTERS (the four Rundl pets) ───────────────────────────────
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

  // ── FRONT-FACING FACE PORTRAITS (used for the snake head + leaderboard) ──
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

  // ── FOOD (cycles as the snake eats; drawn centered, caller rotates) ──
  // Each food is authored in a ~±18 unit box; drawFood scales it to the cell.
  function drawIceCream(ctx) {
    ctx.fillStyle = '#E7C08C';
    ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.lineTo(0, 18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(150,110,60,.5)'; ctx.lineWidth = 1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, 2); ctx.lineTo(3, 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, 2); ctx.lineTo(-3, 15); ctx.stroke();
    ctx.fillStyle = '#F39FB8';
    ctx.beginPath(); ctx.arc(0, -2, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FBE6C0';
    ctx.beginPath(); ctx.arc(0, -10, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.beginPath(); ctx.arc(-3, -4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E0506A';
    ctx.beginPath(); ctx.arc(0, -17, 2.6, 0, Math.PI * 2); ctx.fill();
  }
  function drawPizza(ctx) {
    ctx.fillStyle = '#F3C84B';
    ctx.beginPath(); ctx.moveTo(-13, -9); ctx.lineTo(13, -9); ctx.lineTo(0, 17); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#D89A44'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12, -9); ctx.lineTo(12, -9); ctx.stroke();
    ctx.fillStyle = '#CE402C';
    ctx.beginPath(); ctx.arc(-4, -2, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -3, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 6, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4E9A3B';
    ctx.beginPath(); ctx.arc(4, 1, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-5, 5, 1.1, 0, Math.PI * 2); ctx.fill();
  }
  function drawChickenWing(ctx) {
    ctx.strokeStyle = '#EFE6D0'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-2, 2); ctx.lineTo(-13, 13); ctx.stroke();
    ctx.fillStyle = '#EFE6D0';
    ctx.beginPath(); ctx.arc(-14, 11, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-11, 15, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C47E36';
    ctx.beginPath(); ctx.ellipse(3, -3, 12, 11, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#A8652A';
    ctx.beginPath(); ctx.ellipse(6, -6, 5, 4, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.beginPath(); ctx.ellipse(-2, -6, 3, 2, 0.3, 0, Math.PI * 2); ctx.fill();
  }
  function drawSushi(ctx) {
    ctx.fillStyle = '#F6F1E8';
    rrect(ctx, -14, 0, 28, 13, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.06)'; ctx.lineWidth = 1; rrect(ctx, -14, 0, 28, 13, 6); ctx.stroke();
    ctx.fillStyle = '#F18A5B';
    rrect(ctx, -15, -9, 30, 12, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-11, -6); ctx.lineTo(11, -6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-11, -2); ctx.lineTo(11, -2); ctx.stroke();
    ctx.fillStyle = '#33403A';
    rrect(ctx, -4, -10, 8, 25, 2); ctx.fill();
  }
  function drawFood(ctx, type, cell) {
    ctx.save();
    var sc = cell / 46;
    ctx.scale(sc, sc);
    if (type === 'iceCream')         drawIceCream(ctx);
    else if (type === 'pizza')       drawPizza(ctx);
    else if (type === 'chickenWing') drawChickenWing(ctx);
    else if (type === 'sushi')       drawSushi(ctx);
    ctx.restore();
  }

  // ── GRID / SNAKE MODEL ──────────────────────────────────────────────
  var COLS = 17, ROWS = 17, START_LEN = 3;
  var BASE_TICK_MS = 150, MIN_TICK_MS = 75;
  var FOODS = ['iceCream', 'pizza', 'chickenWing', 'sushi'];

  function speedFor(len) { return Math.max(MIN_TICK_MS, BASE_TICK_MS - (len - START_LEN) * 3.5); }

  function occupied(s) {
    var set = {};
    for (var i = 0; i < s.snake.length; i++) set[s.snake[i].x + ',' + s.snake[i].y] = true;
    return set;
  }

  function spawnFood(s) {
    var occ = occupied(s);
    var free = [];
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (!occ[x + ',' + y]) free.push({ x: x, y: y });
      }
    }
    if (!free.length) { s.food = null; return; }   // board full — effectively a win
    var c = free[Math.floor(Math.random() * free.length)];
    s.food = { x: c.x, y: c.y, type: FOODS[s.foodIndex % FOODS.length], angle: (Math.random() - 0.5) * 0.9 };
  }

  function makeSnakeState(solidWalls) {
    var cx = Math.floor(COLS / 2), cy = Math.floor(ROWS / 2);
    var s = {
      snake: [ { x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy } ],
      dir: { x: 1, y: 0 },
      queue: [],
      food: null,
      foodIndex: 0,
      grow: 0,
      score: 0,
      alive: true,
      solidWalls: !!solidWalls,
      tickMs: BASE_TICK_MS,
    };
    spawnFood(s);
    return s;
  }

  // Queue a turn, rejecting 180° reversals and no-ops (compared to the last
  // queued heading so two fast turns in one tick can't reverse into the body).
  function queueDir(s, nx, ny) {
    if (!s) return;
    var ref = s.queue.length ? s.queue[s.queue.length - 1] : s.dir;
    if (nx === -ref.x && ny === -ref.y) return;
    if (nx === ref.x && ny === ref.y) return;
    if (s.queue.length < 2) s.queue.push({ x: nx, y: ny });
  }

  // Advance one tick. Returns 'eat' | 'dead' | 'move'.
  function step(s) {
    if (!s || !s.alive) return 'dead';
    if (s.queue.length) s.dir = s.queue.shift();

    var head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Walls — wrap unless solid walls are on.
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      if (s.solidWalls) { s.alive = false; return 'dead'; }
      head.x = (head.x + COLS) % COLS;
      head.y = (head.y + ROWS) % ROWS;
    }

    // Self-collision — the tail vacates this tick unless we're growing.
    var n = s.snake.length;
    var ignoreTail = s.grow === 0;
    for (var i = 0; i < n; i++) {
      if (ignoreTail && i === n - 1) continue;
      if (s.snake[i].x === head.x && s.snake[i].y === head.y) { s.alive = false; return 'dead'; }
    }

    s.snake.unshift(head);

    if (s.food && head.x === s.food.x && head.y === s.food.y) {
      s.score += 1;
      s.grow += 1;
      s.foodIndex = (s.foodIndex + 1) % FOODS.length;
      spawnFood(s);
      return 'eat';
    }
    if (s.grow > 0) s.grow -= 1;
    else s.snake.pop();
    return 'move';
  }

  // ── SCORES & STATS (per character, mirrors Rundl with snakl- keys) ──
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('snakl-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('snakl-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('snakl-stats') || '{}'); } catch (_) { return { games: 0 }; }
  }
  function recordGame() {
    var s = loadStats(); s.games = (s.games || 0) + 1;
    localStorage.setItem('snakl-stats', JSON.stringify(s));
  }

  return {
    CHARACTERS, charColor,
    COLS, ROWS, START_LEN, BASE_TICK_MS, MIN_TICK_MS, FOODS,
    drawCharacter, drawFace, drawFood,
    makeSnakeState, queueDir, spawnFood, step, speedFor,
    loadHighScores, saveHighScore, getGlobalHi, loadStats, recordGame,
  };
})();
