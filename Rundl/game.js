// BEND — Game engine: characters, canvas drawing, scoring, leaderboard
window.BendGame = (function () {

  // ── CHARACTERS ─────────────────────────────────────────────────────
  var CHARACTERS = [
    { id: 'B', name: 'Bebe',   species: 'Golden Retriever',        color: '#F4B942' },
    { id: 'E', name: 'Bambi',  species: 'Yandl Cat',               color: '#E8755C' },
    { id: 'N', name: 'Nene',   species: 'King Charles Cavalier',   color: '#4A4A4A' },
    { id: 'D', name: 'Dede',   species: 'Longhair Mini Dachshund', color: '#9B6B3A' },
  ];

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

  // ── BUDDY — Golden Retriever ────────────────────────────────────────
  // Origin: (0,0) = foot position, y negative = upward
  function drawBuddy(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.18) * 7;
    var tw = j ? 6 : Math.sin(f * 0.13) * 12;
    ctx.save();
    // Feathered tail (long, flowing)
    ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-15, -24);
    ctx.bezierCurveTo(-22, -34 + tw * 0.4, -28, -44 + tw * 0.6, -18, -54 + tw); ctx.stroke();
    // Tail fluff fringe
    ctx.strokeStyle = '#E8AA3A'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-20, -38 + tw * 0.4);
    ctx.quadraticCurveTo(-26, -46 + tw * 0.5, -19, -52 + tw); ctx.stroke();
    // Body (broad, fluffy)
    ctx.fillStyle = '#F0B030';
    ctx.beginPath(); ctx.ellipse(0, -22, 20, 13, 0, 0, Math.PI * 2); ctx.fill();
    // Back fur texture
    ctx.fillStyle = '#D4952A';
    ctx.beginPath(); ctx.ellipse(-6, -26, 12, 6, -0.15, 0, Math.PI * 2); ctx.fill();
    // Chest fluff (thick, lighter golden)
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath(); ctx.ellipse(12, -18, 10, 12, 0.25, 0, Math.PI * 2); ctx.fill();
    // Neck ruff
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath(); ctx.ellipse(10, -28, 8, 7, 0.1, 0, Math.PI * 2); ctx.fill();
    // Head (broader, rounder)
    ctx.fillStyle = '#F0B030';
    ctx.beginPath(); ctx.arc(17, -37, 13, 0, Math.PI * 2); ctx.fill();
    // Forehead lighter
    ctx.fillStyle = '#F5C84E';
    ctx.beginPath(); ctx.ellipse(17, -42, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Ears (large, floppy, feathered — left ear only)
    ctx.fillStyle = '#D4952A';
    ctx.beginPath(); ctx.ellipse(8, -30, 7, 13, -0.3, 0, Math.PI * 2); ctx.fill();
    // Ear inner highlight
    ctx.fillStyle = '#C8882A';
    ctx.beginPath(); ctx.ellipse(9, -28, 4, 9, -0.3, 0, Math.PI * 2); ctx.fill();
    // Muzzle (longer, golden retriever snout)
    ctx.fillStyle = '#FBDB7A';
    ctx.beginPath(); ctx.ellipse(26, -34, 8, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#3A2518';
    ctx.beginPath(); ctx.arc(21, -40, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(22, -41, 1.1, 0, Math.PI * 2); ctx.fill();
    // Eyebrow ridge
    ctx.strokeStyle = '#D4952A'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(21, -42, 4, Math.PI + 0.3, Math.PI * 2 - 0.3); ctx.stroke();
    // Nose (big, dark)
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.ellipse(33, -34, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Happy mouth
    ctx.strokeStyle = '#2E2A28'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(30, -32, 4, 0.1, Math.PI - 0.1); ctx.stroke();
    // Tongue (running, panting)
    if (!j) {
      ctx.fillStyle = '#E8657C';
      ctx.beginPath(); ctx.ellipse(29, -29, 3, 4.5, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F08090';
      ctx.beginPath(); ctx.ellipse(29, -28, 2, 3, 0.15, 0, Math.PI * 2); ctx.fill();
    }
    // Legs (feathered, golden)
    ctx.strokeStyle = '#F0B030'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -11, 14, -5); leg(ctx, 3, -11, -2, -5);
      leg(ctx, -7, -11, -4, -5); leg(ctx, -12, -11, -16, -5);
    } else {
      leg(ctx, 8, -11, 8 + sw, 0); leg(ctx, 3, -11, 3 - sw, 0);
      leg(ctx, -7, -11, -7 - sw, 0); leg(ctx, -12, -11, -12 + sw, 0);
    }
    // Leg feathering (back of legs)
    ctx.strokeStyle = '#FBDB7A'; ctx.lineWidth = 2.5;
    if (!j) {
      ctx.beginPath(); ctx.moveTo(6, -8); ctx.lineTo(6 + sw * 0.7, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(-9 - sw * 0.7, -2); ctx.stroke();
    }
    ctx.restore();
  }

  // ── ELIO — Yandl Cat ────────────────────────────────────────────────
  function drawElio(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.2) * 7;
    ctx.save();
    // Tail
    ctx.strokeStyle = '#C45A42'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-15, -18);
    ctx.bezierCurveTo(-28, -30, -26, -46, -14 + Math.sin(f * 0.1) * 5, -52); ctx.stroke();
    // Body
    ctx.fillStyle = '#E8755C';
    ctx.beginPath(); ctx.ellipse(0, -20, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
    // White stripes on body
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, -28); ctx.lineTo(-4, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -29); ctx.lineTo(2, -13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, -28); ctx.lineTo(8, -14); ctx.stroke();
    // Head
    ctx.fillStyle = '#E8755C';
    ctx.beginPath(); ctx.arc(15, -34, 12, 0, Math.PI * 2); ctx.fill();
    // White stripes on head
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(12, -44); ctx.lineTo(13, -36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, -45); ctx.lineTo(17, -37); ctx.stroke();
    // Ears (pointed)
    ctx.fillStyle = '#C45A42';
    ctx.beginPath(); ctx.moveTo(8, -44); ctx.lineTo(13, -36); ctx.lineTo(17, -44); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(19, -45); ctx.lineTo(24, -36); ctx.lineTo(28, -43); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath(); ctx.moveTo(9.5, -43); ctx.lineTo(13, -37); ctx.lineTo(15.5, -42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20.5, -44); ctx.lineTo(23.5, -37); ctx.lineTo(26.5, -42); ctx.closePath(); ctx.fill();
    // Muzzle
    ctx.fillStyle = '#FAC8B8';
    ctx.beginPath(); ctx.ellipse(21, -32, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E76A91';
    ctx.beginPath(); ctx.arc(21, -33, 2, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.arc(17, -38, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(18, -39, 1, 0, Math.PI * 2); ctx.fill();
    // Whiskers
    ctx.strokeStyle = 'rgba(200,160,150,.65)'; ctx.lineWidth = 1;
    [[15,-32,7,-30],[15,-31,7,-32],[27,-32,35,-30],[27,-31,35,-32]].forEach(function (w) {
      ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke();
    });
    // Legs
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

  // ── NOBLE — King Charles Cavalier ──────────────────────────────────
  function drawNoble(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.16) * 6;
    var tw = j ? 4 : Math.sin(f * 0.14) * 10;
    ctx.save();
    // Feathered tail (high, wagging)
    ctx.strokeStyle = '#2E2E2E'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-14, -22);
    ctx.bezierCurveTo(-20, -34 + tw * 0.4, -26, -42 + tw * 0.5, -16, -50 + tw); ctx.stroke();
    // Tail feathering
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-18, -36 + tw * 0.4);
    ctx.quadraticCurveTo(-24, -44 + tw * 0.5, -17, -48 + tw); ctx.stroke();
    // Body (compact, slightly rounded)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(-1, -21, 18, 13, 0, 0, Math.PI * 2); ctx.fill();
    // White chest bib (large, prominent)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(9, -18, 11, 13, 0.2, 0, Math.PI * 2); ctx.fill();
    // Chest feathering detail
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath(); ctx.ellipse(12, -16, 6, 8, 0.25, 0, Math.PI * 2); ctx.fill();
    // Neck ruff
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(11, -28, 9, 7, 0.1, 0, Math.PI * 2); ctx.fill();
    // Head (round dome — signature Cavalier)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.arc(18, -37, 12, 0, Math.PI * 2); ctx.fill();
    // Black cap/markings on top of head
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.arc(18, -38, 12, Math.PI + 0.2, -0.2); ctx.closePath(); ctx.fill();
    // White blaze down center (signature marking)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(18, -39, 4, 8.5, 0, 0, Math.PI * 2); ctx.fill();
    // Lozenge spot on top of head (breed hallmark)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(18, -46, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    // Long silky ear (near side — extra long, feathered)
    ctx.fillStyle = '#2E2E2E';
    ctx.beginPath(); ctx.ellipse(7, -26, 7, 18, -0.1, 0, Math.PI * 2); ctx.fill();
    // Ear silk highlights
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath(); ctx.ellipse(8, -24, 3.5, 12, -0.1, 0, Math.PI * 2); ctx.fill();
    // Ear wave detail
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, -18); ctx.quadraticCurveTo(3, -14, 6, -10); ctx.stroke();
    // Flat muzzle (brachycephalic — short snout)
    ctx.fillStyle = '#F0F0F0';
    ctx.beginPath(); ctx.ellipse(26, -33, 5.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    // Nose (prominent, dark, slightly upturned)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.ellipse(30, -34, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    // Nose shine
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.beginPath(); ctx.ellipse(29, -35, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    // Eyes (round, wide-set — signature gentle expression)
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(21, -39, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.arc(21, -39, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(22, -40, 1.3, 0, Math.PI * 2); ctx.fill();
    // Gentle brow
    ctx.strokeStyle = '#2E2E2E'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(21, -42, 3.5, Math.PI + 0.4, -0.4); ctx.stroke();
    // Tongue (panting)
    ctx.fillStyle = '#E8657C';
    ctx.beginPath(); ctx.ellipse(27, -29, 2.5, 4, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F08090';
    ctx.beginPath(); ctx.ellipse(27, -28, 1.5, 2.5, 0.2, 0, Math.PI * 2); ctx.fill();
    // Legs (feathered, white)
    ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
    if (j) {
      leg(ctx, 8, -9, 13, -3); leg(ctx, 4, -9, -1, -3);
      leg(ctx, -7, -9, -4, -3); leg(ctx, -11, -9, -15, -3);
    } else {
      leg(ctx, 8, -9, 8 + sw, 0); leg(ctx, 4, -9, 4 - sw, 0);
      leg(ctx, -7, -9, -7 - sw, 0); leg(ctx, -11, -9, -11 + sw, 0);
    }
    // Leg feathering
    ctx.strokeStyle = '#F0F0F0'; ctx.lineWidth = 2;
    if (!j) {
      ctx.beginPath(); ctx.moveTo(6, -6); ctx.lineTo(6 + sw * 0.6, -1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(-9 - sw * 0.6, -1); ctx.stroke();
    }
    ctx.restore();
  }

  // ── DASH — Longhair Mini Dachshund ──────────────────────────────────
  function drawDash(ctx, f, j) {
    var sw = j ? 0 : Math.sin(f * 0.28) * 5;
    var tw = j ? 3 : Math.sin(f * 0.18) * 6;
    ctx.save();
    // Tail
    ctx.strokeStyle = '#6A4020'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22, -16);
    ctx.quadraticCurveTo(-30, -22 + tw, -26, -30 + tw); ctx.stroke();
    // Long body
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath(); ctx.ellipse(0, -16, 24, 9, 0, 0, Math.PI * 2); ctx.fill();
    // Dark saddle
    ctx.fillStyle = '#7A5028';
    ctx.beginPath(); ctx.ellipse(-2, -16, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
    // Belly (lighter)
    ctx.fillStyle = '#C8956A';
    ctx.beginPath(); ctx.ellipse(6, -11, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Head (smaller — dachshund proportion)
    ctx.fillStyle = '#9B6B3A';
    ctx.beginPath(); ctx.arc(21, -25, 10, 0, Math.PI * 2); ctx.fill();
    // Long floppy ears
    ctx.fillStyle = '#6A4020';
    ctx.beginPath(); ctx.ellipse(15, -18, 5.5, 12, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(25, -18, 5, 11, 0.25, 0, Math.PI * 2); ctx.fill();
    // Long snout (dachshund characteristic)
    ctx.fillStyle = '#C8956A';
    ctx.beginPath(); ctx.ellipse(28, -24, 9, 4, 0, 0, Math.PI * 2); ctx.fill();
    // Nose
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.ellipse(36, -24, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#2E2A28';
    ctx.beginPath(); ctx.arc(23, -28, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(24, -29, 0.8, 0, Math.PI * 2); ctx.fill();
    // Short stubby legs (rapid scurry)
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

  // ── DISPATCH ────────────────────────────────────────────────────────
  function drawCharacter(ctx, id, frame, jumping) {
    switch (id) {
      case 'B': return drawBuddy(ctx, frame, jumping);
      case 'E': return drawElio(ctx, frame, jumping);
      case 'N': return drawNoble(ctx, frame, jumping);
      case 'D': return drawDash(ctx, frame, jumping);
    }
  }

  // ── OBSTACLES ────────────────────────────────────────────────────────
  function drawBone(ctx, x, gy) {
    ctx.save(); ctx.translate(x, gy);
    ctx.fillStyle = '#F0E8D4';
    rrect(ctx, -18, -30, 36, 9, 4); ctx.fill();
    ctx.beginPath(); ctx.arc(-20, -34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-20, -22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, -34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, -22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(200,178,148,.4)'; ctx.lineWidth = 1.5;
    rrect(ctx, -18, -30, 36, 9, 4); ctx.stroke();
    ctx.restore();
  }

  function drawHydrant(ctx, x, gy) {
    ctx.save(); ctx.translate(x, gy);
    ctx.fillStyle = '#E8755C';
    rrect(ctx, -11, -52, 22, 42, 4); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -52, 11, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#C45A42';
    ctx.beginPath(); ctx.arc(0, -63, 8, 0, Math.PI * 2); ctx.fill();
    rrect(ctx, -19, -40, 9, 7, 3); ctx.fill();
    rrect(ctx, 10, -40, 9, 7, 3); ctx.fill();
    rrect(ctx, -14, -12, 28, 12, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.arc(-3, -38, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawPineapple(ctx, x, gy) {
    ctx.save(); ctx.translate(x, gy);
    // Leaves (crown)
    ctx.fillStyle = '#5DAA3B';
    ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(-5, -42); ctx.lineTo(5, -42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6, -54); ctx.lineTo(-12, -40); ctx.lineTo(-2, -40); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, -54); ctx.lineTo(2, -40); ctx.lineTo(12, -40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4A9030';
    ctx.beginPath(); ctx.moveTo(-3, -50); ctx.lineTo(-9, -38); ctx.lineTo(0, -38); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(3, -50); ctx.lineTo(0, -38); ctx.lineTo(9, -38); ctx.closePath(); ctx.fill();
    // Body (oval)
    ctx.fillStyle = '#F4B042';
    ctx.beginPath(); ctx.ellipse(0, -22, 14, 20, 0, 0, Math.PI * 2); ctx.fill();
    // Cross-hatch pattern
    ctx.strokeStyle = '#D4902A'; ctx.lineWidth = 1.2;
    for (var dy = -36; dy < -4; dy += 7) {
      ctx.beginPath(); ctx.moveTo(-12, dy); ctx.lineTo(12, dy); ctx.stroke();
    }
    for (var dx = -10; dx <= 10; dx += 7) {
      ctx.beginPath(); ctx.moveTo(dx, -40); ctx.lineTo(dx, -4); ctx.stroke();
    }
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.ellipse(-4, -26, 5, 10, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawSeagull(ctx, x, y, frame) {
    ctx.save(); ctx.translate(x, y);
    var fl = Math.sin(frame * 0.25) * 0.55;
    // Wings
    ctx.fillStyle = '#D8D4CE';
    ctx.beginPath(); ctx.ellipse(-11, fl * -11, 14, 5, fl, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, fl * -11, 14, 5, -fl, 0, Math.PI * 2); ctx.fill();
    // Wing tips (dark)
    ctx.fillStyle = '#4A4744';
    ctx.beginPath(); ctx.ellipse(-22, fl * -13, 5, 3, fl + 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, fl * -13, 5, 3, -fl - 0.2, 0, Math.PI * 2); ctx.fill();
    // Body
    ctx.fillStyle = '#F5F3F0';
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
    // Head
    ctx.fillStyle = '#F5F3F0';
    ctx.beginPath(); ctx.arc(0, -10, 5, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.arc(2, -11, 1.2, 0, Math.PI * 2); ctx.fill();
    // Beak (orange-yellow)
    ctx.fillStyle = '#E8A030';
    ctx.beginPath(); ctx.moveTo(5, -11); ctx.lineTo(12, -10); ctx.lineTo(5, -8); ctx.closePath(); ctx.fill();
    // Red spot on beak
    ctx.fillStyle = '#D04030';
    ctx.beginPath(); ctx.arc(8, -9.5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawSquirrel(ctx, x, gy) {
    ctx.save(); ctx.translate(x, gy);
    // Bushy tail (big, curling up)
    ctx.fillStyle = '#B87840';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.bezierCurveTo(-18, -28, -22, -48, -8, -52);
    ctx.bezierCurveTo(4, -56, 2, -38, -4, -28);
    ctx.closePath(); ctx.fill();
    // Tail highlight
    ctx.fillStyle = '#D09050';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.bezierCurveTo(-14, -30, -16, -44, -6, -48);
    ctx.bezierCurveTo(0, -50, 0, -38, -3, -28);
    ctx.closePath(); ctx.fill();
    // Body
    ctx.fillStyle = '#A06830';
    ctx.beginPath(); ctx.ellipse(0, -16, 10, 12, 0.15, 0, Math.PI * 2); ctx.fill();
    // White belly
    ctx.fillStyle = '#F0E0C8';
    ctx.beginPath(); ctx.ellipse(3, -12, 6, 7, 0.2, 0, Math.PI * 2); ctx.fill();
    // Head
    ctx.fillStyle = '#A06830';
    ctx.beginPath(); ctx.arc(10, -28, 8, 0, Math.PI * 2); ctx.fill();
    // Cheek
    ctx.fillStyle = '#F0E0C8';
    ctx.beginPath(); ctx.ellipse(14, -26, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    // Ear
    ctx.fillStyle = '#8A5820';
    ctx.beginPath(); ctx.ellipse(6, -35, 3, 4.5, -0.3, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath(); ctx.arc(13, -30, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(13.8, -30.8, 0.8, 0, Math.PI * 2); ctx.fill();
    // Nose
    ctx.fillStyle = '#3A2518';
    ctx.beginPath(); ctx.ellipse(17, -27, 1.8, 1.3, 0, 0, Math.PI * 2); ctx.fill();
    // Front paws
    ctx.strokeStyle = '#A06830'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(6, -6); ctx.lineTo(8, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(0, 0); ctx.stroke();
    // Back paws
    ctx.beginPath(); ctx.moveTo(-5, -6); ctx.lineTo(-6, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-9, -7); ctx.lineTo(-11, 0); ctx.stroke();
    ctx.restore();
  }

  function drawCactus(ctx, x, gy) {
    ctx.save(); ctx.translate(x, gy);
    // Main stem
    ctx.fillStyle = '#5DAA3B';
    rrect(ctx, -8, -48, 16, 48, 6); ctx.fill();
    // Left arm
    ctx.fillStyle = '#5DAA3B';
    rrect(ctx, -22, -40, 14, 10, 5); ctx.fill();
    rrect(ctx, -22, -40, 10, 22, 5); ctx.fill();
    // Right arm
    rrect(ctx, 8, -34, 14, 10, 5); ctx.fill();
    rrect(ctx, 12, -34, 10, 18, 5); ctx.fill();
    // Darker center lines
    ctx.strokeStyle = '#4A9030'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-18, -34); ctx.lineTo(-18, -22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18, -28); ctx.lineTo(18, -18); ctx.stroke();
    // Spines (tiny)
    ctx.strokeStyle = '#7BC060'; ctx.lineWidth = 1;
    [[-8,-42],[-8,-30],[8,-38],[8,-26],[-8,-18],[8,-14],[-22,-32],[18,-24]].forEach(function(p) {
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + (p[0] < 0 ? -4 : 4), p[1] - 3); ctx.stroke();
    });
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.beginPath(); ctx.ellipse(-3, -30, 3, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ── HITBOXES ─────────────────────────────────────────────────────────
  var CHAR_HB = {
    B: { l: -8,  r: 20, t: -42 },
    E: { l: -5,  r: 17, t: -40 },
    N: { l: -9,  r: 22, t: -44 },
    D: { l: -8,  r: 28, t: -30 },
  };
  function getCharHitbox(id) { return CHAR_HB[id] || CHAR_HB.B; }

  function getObstacleHitbox(ob, gy) {
    if (ob.type === 'bone')    return { l: ob.x - 14, r: ob.x + 14, t: gy - 38, b: gy };
    if (ob.type === 'hydrant') return { l: ob.x - 8,  r: ob.x + 8,  t: gy - 58, b: gy };
    if (ob.type === 'pineapple') return { l: ob.x - 10, r: ob.x + 10, t: gy - 52, b: gy };
    if (ob.type === 'seagull')    return { l: ob.x - 14, r: ob.x + 14, t: ob.birdY - 9, b: ob.birdY + 9 };
    if (ob.type === 'squirrel')   return { l: ob.x - 8,  r: ob.x + 14, t: gy - 34, b: gy };
    if (ob.type === 'cactus')     return { l: ob.x - 18, r: ob.x + 18, t: gy - 46, b: gy };
    return { l: ob.x - 10, r: ob.x + 10, t: gy - 30, b: gy };
  }

  // ── SCORES & STATS ───────────────────────────────────────────────────
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem('bend-hi') || '{}'); } catch (_) { return {}; }
  }
  function saveHighScore(id, score) {
    var hs = loadHighScores();
    if (!hs[id] || score > hs[id]) { hs[id] = Math.floor(score); localStorage.setItem('bend-hi', JSON.stringify(hs)); }
  }
  function getGlobalHi() {
    var v = Object.values(loadHighScores()); return v.length ? Math.max.apply(null, v) : 0;
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem('bend-stats') || '{}'); } catch (_) { return { games: 0 }; }
  }
  function recordGame() {
    var s = loadStats(); s.games = (s.games || 0) + 1;
    localStorage.setItem('bend-stats', JSON.stringify(s));
  }

  // ── LEADERBOARD ──────────────────────────────────────────────────────
  var LEADERBOARD = [
    { name: 'Luna',   emoji: '🐱', char: 'E', score: 2840 },
    { name: 'Max',    emoji: '🦴', char: 'B', score: 2210 },
    { name: 'Cleo',   emoji: '👑', char: 'N', score: 1980 },
    { name: 'Zara',   emoji: '🌭', char: 'D', score: 1750 },
    { name: 'Pip',    emoji: '🐾', char: 'B', score: 1320 },
    { name: 'Mochi',  emoji: '🎀', char: 'N', score: 1100 },
    { name: 'Oscar',  emoji: '🐶', char: 'D', score:  890 },
    { name: 'Bella',  emoji: '🌸', char: 'E', score:  740 },
  ];

  return {
    CHARACTERS, LEADERBOARD,
    drawCharacter, drawBone, drawHydrant, drawPineapple, drawSeagull, drawSquirrel, drawCactus,
    getCharHitbox, getObstacleHitbox,
    loadHighScores, saveHighScore, getGlobalHi, loadStats, recordGame,
  };
})();
