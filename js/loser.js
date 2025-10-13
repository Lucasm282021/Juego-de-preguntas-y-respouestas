// Llama a la función compartida para mostrar los resultados
displayResults();
  
(function() {
    const audio = document.getElementById('lose-audio');
    try {
      const mutePref = localStorage.getItem('quiz_mute');
      if (mutePref === 'true') {
        audio.muted = true;
      }
    } catch (e) {}
    // Intentar reproducir sonido de error
    audio.play().catch(() => {
      const playBtn = document.createElement('button');
      playBtn.className = 'btn';
      playBtn.textContent = 'Reproducir sonido';
      playBtn.addEventListener('click', () => audio.play());
      document.querySelector('main').appendChild(playBtn);
    });

    document.getElementById('back-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
})();