// ROUTL — Game engine: pets (shared), front-face portraits, and the
// "Pirate Passage" grid route-planning model — time your steps past
// patrolling pirate ships to reach the treasure. Exposed as window.RoutlGame.
window.RoutlGame = (function () {

  // ── CHARACTERS (the four shared pets — captain the boat) ───────────
  var CHARACTERS = [
    { id: 'B', name: 'Bebe',   species: 'Golden Retriever',        color: '#F4B942' },
    { id: 'E', name: 'Bambi',  species: 'Yandl Cat',               color: '#E8755C' },
    { id: 'N', name: 'Nene',   species: 'King Charles Cavalier',   color: '#4A4A4A' },
    { id: 'D', name: 'Dede',   species: 'Longhair Mini Dachshund', color: '#9B6B3A' },
  ];
  var CHAR_COLOR = { B: '#F4B942', E: '#E8755C', N: '#4A4A4A', D: '#9B6B3A' };
  function charColor(id) { return CHAR_COLOR[id] || '#E8755C'; }

  function leg(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }

  // ── SIDE-VIEW PETS (home-screen picker preview) — faces right ──────
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

  // ── FRONT-FACING FACE PORTRAITS (boat captain + leaderboard) ───────
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
  //  PIRATE-PASSAGE MODEL  (turn-based grid; pirates patrol fixed routes)
  // ════════════════════════════════════════════════════════════════════
  var PIRATE_COLORS = ['#E2483D', '#4FA3E0', '#8E5BD0', '#F39B36', '#3FA35A'];

  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }

  // Build a patrol: loop routes are closed cycles; pingpong bounces back.
  function makePirate(cells, mode, phase, color) {
    var seq = mode === 'loop' ? cells.slice() : cells.concat(cells.slice(1, -1).reverse());
    var ph = ((phase % seq.length) + seq.length) % seq.length;
    seq = seq.slice(ph).concat(seq.slice(0, ph));
    return { mode: mode, seq: seq, period: seq.length, color: color };
  }
  function pirateAt(p, t) { return p.seq[((t % p.period) + p.period) % p.period]; }

  function eq(a, b) { return a.x === b.x && a.y === b.y; }
  function adj(a, b) { return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) === 1; }

  // Is (x,y) occupied by any pirate at tick t?
  function occupied(pirates, x, y, t) {
    for (var i = 0; i < pirates.length; i++) { var c = pirateAt(pirates[i], t); if (c.x === x && c.y === y) return true; }
    return false;
  }
  // Would moving cur→next between tick t and t+1 swap places with a pirate?
  function swaps(pirates, cur, next, t) {
    for (var i = 0; i < pirates.length; i++) {
      var a = pirateAt(pirates[i], t), b = pirateAt(pirates[i], t + 1);
      if (a.x === next.x && a.y === next.y && b.x === cur.x && b.y === cur.y) return true;
    }
    return false;
  }

  // Time-expanded BFS → minimum moves from start to treasure, or -1.
  function solve(board) {
    var pirates = board.pirates, P = 1;
    for (var i = 0; i < pirates.length; i++) P = lcm(P, pirates[i].period);
    if (P > 360) P = 360;
    var start = board.start, treasure = board.treasure;
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    var q = [{ x: start.x, y: start.y, t: 0, d: 0 }];
    var seen = {}; seen[start.x + ',' + start.y + ',0'] = true;
    var head = 0;
    while (head < q.length) {
      var cur = q[head++];
      if (cur.x === treasure.x && cur.y === treasure.y) return cur.d;
      if (cur.d > board.cols * board.rows + P) break;
      var nt = cur.t + 1;
      for (var k = 0; k < 4; k++) {
        var nx = cur.x + DIRS[k][0], ny = cur.y + DIRS[k][1];
        if (nx < 0 || ny < 0 || nx >= board.cols || ny >= board.rows) continue;
        if (board.blocked[ny * board.cols + nx]) continue;
        if (occupied(pirates, nx, ny, nt)) continue;
        if (swaps(pirates, { x: cur.x, y: cur.y }, { x: nx, y: ny }, cur.t)) continue;
        var key = nx + ',' + ny + ',' + (nt % P);
        if (seen[key]) continue;
        seen[key] = true;
        q.push({ x: nx, y: ny, t: nt, d: cur.d + 1 });
      }
    }
    return -1;
  }

  function rnd(n) { return Math.floor(Math.random() * n); }

  // Generate one solvable board for a level (retry until the solver agrees).
  function genBoard(level) {
    var cols = 5 + Math.min(3, Math.floor(level / 2));
    var rows = 6 + Math.min(4, Math.floor((level + 1) / 2));
    var pirateCount = Math.min(5, 1 + Math.floor((level + 1) / 1.5));

    for (var attempt = 0; attempt < 80; attempt++) {
      var start = { x: rnd(cols), y: rows - 1 };
      var treasure = { x: rnd(cols), y: 0 };
      var blocked = new Array(cols * rows).fill(false);
      var pirates = [];
      var used = {};
      used[start.x + ',' + start.y] = used[treasure.x + ',' + treasure.y] = true;

      var ok = true;
      for (var pc = 0; pc < pirateCount; pc++) {
        var pr = tryPirate(cols, rows, used, pirates.length, level);
        if (!pr) { ok = false; break; }
        pirates.push(pr.pirate);
        for (var u = 0; u < pr.cells.length; u++) used[pr.cells[u].x + ',' + pr.cells[u].y] = true;
      }
      if (!ok) continue;

      var board = { cols: cols, rows: rows, start: start, treasure: treasure, blocked: blocked, pirates: pirates };
      var opt = solve(board);
      if (opt >= Math.max(3, rows - 1)) { board.optimal = opt; return board; }
    }
    // Fallback — no pirates, guaranteed solvable.
    var fb = { cols: cols, rows: rows, start: { x: 0, y: rows - 1 }, treasure: { x: cols - 1, y: 0 }, blocked: new Array(cols * rows).fill(false), pirates: [] };
    fb.optimal = solve(fb);
    return fb;
  }

  // Try to place a single pirate clear of start/treasure (and other pirates).
  function tryPirate(cols, rows, used, idx, level) {
    for (var t = 0; t < 30; t++) {
      var kind = Math.random();
      var cells = [];
      if (kind < 0.45) {                       // horizontal pingpong
        var len = 2 + rnd(Math.min(3, cols - 2));
        var x0 = rnd(cols - len + 1), y = 1 + rnd(rows - 2);
        for (var i = 0; i < len; i++) cells.push({ x: x0 + i, y: y });
        return finalize(cells, 'pingpong', used, idx, level);
      } else if (kind < 0.8) {                 // vertical pingpong
        var len2 = 2 + rnd(Math.min(3, rows - 3));
        var y0 = 1 + rnd(rows - len2 - 1), x = rnd(cols);
        for (var j = 0; j < len2; j++) cells.push({ x: x, y: y0 + j });
        return finalize(cells, 'pingpong', used, idx, level);
      } else {                                  // 2×2 loop
        var lx = rnd(cols - 1), ly = 1 + rnd(rows - 3);
        cells = [{ x: lx, y: ly }, { x: lx + 1, y: ly }, { x: lx + 1, y: ly + 1 }, { x: lx, y: ly + 1 }];
        return finalize(cells, 'loop', used, idx, level);
      }
    }
    return null;
  }
  function finalize(cells, mode, used, idx, level) {
    for (var i = 0; i < cells.length; i++) if (used[cells[i].x + ',' + cells[i].y]) return null;
    return { pirate: makePirate(cells, mode, rnd(8), PIRATE_COLORS[idx % PIRATE_COLORS.length]), cells: cells };
  }

  // ── State ──────────────────────────────────────────────────────────
  function makeRouteState(opts) {
    opts = opts || {};
    var level = opts.level || 1;
    var board = genBoard(level);
    return {
      level: level, board: board,
      boat: { x: board.start.x, y: board.start.y },
      tick: 0, path: [{ x: board.start.x, y: board.start.y }], moves: 0,
      attempt: 1, score: opts.score || 0,
      status: 'playing',         // playing | won | failed | over
      lastLevelScore: 0, optimalBeaten: false,
    };
  }

  function pirateCellsAt(s, t) {
    var out = [];
    for (var i = 0; i < s.board.pirates.length; i++) { var c = pirateAt(s.board.pirates[i], t); out.push({ x: c.x, y: c.y, color: s.board.pirates[i].color }); }
    return out;
  }

  function canStep(s, nx, ny) {
    if (s.status !== 'playing') return false;
    if (nx < 0 || ny < 0 || nx >= s.board.cols || ny >= s.board.rows) return false;
    if (s.board.blocked[ny * s.board.cols + nx]) return false;
    return adj(s.boat, { x: nx, y: ny });
  }

  // Move one step. Returns { moved, collided, won, failed, over }.
  function step(s, nx, ny) {
    var ev = { moved: false, collided: false, won: false, failed: false, over: false };
    if (!canStep(s, nx, ny)) return ev;
    var cur = { x: s.boat.x, y: s.boat.y }, next = { x: nx, y: ny };
    var nt = s.tick + 1;
    s.tick = nt; s.moves++;
    s.boat = next; s.path.push(next);
    ev.moved = true;

    if (occupied(s.board.pirates, nx, ny, nt) || swaps(s.board.pirates, cur, next, nt - 1)) {
      ev.collided = true;
      if (s.attempt < 2) { ev.failed = true; resetAttempt(s); }
      else { ev.over = true; s.status = 'over'; }
      return ev;
    }
    if (nx === s.board.treasure.x && ny === s.board.treasure.y) {
      ev.won = true; s.status = 'won'; scoreLevel(s);
    }
    return ev;
  }

  function resetAttempt(s) {
    s.attempt++;
    s.boat = { x: s.board.start.x, y: s.board.start.y };
    s.tick = 0; s.moves = 0; s.path = [{ x: s.board.start.x, y: s.board.start.y }];
    s.status = 'playing';
  }

  function scoreLevel(s) {
    var opt = s.board.optimal, extra = Math.max(0, s.moves - opt);
    var base = 100 + s.level * 20;
    var eff = Math.max(0, 60 - extra * 12);
    var optBonus = (s.moves === opt) ? 50 : 0;
    var ls = Math.round((base + eff + optBonus) * (s.attempt === 1 ? 1 : 0.6));
    s.optimalBeaten = s.moves === opt;
    s.lastLevelScore = ls;
    s.score += ls;
  }

  function nextLevel(s) {
    var ns = makeRouteState({ level: s.level + 1, score: s.score });
    return ns;
  }

  // ── SCORES & STATS (per character, with routl- keys) ───────────────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('routl-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('routl-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() { var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0; }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('routl-stats') || '{}'); } catch (_) { return { games: 0, bestLevel: 0 }; }
  }
  function recordGame(level) {
    var s = loadStats(); s.games = (s.games || 0) + 1;
    if (level && level > (s.bestLevel || 0)) s.bestLevel = level;
    localStorage.setItem('routl-stats', JSON.stringify(s));
  }

  return {
    CHARACTERS: CHARACTERS, charColor: charColor,
    drawCharacter: drawCharacter, drawFace: drawFace,
    makeRouteState: makeRouteState, step: step, canStep: canStep, nextLevel: nextLevel,
    pirateCellsAt: pirateCellsAt, pirateAt: pirateAt, solve: solve,
    loadHighScores: loadHighScores, saveHighScore: saveHighScore, getGlobalHi: getGlobalHi,
    loadStats: loadStats, recordGame: recordGame,
  };
})();
