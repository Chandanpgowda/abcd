// Particle network background – floating nodes with connecting lines
(function() {
  const config = {
    particleCount: 60,       // number of particles
    connectionDistance: 100,  // max distance for lines to appear
    particleSpeed: 0.2,       // drift speed
    lineOpacity: 0.15,        // opacity of lines
    particleColor: '100, 200, 255', // RGB for particles (light blue)
    lineColor: '100, 200, 255',      // RGB for lines
    maxParticleOpacity: 0.4,  // maximum particle opacity
    backgroundColor: 'transparent'
  };

  let canvas, ctx;
  let particles = [];
  let width, height;
  let animationFrame;

  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.background = 'transparent';
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.particleSpeed;
      this.vy = (Math.random() - 0.5) * config.particleSpeed;
      this.opacity = 0.2 + Math.random() * (config.maxParticleOpacity - 0.2);
      this.radius = 2 + Math.random() * 3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `rgb(${config.particleColor})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    ctx.globalAlpha = config.lineOpacity;
    ctx.strokeStyle = `rgb(${config.lineColor})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          // Line opacity decreases with distance
          ctx.globalAlpha = config.lineOpacity * (1 - distance / config.connectionDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!ctx) return;

    // Clear canvas (transparent)
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => p.update());

    // Draw connections first (behind particles)
    drawLines();

    // Draw particles
    particles.forEach(p => p.draw());

    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    initCanvas();
    initParticles();
    animate();
  }

  window.addEventListener('load', start);
})();