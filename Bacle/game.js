// BACLE — Game engine: a Pac-Man-style maze chomper using the four shared pets.
// Exposed as window.BacleGame. All drawing is procedural (no image files).
// Pure logic (maze/actors/ghost-AI/levels) is separated from the canvas drawing,
// mirroring Snakl's game.js shape. The pet art is duplicated from Snakl per the
// CLAUDE.md "new game" contract so each game's bundle stays standalone.
window.BacleGame = (function () {

  // ── CHARACTERS (the four Rundl/Snakl pets) ─────────────────────────
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

  // ── FRONT-FACING FACE PORTRAITS (the pet's face — used as the Pac avatar) ──
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

  // ── MAZE ────────────────────────────────────────────────────────────
  // Tile kinds (stored in maze.tiles). PELLET layer is separate (maze.pellets).
  var TILE = { WALL: 0, PATH: 1, DOOR: 2, HOUSE: 3, TUNNEL: 4 };
  var PELLET = { NONE: 0, DOT: 1, ENERGIZER: 2 };

  // One shared maze. 19 cols × 19 rows. Left/right symmetric, central ghost
  // house, four corner energizers, one tunnel row (row 7) that wraps L↔R.
  // The col-1 / col-17 vertical corridors + open corridor rows form a fully
  // connected backbone (validateMaze() flood-fills to confirm clearability).
  // Legend: # wall · . pellet · o energizer · (space) empty path ·
  //         - ghost door · = house interior · T tunnel/wrap · P pac spawn ·
  //         1/2/3/4 blinky/pinky/inky/clyde spawn.
  var MAZE_MAIN = [
    '###################', // 0
    '#o...............o#', // 1
    '#.##.#.##.##.#.##.#', // 2
    '#.................#', // 3
    '#.##.###.#.###.##.#', // 4
    '#........#........#', // 5
    '#.##.###.#.###.##.#', // 6
    'T........1........T', // 7  tunnel row; blinky spawns above the door
    '#......##-##......#', // 8  house top + door
    '#......#234#......#', // 9  house interior: pinky / inky / clyde
    '#......#####......#', // 10 house bottom
    '#.................#', // 11
    '#.##.###.#.###.##.#', // 12
    '#........#........#', // 13
    '#.##.###.#.###.##.#', // 14
    '#.................#', // 15
    '#.##.#.##.##.#.##.#', // 16
    '#o.......P.......o#', // 17 pac spawn; corner energizers
    '###################', // 18
  ];
  var ROWS = MAZE_MAIN.length;
  var COLS = MAZE_MAIN[0].length;

  function parseMaze(rows, mods) {
    var cols = rows[0].length, nrows = rows.length;
    var tiles = new Uint8Array(cols * nrows);
    var pellets = new Uint8Array(cols * nrows);
    var pacSpawn = { x: 1, y: 1 };
    var ghostSpawns = {};
    var tunnelRows = [];
    var pelletCount = 0;
    var keyByDigit = { '1': 'blinky', '2': 'pinky', '3': 'inky', '4': 'clyde' };

    for (var y = 0; y < nrows; y++) {
      for (var x = 0; x < cols; x++) {
        var ch = rows[y][x];
        var i = y * cols + x;
        if (ch === '#')      { tiles[i] = TILE.WALL; }
        else if (ch === '-') { tiles[i] = TILE.DOOR; }
        else if (ch === '=') { tiles[i] = TILE.HOUSE; }
        else if (ch === 'T') { tiles[i] = TILE.TUNNEL; if (tunnelRows.indexOf(y) < 0) tunnelRows.push(y); }
        else if (ch === '.') { tiles[i] = TILE.PATH; pellets[i] = PELLET.DOT; pelletCount++; }
        else if (ch === 'o') { tiles[i] = TILE.PATH; pellets[i] = PELLET.ENERGIZER; pelletCount++; }
        else if (ch === 'P') { tiles[i] = TILE.PATH; pacSpawn = { x: x, y: y }; }
        else if (keyByDigit[ch]) { tiles[i] = TILE.HOUSE; ghostSpawns[keyByDigit[ch]] = { x: x, y: y }; }
        else                 { tiles[i] = TILE.PATH; } // space
      }
    }

    var maze = {
      cols: cols, rows: nrows, tiles: tiles, pellets: pellets,
      pelletCount: pelletCount, pacSpawn: pacSpawn, ghostSpawns: ghostSpawns,
      tunnelRows: tunnelRows,
    };

    // Per-level overlay patches (e.g. remove energizers). Applied after parse.
    if (mods && mods.length) {
      for (var m = 0; m < mods.length; m++) applyMod(maze, mods[m]);
    }
    return maze;
  }

  // Mutate a single tile. `to` is a legend char (currently only '.'/' '/'#' used).
  function applyMod(maze, mod) {
    var i = mod.y * maze.cols + mod.x;
    var was = maze.pellets[i];
    if (mod.to === '.') { maze.tiles[i] = TILE.PATH; if (was !== PELLET.DOT) { maze.pellets[i] = PELLET.DOT; if (was === PELLET.NONE) maze.pelletCount++; } }
    else if (mod.to === ' ') { maze.tiles[i] = TILE.PATH; if (was !== PELLET.NONE) { maze.pellets[i] = PELLET.NONE; maze.pelletCount--; } }
    else if (mod.to === '#') { if (was !== PELLET.NONE) { maze.pellets[i] = PELLET.NONE; maze.pelletCount--; } maze.tiles[i] = TILE.WALL; }
  }

  function tileAt(maze, x, y) {
    if (y < 0 || y >= maze.rows || x < 0 || x >= maze.cols) return TILE.WALL;
    return maze.tiles[y * maze.cols + x];
  }
  // Is (x,y) blocked for movement? Doors block everyone except ghosts that may
  // use them (eaten ghosts returning home, or ghosts leaving the house).
  function isWall(maze, x, y, canUseDoor) {
    var t = tileAt(maze, x, y);
    if (t === TILE.WALL) return true;
    if (t === TILE.DOOR) return !canUseDoor;
    return false;
  }
  // Wrap x across a tunnel row; otherwise leave as-is (border walls block).
  function wrapX(maze, x, y) {
    if (maze.tunnelRows.indexOf(y) >= 0) {
      if (x < 0) return maze.cols - 1;
      if (x >= maze.cols) return 0;
    }
    return x;
  }

  // Flood-fill from pacSpawn over pac-walkable tiles; warn if any pellet is
  // unreachable (a broken/disconnected maze can never be cleared).
  function validateMaze(maze) {
    var seen = new Uint8Array(maze.cols * maze.rows);
    var stack = [maze.pacSpawn];
    seen[maze.pacSpawn.y * maze.cols + maze.pacSpawn.x] = 1;
    var reachablePellets = 0;
    while (stack.length) {
      var c = stack.pop();
      var idx = c.y * maze.cols + c.x;
      if (maze.pellets[idx] !== PELLET.NONE) reachablePellets++;
      var nbrs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (var k = 0; k < 4; k++) {
        var nx = wrapX(maze, c.x + nbrs[k][0], c.y);
        var ny = c.y + nbrs[k][1];
        if (ny < 0 || ny >= maze.rows) continue;
        var ni = ny * maze.cols + nx;
        if (seen[ni]) continue;
        if (isWall(maze, nx, ny, false)) continue;
        if (maze.tiles[ni] === TILE.HOUSE) continue;
        seen[ni] = 1; stack.push({ x: nx, y: ny });
      }
    }
    if (reachablePellets !== maze.pelletCount) {
      console.warn('BacleGame: ' + (maze.pelletCount - reachablePellets) +
        ' of ' + maze.pelletCount + ' pellets are unreachable — maze is not fully connected.');
    }
    return reachablePellets === maze.pelletCount;
  }

  // ── GHOSTS (procedural; colours echo the arcade four) ───────────────
  // scatter corners sit just outside the four maze corners.
  var GHOSTS = [
    { key: 'blinky', color: '#E8554E', name: 'Red',    scatter: { x: COLS - 2, y: 0 } },
    { key: 'pinky',  color: '#F3A9C8', name: 'Pink',   scatter: { x: 1,        y: 0 } },
    { key: 'inky',   color: '#79D0E0', name: 'Cyan',   scatter: { x: COLS - 1, y: ROWS - 1 } },
    { key: 'clyde',  color: '#F2B24B', name: 'Orange', scatter: { x: 0,        y: ROWS - 1 } },
  ];
  var FRIGHT_BLUE = '#3B5BDB';

  // ── LEVEL CONFIG + THEMES ───────────────────────────────────────────
  // Speeds are arcade-style px/sec assuming an ~18px cell; movement converts
  // to tiles/sec via SPEED_UNIT. Easy → hard: ghosts close the speed gap,
  // frightened time shrinks, scatter windows narrow. (Cruise-Elroy omitted.)
  var SPEED_UNIT = 18;
  function sched() {
    // default arcade-ish scatter/chase rhythm; per-level overrides shorten it.
    return [
      { mode: 'scatter', ms: 7000 }, { mode: 'chase', ms: 20000 },
      { mode: 'scatter', ms: 7000 }, { mode: 'chase', ms: 20000 },
      { mode: 'scatter', ms: 5000 }, { mode: 'chase', ms: Infinity },
    ];
  }
  var LEVELS = [
    { theme: 'desert',     name: 'Desert',     mazeMods: [],
      pacSpeed: 70, ghostSpeed: 60, frightSpeed: 38, tunnelSpeed: 34, frightenedMs: 7000, ghostCount: 4,
      schedule: [ {mode:'scatter',ms:7000},{mode:'chase',ms:20000},{mode:'scatter',ms:7000},{mode:'chase',ms:20000},{mode:'scatter',ms:5000},{mode:'chase',ms:Infinity} ] },
    { theme: 'dungeon',    name: 'Dungeon',    mazeMods: [],
      pacSpeed: 76, ghostSpeed: 68, frightSpeed: 40, tunnelSpeed: 36, frightenedMs: 6000, ghostCount: 4,
      schedule: [ {mode:'scatter',ms:7000},{mode:'chase',ms:20000},{mode:'scatter',ms:7000},{mode:'chase',ms:20000},{mode:'scatter',ms:5000},{mode:'chase',ms:Infinity} ] },
    { theme: 'rainforest', name: 'Rainforest', mazeMods: [],
      pacSpeed: 82, ghostSpeed: 76, frightSpeed: 44, tunnelSpeed: 40, frightenedMs: 4500, ghostCount: 4,
      schedule: [ {mode:'scatter',ms:6000},{mode:'chase',ms:20000},{mode:'scatter',ms:5000},{mode:'chase',ms:20000},{mode:'scatter',ms:5000},{mode:'chase',ms:Infinity} ] },
    { theme: 'heaven',     name: 'Heaven',     mazeMods: [ {x:1,y:17,to:'.'},{x:17,y:17,to:'.'} ],
      pacSpeed: 88, ghostSpeed: 84, frightSpeed: 48, tunnelSpeed: 44, frightenedMs: 3000, ghostCount: 4,
      schedule: [ {mode:'scatter',ms:5000},{mode:'chase',ms:20000},{mode:'scatter',ms:5000},{mode:'chase',ms:20000},{mode:'scatter',ms:3000},{mode:'chase',ms:Infinity} ] },
    { theme: 'hell',       name: 'Hell',       mazeMods: [ {x:1,y:1,to:'.'},{x:17,y:1,to:'.'},{x:1,y:17,to:'.'},{x:17,y:17,to:'.'} ],
      pacSpeed: 92, ghostSpeed: 92, frightSpeed: 52, tunnelSpeed: 48, frightenedMs: 1500, ghostCount: 4,
      schedule: [ {mode:'scatter',ms:3000},{mode:'chase',ms:25000},{mode:'scatter',ms:3000},{mode:'chase',ms:Infinity} ] },
  ];
  function levelConfig(i) { return LEVELS[Math.min(i, LEVELS.length - 1)]; }
  function levelCount() { return LEVELS.length; }

  // Per-level palette: drives ONLY the maze + background. The site theme
  // (clean-light/dark/classic/funky) colours the surrounding chrome/HUD.
  function themePalette(id) {
    switch (id) {
      case 'dungeon': return {
        bgTop: '#2B2F3A', bgBot: '#1A1D24', wall: '#5A6472', wallEdge: '#737E8E',
        pellet: '#CBD3DE', energizer: '#9FE2FF', door: '#A6B0C0', accent: '#9FB2CB', motif: 'bricks', dark: true };
      case 'rainforest': return {
        bgTop: '#1F3D2A', bgBot: '#10261A', wall: '#3E7A4E', wallEdge: '#57A86A',
        pellet: '#E7F6D5', energizer: '#BFFF8A', door: '#9ED6A8', accent: '#7FCF8A', motif: 'vines', dark: true };
      case 'heaven': return {
        bgTop: '#DCEBFF', bgBot: '#F6FAFF', wall: '#E7D79C', wallEdge: '#F5EBC0',
        pellet: '#B79A4C', energizer: '#FFC94D', door: '#D9C98E', accent: '#D8A84A', motif: 'clouds', dark: false };
      case 'hell': return {
        bgTop: '#3A0E0E', bgBot: '#160505', wall: '#7A2A1E', wallEdge: '#C0492E',
        pellet: '#FFD2A6', energizer: '#FF7A3D', door: '#C0492E', accent: '#FF6A3D', motif: 'lava', dark: true };
      default: return { // desert
        bgTop: '#F3E2B8', bgBot: '#E4C77F', wall: '#C9913F', wallEdge: '#E0AC57',
        pellet: '#7A5A2E', energizer: '#E0762A', door: '#B98233', accent: '#C97F2A', motif: 'dunes', dark: false };
    }
  }

  // ── STATE ───────────────────────────────────────────────────────────
  var DIRS = [ {x:0,y:-1}, {x:-1,y:0}, {x:0,y:1}, {x:1,y:0} ]; // UP, LEFT, DOWN, RIGHT (tie-break order)
  function isReverse(a, b) { return a.x === -b.x && a.y === -b.y && (a.x !== 0 || a.y !== 0); }

  function makeGameState(charId) {
    return {
      charId: charId || 'B',
      score: 0, lives: 3, level: 0, combo: 0,
      maze: null, pac: null, ghosts: [],
      mode: 'scatter', phaseIdx: 0, phaseTimer: 0, schedule: [],
      frightened: false, frightTimer: 0, frightTotal: 0,
      doorTile: { x: 9, y: 7 },
      fruit: null, fruitTimer: 0, fruitsShown: 0,
      won: false,
    };
  }

  // Build (or rebuild) a level: fresh maze + pellets, actors at spawns.
  function loadLevel(state, i) {
    state.level = i;
    var cfg = levelConfig(i);
    var maze = parseMaze(MAZE_MAIN, cfg.mazeMods);
    validateMaze(maze);
    state.maze = maze;
    // door exit = the path tile directly above the door tile
    var door = findDoor(maze);
    state.doorTile = { x: door.x, y: door.y - 1 };
    state.schedule = cfg.schedule.map(function (p) { return { mode: p.mode, ms: p.ms }; });
    state.phaseIdx = 0; state.phaseTimer = 0; state.mode = state.schedule[0].mode;
    state.frightened = false; state.frightTimer = 0;
    state.fruit = null; state.fruitTimer = 6000 + i * 500; state.fruitsShown = 0;
    state.combo = 0;
    spawnActors(state, cfg);
    return state;
  }

  function findDoor(maze) {
    for (var y = 0; y < maze.rows; y++)
      for (var x = 0; x < maze.cols; x++)
        if (maze.tiles[y * maze.cols + x] === TILE.DOOR) return { x: x, y: y };
    return { x: 9, y: 8 };
  }

  // Place pac + ghosts at their maze spawns. Stagger ghost-house release.
  function spawnActors(state, cfg) {
    var maze = state.maze;
    var p = maze.pacSpawn;
    state.pac = {
      tx: p.x, ty: p.y, px: p.x, py: p.y,
      dir: { x: 0, y: 0 }, next: { x: 0, y: 0 }, facing: { x: -1, y: 0 },
      moveDist: 0,
    };
    var releaseAt = { blinky: 0, pinky: 1500, inky: 4500, clyde: 8500 };
    state.ghosts = GHOSTS.slice(0, cfg.ghostCount || 4).map(function (g) {
      var sp = maze.ghostSpawns[g.key] || { x: state.doorTile.x, y: state.doorTile.y };
      var inHouse = g.key !== 'blinky';
      return {
        key: g.key, color: g.color, name: g.name, scatterTile: g.scatter,
        tx: sp.x, ty: sp.y, px: sp.x, py: sp.y,
        dir: { x: -1, y: 0 }, mode: state.mode,
        inHouse: inHouse, houseTimer: releaseAt[g.key] || 0,
        reverseQueued: false, homeBob: 0,
      };
    });
  }

  // After a death (lives remain): reset actors but keep pellets + score.
  function respawnActors(state) {
    spawnActors(state, levelConfig(state.level));
    state.frightened = false; state.frightTimer = 0; state.combo = 0;
    state.phaseIdx = 0; state.phaseTimer = 0; state.mode = state.schedule[0].mode;
  }

  // ── INPUT ───────────────────────────────────────────────────────────
  // Queue a turn for pac (the input buffer). Rejects 180° reversals only when
  // pac is mid-corridor; a reversal is always allowed (Pac-Man lets you flip).
  function queueDir(state, dx, dy) {
    if (!state || !state.pac) return;
    state.pac.next = { x: dx, y: dy };
  }

  // ── UPDATE ──────────────────────────────────────────────────────────
  // Advance the sim by dt seconds. Returns an events object; the screen reacts
  // (sound/score-display/phase). state.score + combos are mutated here.
  function update(state, dt) {
    var ev = { ate: 0, ghostsEaten: [], pacDied: false, levelClear: false, phaseChanged: false, fruitEaten: 0 };
    if (!state || !state.maze) return ev;
    var cfg = levelConfig(state.level);

    // 1) phase scheduler (scatter ↔ chase), paused while frightened
    if (!state.frightened) ev.phaseChanged = advancePhase(state, dt);

    // 2) frightened countdown
    if (state.frightened) tickFrightened(state, dt);

    // 3) ghost-house release timers
    for (var g = 0; g < state.ghosts.length; g++) {
      var gh = state.ghosts[g];
      if (gh.inHouse) {
        gh.houseTimer -= dt * 1000;
        gh.homeBob += dt * 6;
        if (gh.houseTimer <= 0) releaseGhost(state, gh);
      }
    }

    // 4) move pac
    movePac(state, state.pac, dt, cfg, ev);

    // 5) move ghosts
    for (var k = 0; k < state.ghosts.length; k++) {
      if (!state.ghosts[k].inHouse) moveGhost(state, state.ghosts[k], dt, cfg);
    }

    // 6) collisions (pac ↔ ghost)
    collideGhosts(state, ev);

    // 7) bonus fruit lifecycle
    tickFruit(state, dt, cfg);

    // 8) level clear?
    if (state.maze.pelletCount <= 0) ev.levelClear = true;

    return ev;
  }

  function advancePhase(state, dt) {
    var sc = state.schedule;
    if (state.phaseIdx >= sc.length) return false;
    state.phaseTimer += dt * 1000;
    var cur = sc[state.phaseIdx];
    if (cur.ms !== Infinity && state.phaseTimer >= cur.ms) {
      state.phaseIdx++;
      state.phaseTimer = 0;
      if (state.phaseIdx < sc.length) {
        state.mode = sc[state.phaseIdx].mode;
        // force every active, non-eaten ghost to reverse on the switch
        for (var i = 0; i < state.ghosts.length; i++) {
          var g = state.ghosts[i];
          if (!g.inHouse && g.mode !== 'eaten') { g.mode = state.mode; g.reverseQueued = true; }
        }
        return true;
      }
    }
    return false;
  }

  function startFrightened(state, cfg) {
    state.frightened = true;
    state.frightTimer = cfg.frightenedMs;
    state.frightTotal = cfg.frightenedMs;
    state.combo = 0;
    for (var i = 0; i < state.ghosts.length; i++) {
      var g = state.ghosts[i];
      if (!g.inHouse && g.mode !== 'eaten') { g.mode = 'frightened'; g.reverseQueued = true; }
    }
  }
  function tickFrightened(state, dt) {
    state.frightTimer -= dt * 1000;
    if (state.frightTimer <= 0) {
      state.frightened = false;
      for (var i = 0; i < state.ghosts.length; i++) {
        var g = state.ghosts[i];
        if (g.mode === 'frightened') g.mode = state.mode;
      }
    }
  }

  function releaseGhost(state, gh) {
    gh.inHouse = false;
    gh.tx = state.doorTile.x; gh.ty = state.doorTile.y;
    gh.px = gh.tx; gh.py = gh.ty;
    gh.dir = { x: -1, y: 0 };
    gh.mode = state.frightened ? 'frightened' : state.mode;
  }

  // Move an actor toward tile centres, making a decision each time it lands on
  // one. `decide(actor)` chooses the next dir at a centre. Returns distance moved.
  function stepActor(state, a, speedTiles, dt, decide, canUseDoor, onCenter) {
    var maze = state.maze;
    var remaining = speedTiles * dt;
    var moved = 0;
    var guard = 0;
    while (remaining > 1e-6 && guard < 8) {
      guard++;
      // if stopped, try to start via decision at the current centre
      if (a.dir.x === 0 && a.dir.y === 0) { decide(a); if (a.dir.x === 0 && a.dir.y === 0) break; }
      // distance to the next tile centre along the current heading
      var dist;
      if (a.dir.x !== 0) dist = a.dir.x > 0 ? (Math.floor(a.px) + 1 - a.px) : (a.px - (Math.ceil(a.px) - 1));
      else               dist = a.dir.y > 0 ? (Math.floor(a.py) + 1 - a.py) : (a.py - (Math.ceil(a.py) - 1));
      if (dist < 1e-6) dist = 1; // exactly on a centre, heading into next tile
      if (remaining < dist) {
        a.px += a.dir.x * remaining; a.py += a.dir.y * remaining;
        moved += remaining; remaining = 0;
      } else {
        a.px += a.dir.x * dist; a.py += a.dir.y * dist;
        moved += dist; remaining -= dist;
        a.px = Math.round(a.px); a.py = Math.round(a.py);
        a.tx = a.px; a.ty = a.py;
        // tunnel wrap at the row edges
        if (a.tx < 0 || a.tx >= maze.cols) {
          a.tx = wrapX(maze, a.tx, a.ty); a.px = a.tx;
        }
        if (onCenter) onCenter(a);
        decide(a);
        if (a.dir.x === 0 && a.dir.y === 0) break;
      }
    }
    return moved;
  }

  function movePac(state, pac, dt, cfg, ev) {
    var maze = state.maze;
    var speed = (state.frightened ? cfg.pacSpeed : cfg.pacSpeed) / SPEED_UNIT;
    var d = stepActor(state, pac, speed, dt, function (a) {
      // cornering / pre-turn: adopt the queued dir whenever it's open
      if ((a.next.x || a.next.y) && !isWall(maze, a.tx + a.next.x, a.ty + a.next.y, false)) {
        a.dir = { x: a.next.x, y: a.next.y };
      } else if (isWall(maze, a.tx + a.dir.x, a.ty + a.dir.y, false)) {
        a.dir = { x: 0, y: 0 }; // run into a wall → stop, keep the queued turn
      }
      if (a.dir.x || a.dir.y) a.facing = { x: a.dir.x, y: a.dir.y };
    }, false, function (a) {
      eatAt(state, a.tx, a.ty, cfg, ev); // eat pellet/energizer/fruit on each centre
    });
    pac.moveDist += d;
  }

  function eatAt(state, x, y, cfg, ev) {
    var maze = state.maze;
    var i = y * maze.cols + x;
    var p = maze.pellets[i];
    if (p === PELLET.DOT) {
      maze.pellets[i] = PELLET.NONE; maze.pelletCount--; state.score += 10; ev.ate = 'dot';
    } else if (p === PELLET.ENERGIZER) {
      maze.pellets[i] = PELLET.NONE; maze.pelletCount--; state.score += 50; ev.ate = 'energizer';
      startFrightened(state, cfg);
    }
    if (state.fruit && state.fruit.x === x && state.fruit.y === y) {
      ev.fruitEaten = state.fruit.points; state.score += state.fruit.points; state.fruit = null;
    }
  }

  function moveGhost(state, g, dt, cfg) {
    var maze = state.maze;
    var inTunnel = maze.tunnelRows.indexOf(g.ty) >= 0;
    var speed;
    if (g.mode === 'eaten') speed = cfg.ghostSpeed * 1.4 / SPEED_UNIT;
    else if (g.mode === 'frightened') speed = cfg.frightSpeed / SPEED_UNIT;
    else if (inTunnel) speed = cfg.tunnelSpeed / SPEED_UNIT;
    else speed = cfg.ghostSpeed / SPEED_UNIT;

    stepActor(state, g, speed, dt, function (a) {
      chooseGhostDir(state, a);
    }, true, function (a) {
      // an eaten ghost that reaches the door tile revives in the house
      if (a.mode === 'eaten' && a.tx === state.doorTile.x && a.ty === state.doorTile.y) {
        a.mode = state.frightened ? 'frightened' : state.mode;
      }
    });
  }

  // ── GHOST AI ────────────────────────────────────────────────────────
  function targetBlinky(state) { return { x: state.pac.tx, y: state.pac.ty }; }
  function targetPinky(state)  {
    var f = state.pac.facing;
    return { x: state.pac.tx + 4 * f.x, y: state.pac.ty + 4 * f.y };
  }
  function targetInky(state) {
    var f = state.pac.facing;
    var px = state.pac.tx + 2 * f.x, py = state.pac.ty + 2 * f.y;
    var blinky = ghostByKey(state, 'blinky');
    var bx = blinky ? blinky.tx : px, by = blinky ? blinky.ty : py;
    return { x: 2 * px - bx, y: 2 * py - by };
  }
  function targetClyde(state) {
    var c = ghostByKey(state, 'clyde');
    if (!c) return targetBlinky(state);
    var dx = c.tx - state.pac.tx, dy = c.ty - state.pac.ty;
    if (dx * dx + dy * dy > 64) return { x: state.pac.tx, y: state.pac.ty };
    return c.scatterTile;
  }
  var GHOST_TARGET = { blinky: targetBlinky, pinky: targetPinky, inky: targetInky, clyde: targetClyde };
  function ghostByKey(state, key) {
    for (var i = 0; i < state.ghosts.length; i++) if (state.ghosts[i].key === key) return state.ghosts[i];
    return null;
  }

  function ghostBlocked(maze, g, d) {
    var canUseDoor = (g.mode === 'eaten');
    return isWall(maze, g.tx + d.x, g.ty + d.y, canUseDoor);
  }

  // The whole ghost AI: pick the legal, non-reversing dir whose next tile is
  // closest (Euclidean) to this ghost's target; tie-break UP>LEFT>DOWN>RIGHT.
  function chooseGhostDir(state, g) {
    var maze = state.maze;
    if (g.mode === 'frightened') {
      var legal = [];
      for (var i = 0; i < DIRS.length; i++) {
        var d = DIRS[i];
        if (!g.reverseQueued && isReverse(d, g.dir)) continue;
        if (ghostBlocked(maze, g, d)) continue;
        legal.push(d);
      }
      g.reverseQueued = false;
      if (!legal.length) return; // dead end: keep heading (will reverse next centre)
      g.dir = legal[Math.floor(Math.random() * legal.length)];
      return;
    }
    var target;
    if (g.mode === 'eaten') target = state.doorTile;
    else if (g.mode === 'scatter') target = g.scatterTile;
    else target = (GHOST_TARGET[g.key] || targetBlinky)(state);

    var best = null, bestD = Infinity;
    for (var j = 0; j < DIRS.length; j++) {
      var dir = DIRS[j];
      if (!g.reverseQueued && isReverse(dir, g.dir)) continue;
      if (ghostBlocked(maze, g, dir)) continue;
      var nx = g.tx + dir.x, ny = g.ty + dir.y;
      var dd = (nx - target.x) * (nx - target.x) + (ny - target.y) * (ny - target.y);
      if (dd < bestD) { bestD = dd; best = dir; }
    }
    g.reverseQueued = false;
    if (best) g.dir = best;
  }

  // ── COLLISIONS ──────────────────────────────────────────────────────
  function collideGhosts(state, ev) {
    var pac = state.pac;
    for (var i = 0; i < state.ghosts.length; i++) {
      var g = state.ghosts[i];
      if (g.inHouse) continue;
      var dx = g.px - pac.px, dy = g.py - pac.py;
      if (dx * dx + dy * dy > 0.5 * 0.5) continue;
      if (g.mode === 'frightened') {
        var pts = 200 * Math.pow(2, state.combo); // 200,400,800,1600
        if (pts > 1600) pts = 1600;
        state.combo++;
        state.score += pts;
        ev.ghostsEaten.push(pts);
        g.mode = 'eaten';
      } else if (g.mode === 'eaten') {
        // intangible eyes returning home — no effect
      } else {
        ev.pacDied = true;
      }
    }
  }

  // ── BONUS FRUIT ─────────────────────────────────────────────────────
  // A themed treat appears mid-level (max 2 per level) just below the house;
  // points rise with level. Despawns if left too long.
  var FRUIT_BY_THEME = { desert: '🌵', dungeon: '💎', rainforest: '🍓', heaven: '🍇', hell: '🌶️' };
  function tickFruit(state, dt, cfg) {
    if (state.fruit) {
      state.fruit.ttl -= dt * 1000;
      if (state.fruit.ttl <= 0) state.fruit = null;
      return;
    }
    if (state.fruitsShown >= 2) return;
    state.fruitTimer -= dt * 1000;
    if (state.fruitTimer <= 0) {
      var spot = { x: state.doorTile.x, y: state.doorTile.y + 4 };
      // fall back to pac spawn area if that tile isn't a free path
      if (isWall(state.maze, spot.x, spot.y, false)) spot = state.maze.pacSpawn;
      var pts = 100 * (state.level + 1) + 100 * state.fruitsShown;
      state.fruit = { x: spot.x, y: spot.y, points: pts, ttl: 9000, glyph: FRUIT_BY_THEME[cfg.theme] || '🍒' };
      state.fruitsShown++;
      state.fruitTimer = 12000;
    }
  }

  // ── DRAWING ─────────────────────────────────────────────────────────
  // Layout: { cell, offX, offY } — board origin + tile size in CSS px.
  // Actor float coord px (tile units, px=tx ⇒ centred on tile tx) →
  // pixel centre = offX + (px+0.5)*cell.
  function cx(layout, px) { return layout.offX + (px + 0.5) * layout.cell; }
  function cy(layout, py) { return layout.offY + (py + 0.5) * layout.cell; }

  function drawWorld(ctx, state, layout, palette, timeMs, charId) {
    drawMazeBackground(ctx, state.maze, layout, palette, timeMs);
    drawMaze(ctx, state.maze, layout, palette);
    drawPellets(ctx, state.maze, layout, palette, timeMs);
    if (state.fruit) drawFruit(ctx, state.fruit, layout);
    for (var i = 0; i < state.ghosts.length; i++) {
      drawGhost(ctx, state.ghosts[i], state, layout, palette, timeMs);
    }
    drawPacActor(ctx, state.pac, charId, layout, palette);
  }

  function drawMazeBackground(ctx, maze, layout, palette, t) {
    var x0 = layout.offX, y0 = layout.offY, w = maze.cols * layout.cell, h = maze.rows * layout.cell;
    var grad = ctx.createLinearGradient(0, y0, 0, y0 + h);
    grad.addColorStop(0, palette.bgTop); grad.addColorStop(1, palette.bgBot);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
    ctx.fillStyle = grad; ctx.fillRect(x0, y0, w, h);
    var m = palette.motif;
    if (m === 'dunes') {
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2;
      for (var i = 0; i < 4; i++) {
        var yy = y0 + h * (0.25 + i * 0.2);
        ctx.beginPath(); ctx.moveTo(x0, yy);
        ctx.quadraticCurveTo(x0 + w * 0.5, yy - 14, x0 + w, yy); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,240,200,.5)';
      ctx.beginPath(); ctx.arc(x0 + w * 0.8, y0 + h * 0.12, w * 0.07, 0, Math.PI * 2); ctx.fill();
    } else if (m === 'bricks') {
      ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
      for (var by = 0; by < h; by += 22) {
        ctx.beginPath(); ctx.moveTo(x0, y0 + by); ctx.lineTo(x0 + w, y0 + by); ctx.stroke();
        for (var bx = (by % 44 === 0 ? 0 : 22); bx < w; bx += 44) {
          ctx.beginPath(); ctx.moveTo(x0 + bx, y0 + by); ctx.lineTo(x0 + bx, y0 + by + 22); ctx.stroke();
        }
      }
    } else if (m === 'vines') {
      ctx.strokeStyle = 'rgba(140,220,150,.16)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (var v = 0; v < 3; v++) {
        var vx = x0 + w * (0.2 + v * 0.3);
        ctx.beginPath(); ctx.moveTo(vx, y0);
        ctx.bezierCurveTo(vx + 22, y0 + h * 0.35, vx - 22, y0 + h * 0.65, vx, y0 + h); ctx.stroke();
      }
    } else if (m === 'clouds') {
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      var cloudY = [0.18, 0.5, 0.78];
      for (var c = 0; c < cloudY.length; c++) {
        var cxp = x0 + w * (0.2 + (c % 2) * 0.45), cyp = y0 + h * cloudY[c];
        ctx.beginPath();
        ctx.arc(cxp, cyp, 13, 0, Math.PI * 2);
        ctx.arc(cxp + 14, cyp + 3, 10, 0, Math.PI * 2);
        ctx.arc(cxp - 13, cyp + 3, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (m === 'lava') {
      ctx.strokeStyle = 'rgba(255,110,40,.32)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      var pulse = 0.5 + 0.5 * Math.sin(t / 500);
      for (var l = 0; l < 5; l++) {
        var ly = y0 + h * (0.15 + l * 0.18);
        ctx.globalAlpha = 0.4 + 0.3 * pulse;
        ctx.beginPath(); ctx.moveTo(x0, ly);
        ctx.lineTo(x0 + w * 0.3, ly + 8); ctx.lineTo(x0 + w * 0.6, ly - 6); ctx.lineTo(x0 + w, ly + 4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawMaze(ctx, maze, layout, palette) {
    var cell = layout.cell;
    var r = Math.max(2, cell * 0.32);
    for (var y = 0; y < maze.rows; y++) {
      for (var x = 0; x < maze.cols; x++) {
        var t = maze.tiles[y * maze.cols + x];
        var px = layout.offX + x * cell, py = layout.offY + y * cell;
        if (t === TILE.WALL) {
          ctx.fillStyle = palette.wall;
          rrect(ctx, px + 0.5, py + 0.5, cell - 1, cell - 1, r); ctx.fill();
          ctx.fillStyle = palette.wallEdge;
          rrect(ctx, px + 1.5, py + 1.5, cell - 3, Math.max(2, cell * 0.32), Math.max(1, r * 0.6)); ctx.fill();
        } else if (t === TILE.DOOR) {
          ctx.fillStyle = palette.door;
          ctx.fillRect(px + 2, py + cell * 0.42, cell - 4, Math.max(2, cell * 0.16));
        }
      }
    }
  }

  function drawPellets(ctx, maze, layout, palette, t) {
    var cell = layout.cell;
    var pulse = 0.7 + 0.3 * Math.sin(t / 220);
    for (var y = 0; y < maze.rows; y++) {
      for (var x = 0; x < maze.cols; x++) {
        var p = maze.pellets[y * maze.cols + x];
        if (!p) continue;
        var px = layout.offX + (x + 0.5) * cell, py = layout.offY + (y + 0.5) * cell;
        if (p === PELLET.DOT) {
          ctx.fillStyle = palette.pellet;
          ctx.beginPath(); ctx.arc(px, py, Math.max(1.4, cell * 0.1), 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = palette.energizer;
          ctx.beginPath(); ctx.arc(px, py, Math.max(3, cell * 0.26) * pulse, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }

  function drawFruit(ctx, fruit, layout) {
    var cell = layout.cell;
    ctx.save();
    ctx.font = Math.round(cell * 0.95) + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(fruit.glyph, cx(layout, fruit.x), cy(layout, fruit.y) + 1);
    ctx.restore();
  }

  // The chomping pet: clip to a disc minus an animated mouth wedge (pointing
  // along `dir`), then draw the pet's face inside, counter-rotated upright.
  function drawPac(ctx, charId, cell, dir, mouthOpen) {
    var r = cell * 0.52;
    var ang = (0.05 + 0.40 * mouthOpen) * Math.PI; // half-angle of the mouth gap; wide = "giant mouth"
    var rot = Math.atan2(dir.y, dir.x); // mouth points the way we travel (default right)
    ctx.save();
    ctx.rotate(rot);
    // body disc behind the face (the pet colour rim reads as the mouth edge)
    ctx.fillStyle = CHAR_COLOR[charId] || '#F4B942';
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, ang, Math.PI * 2 - ang); ctx.closePath(); ctx.fill();
    // clip to that same wedge, draw the face upright inside it
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, ang, Math.PI * 2 - ang); ctx.closePath(); ctx.clip();
    ctx.rotate(-rot);
    drawFace(ctx, charId, cell * 1.18);
    ctx.restore();
  }

  function drawPacActor(ctx, pac, charId, layout, palette) {
    var cell = layout.cell;
    // mouth chomps as pac travels; rests half-open when stopped
    var moving = (pac.dir.x || pac.dir.y);
    var mouthOpen = moving ? (0.5 + 0.5 * Math.sin(pac.moveDist * 6.0)) : 0.55;
    ctx.save();
    ctx.translate(cx(layout, pac.px), cy(layout, pac.py));
    drawPac(ctx, charId, cell, pac.facing, mouthOpen);
    ctx.restore();
  }

  function drawGhost(ctx, g, state, layout, palette, t) {
    var cell = layout.cell;
    var r = cell * 0.46;
    var x = cx(layout, g.px), y = cy(layout, g.py);
    if (g.inHouse) y += Math.sin(g.homeBob) * cell * 0.12;
    var frightened = g.mode === 'frightened';
    var eaten = g.mode === 'eaten';
    // flash white in the final ~1.5s of frightened
    var flashing = frightened && state.frightTimer < 1500 && Math.floor(t / 220) % 2 === 0;
    var body = eaten ? null : (frightened ? (flashing ? '#FFFFFF' : FRIGHT_BLUE) : g.color);

    ctx.save();
    ctx.translate(x, y);
    if (body) {
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r, Math.PI, 0); // dome
      // wavy skirt
      var feet = 4, baseY = r * 0.75;
      ctx.lineTo(r, baseY);
      for (var f = 0; f < feet; f++) {
        var wob = (Math.sin(t / 180 + f) * 0.12 + 1);
        var x1 = r - (f * 2 + 1) * (r / feet);
        var x2 = r - (f * 2 + 2) * (r / feet);
        ctx.lineTo(x1, baseY - r * 0.18 * wob);
        ctx.lineTo(x2, baseY);
      }
      ctx.closePath(); ctx.fill();
    }
    // eyes (always, even when eaten)
    var look = g.dir;
    var ex = look.x * r * 0.18, ey = look.y * r * 0.18;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.ellipse(-r * 0.34, -r * 0.2, r * 0.26, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( r * 0.34, -r * 0.2, r * 0.26, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    if (frightened && !eaten) {
      // frightened face: little glowing eyes + zigzag mouth
      ctx.fillStyle = flashing ? '#E2664F' : '#9FB6FF';
      ctx.beginPath(); ctx.arc(-r * 0.34, -r * 0.2, r * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc( r * 0.34, -r * 0.2, r * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = flashing ? '#E2664F' : '#9FB6FF'; ctx.lineWidth = Math.max(1, r * 0.12); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, r * 0.35);
      ctx.lineTo(-r * 0.25, r * 0.18); ctx.lineTo(0, r * 0.35);
      ctx.lineTo(r * 0.25, r * 0.18); ctx.lineTo(r * 0.5, r * 0.35);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#2A2E5A';
      ctx.beginPath(); ctx.arc(-r * 0.34 + ex, -r * 0.2 + ey, r * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc( r * 0.34 + ex, -r * 0.2 + ey, r * 0.13, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // ── SCORES & STATS (per character, bacle- keys; mirrors Snakl) ──────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('bacle-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('bacle-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('bacle-stats') || '{}'); } catch (_) { return { games: 0 }; }
  }
  function recordGame(extra) {
    var s = loadStats();
    s.games = (s.games || 0) + 1;
    if (extra && extra.cleared) s.cleared = (s.cleared || 0) + extra.cleared;
    if (extra && extra.won) s.wins = (s.wins || 0) + 1;
    localStorage.setItem('bacle-stats', JSON.stringify(s));
  }

  return {
    CHARACTERS: CHARACTERS, CHAR_COLOR: CHAR_COLOR, charColor: charColor,
    GHOSTS: GHOSTS, TILE: TILE, PELLET: PELLET, LEVELS: LEVELS, FRIGHT_BLUE: FRIGHT_BLUE,
    COLS: COLS, ROWS: ROWS, MAZE_MAIN: MAZE_MAIN,
    drawCharacter: drawCharacter, drawFace: drawFace,
    parseMaze: parseMaze, tileAt: tileAt, isWall: isWall, wrapX: wrapX, validateMaze: validateMaze,
    levelConfig: levelConfig, levelCount: levelCount, themePalette: themePalette,
    makeGameState: makeGameState, loadLevel: loadLevel, respawnActors: respawnActors, queueDir: queueDir,
    update: update,
    targetBlinky: targetBlinky, targetPinky: targetPinky, targetInky: targetInky, targetClyde: targetClyde,
    chooseGhostDir: chooseGhostDir,
    drawWorld: drawWorld, drawMaze: drawMaze, drawMazeBackground: drawMazeBackground,
    drawPellets: drawPellets, drawFruit: drawFruit, drawPac: drawPac, drawGhost: drawGhost,
    loadHighScores: loadHighScores, saveHighScore: saveHighScore, getGlobalHi: getGlobalHi,
    loadStats: loadStats, recordGame: recordGame,
  };
})();
