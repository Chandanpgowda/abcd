// Futuristic cursor trail – glowing particles with connecting lines
(function() {
  const config = {
    maxParticles: 25,        // maximum particles in trail
    particleSize: 4,          // base size
    particleColor: '100, 200, 255', // RGB (light blue)
    lineColor: '100, 200, 255',      // RGB for connection lines
    lineOpacity: 0.3,         // line opacity
    connectionDistance: 70,    // max distance for lines to appear
    fadeSpeed: 0.95,           // how fast particles fade per frame
    drift: 0.5,                // how much particles drift away from trail
    mouseMoveThrottle: 5       // ms between updates
  };

  let canvas, ctx;
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let lastUpdate = 0;
  let animationFrame;

  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    if (now - lastUpdate > config.mouseMoveThrottle) {
      // Add a new particle at mouse position
      particles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * config.drift,
        vy: (Math.random() - 0.5) * config.drift,
        size: config.particleSize * (0.7 + Math.random() * 0.6),
        opacity: 1,
        life: 1,
        color: config.particleColor
      });

      // Limit particle count
      if (particles.length > config.maxParticles) {
        particles.shift();
      }

      lastUpdate = now;
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      const now = Date.now();
      if (now - lastUpdate > config.mouseMoveThrottle) {
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * config.drift,
          vy: (Math.random() - 0.5) * config.drift,
          size: config.particleSize * (0.7 + Math.random() * 0.6),
          opacity: 1,
          life: 1,
          color: config.particleColor
        });
        if (particles.length > config.maxParticles) {
          particles.shift();
        }
        lastUpdate = now;
      }
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      // Fade out
      p.life *= config.fadeSpeed;
      p.opacity = p.life;

      // Remove dead particles
      if (p.life < 0.01) {
        particles.splice(i, 1);
      }
    }
  }

  function drawConnections() {
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < config.connectionDistance) {
          // Opacity based on distance and particle life
          const opacity = config.lineOpacity * 
                          (1 - dist / config.connectionDistance) * 
                          (particles[i].opacity + particles[j].opacity) / 2;
          ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      // Glow effect using shadow
      ctx.shadowColor = `rgba(${p.color}, ${p.opacity * 0.8})`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `rgba(${p.color}, 1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.opacity, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawConnections();
    drawParticles();
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    initCanvas();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    animate();
  }

  window.addEventListener('load', start);
})();