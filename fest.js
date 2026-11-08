(function () {
  // Canvas Setup
  const canvas = document.createElement('canvas');
  canvas.id = 'diwali-canvas';
  
  // 🚨 FIX: z-index को -1 कर दिया है ताकि ये बैकग्राउंड में रहे
  canvas.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:-1;';
  document.body.prepend(canvas); 

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let fireworks = [];

  const colors = ['#ffd700', '#ff8c00', '#ff4500', '#ffffff', '#ff0000'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.08; 
      this.friction = 0.96; 
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015; 
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  class Rocket {
    constructor() {
      this.x = Math.random() * width;
      this.y = height;
      this.targetY = Math.random() * (height * 0.5) + 100; 
      this.speed = Math.random() * 4 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        createExplosion(this.x, this.y, this.color);
        return false; 
      }
      return true;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function createExplosion(x, y, colorOverride) {
    const burstColor = colorOverride || colors[Math.floor(Math.random() * colors.length)];
    const particleCount = Math.floor(Math.random() * 40) + 40; 
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(x, y, burstColor));
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    
    // 🚨 FIX: 'destination-out' से ट्रेल साफ़ होगा, बैकग्राउंड काला नहीं होगा
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'lighter';

    fireworks = fireworks.filter(rocket => {
      rocket.draw();
      return rocket.update();
    });

    particles = particles.filter(p => {
      p.draw();
      p.update();
      return p.alpha > 0;
    });
  }

  setInterval(() => {
    if (fireworks.length < 5) fireworks.push(new Rocket());
  }, 1500);

  window.addEventListener('click', (e) => {
    createExplosion(e.clientX, e.clientY);
  });

  animate();
})();