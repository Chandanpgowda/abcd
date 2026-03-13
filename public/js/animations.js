// Simple scroll animation using Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.fade-in-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});