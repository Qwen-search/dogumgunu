/* ====================== BACKGROUND STARS ====================== */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let stars = [];

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

function createStars() {
  stars = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 3500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      twinkle: Math.random() * Math.PI * 2
    });
  }
}
createStars();

function drawStars() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  stars.forEach(s => {
    s.twinkle += s.speed;
    const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${a})`;
    bgCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* ====================== CONFETTI SYSTEM ====================== */
const confettiCanvas = document.getElementById('confettiCanvas');
const confCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

const confettiColors = [
  '#ffd700', '#ff6b9d', '#c084fc', '#60a5fa',
  '#34d399', '#f472b6', '#fb923c', '#a78bfa',
  '#fbbf24', '#f43f5e', '#22d3ee'
];

function spawnConfetti(amount = 180) {
  confettiActive = true;
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 100,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.12 + Math.random() * 0.08,
      opacity: 1,
      shape: Math.random() > 0.6 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'triangle')
    });
  }
}

function drawConfetti() {
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 40 && p.opacity > 0.05);
  
  confettiPieces.forEach(p => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;
    p.opacity -= 0.003;
    
    confCtx.save();
    confCtx.translate(p.x, p.y);
    confCtx.rotate((p.rot * Math.PI) / 180);
    confCtx.globalAlpha = Math.max(0, p.opacity);
    confCtx.fillStyle = p.color;
    
    if (p.shape === 'circle') {
      confCtx.beginPath();
      confCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      confCtx.fill();
    } else if (p.shape === 'triangle') {
      confCtx.beginPath();
      confCtx.moveTo(0, -p.h);
      confCtx.lineTo(p.w / 2, p.h / 2);
      confCtx.lineTo(-p.w / 2, p.h / 2);
      confCtx.closePath();
      confCtx.fill();
    } else {
      confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    confCtx.restore();
  });
  
  if (confettiPieces.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiActive = false;
  }
}

/* ====================== BALLOONS ====================== */
const balloonsContainer = document.getElementById('balloons');
const balloonColors = [
  'linear-gradient(135deg, #ff6b9d, #ff8fab)',
  'linear-gradient(135deg, #c084fc, #a78bfa)',
  'linear-gradient(135deg, #60a5fa, #38bdf8)',
  'linear-gradient(135deg, #ffd700, #fbbf24)',
  'linear-gradient(135deg, #34d399, #6ee7b7)',
  'linear-gradient(135deg, #f472b6, #fb7185)',
  'linear-gradient(135deg, #fb923c, #fdba74)'
];

function spawnBalloons(count = 14) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.style.left = Math.random() * 100 + '%';
      balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      balloon.style.animationDuration = (7 + Math.random() * 5) + 's';
      balloon.style.animationDelay = (Math.random() * 0.8) + 's';
      balloon.style.width = (50 + Math.random() * 30) + 'px';
      balloon.style.height = (65 + Math.random() * 35) + 'px';
      balloonsContainer.appendChild(balloon);
      
      // Remove after animation
      setTimeout(() => balloon.remove(), 13000);
    }, i * 180);
  }
}

/* ====================== SPARKLES / BURSTS ====================== */
function createBurst(x, y) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffd700;
    box-shadow: 0 0 20px 8px rgba(255,215,0,0.8);
    pointer-events: none;
    z-index: 200;
    animation: burstAnim 0.8s ease-out forwards;
  `;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 800);
}

// Inject burst keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes burstAnim {
    0% { transform: scale(0.3); opacity: 1; }
    100% { transform: scale(12); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

/* ====================== MAIN INTERACTION ====================== */
const giftBtn = document.getElementById('giftBtn');
const mainCard = document.getElementById('mainCard');
const messageBox = document.getElementById('messageBox');
const messageContent = document.getElementById('messageContent');
const audio = document.getElementById('birthdayAudio');
const subtitle = document.getElementById('subtitle');

const fullMessage = [
  "Doğum günün kutlu olsun, kardeş.",
  "Rabbim hayırlı ömürler versin.",
  "Baba, kaşına gözüne on tane adam ver.",
  "Rah, görüşürüz, bebeğim. 💙"
];

let hasOpened = false;

giftBtn.addEventListener('click', () => {
  if (hasOpened) return;
  hasOpened = true;

  // Button state
  giftBtn.classList.add('playing');
  giftBtn.querySelector('.btn-text').textContent = 'Dinleniyor... 🎵';

  // Card glow
  mainCard.classList.add('opened');

  // Play audio
  audio.currentTime = 0;
  audio.play().catch(e => console.log('Audio play blocked:', e));

  // Effects
  spawnConfetti(220);
  if (!confettiActive) drawConfetti();
  spawnBalloons(16);

  // Center burst
  const rect = giftBtn.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

  // Extra bursts
  setTimeout(() => createBurst(window.innerWidth * 0.3, window.innerHeight * 0.3), 200);
  setTimeout(() => createBurst(window.innerWidth * 0.7, window.innerHeight * 0.35), 400);
  setTimeout(() => createBurst(window.innerWidth * 0.5, window.innerHeight * 0.2), 600);

  // Update subtitle
  subtitle.textContent = 'Sana özel bir mesaj var... 💌';
  subtitle.style.color = '#ffd700';

  // Show message with typewriter-like staggered lines
  messageBox.classList.add('show');
  
  fullMessage.forEach((line, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = 'message-line';
      p.style.animationDelay = '0s';
      p.textContent = line;
      p.style.marginBottom = i < fullMessage.length - 1 ? '10px' : '0';
      messageContent.appendChild(p);
    }, 600 + i * 900);
  });

  // After audio ends, change button text
  audio.addEventListener('ended', () => {
    giftBtn.querySelector('.btn-text').textContent = 'Doğum Günün Kutlu Olsun! 🎂';
    // One more confetti wave
    spawnConfetti(120);
    if (!confettiActive) drawConfetti();
  }, { once: true });
});

/* Continuous gentle confetti rain after opening (optional soft effect) */
setInterval(() => {
  if (hasOpened && confettiPieces.length < 40) {
    // Soft ongoing confetti
    for (let i = 0; i < 3; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -10,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1.5,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        gravity: 0.08,
        opacity: 0.85,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    if (!confettiActive) {
      confettiActive = true;
      drawConfetti();
    }
  }
}, 800);
