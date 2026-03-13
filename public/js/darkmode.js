// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('darkModeToggle');
  const body = document.body;
  
  // Check localStorage for saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.className = savedTheme; // 'dark' or 'light'
  updateButtonText(savedTheme);
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
      body.className = newTheme;
      localStorage.setItem('theme', newTheme);
      updateButtonText(newTheme);
    });
  }
  
  function updateButtonText(theme) {
    const btnText = toggleBtn ? toggleBtn.querySelector('span') : null;
    if (btnText) {
      btnText.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
    }
  }
});