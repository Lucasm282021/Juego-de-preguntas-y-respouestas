// Llama a la función compartida para mostrar los resultados
displayResults();
  
(function(){
    const audio = document.getElementById('lose-audio');
    try {
      const mutePref = localStorage.getItem('quiz_mute');
      if (mutePref === 'true') {
        audio.muted = true;
      }
    } catch (e) {}
    // Intentar reproducir sonido de error
    audio.play().catch(() => {
      // No mostrar botón si falla, para mantener consistencia con la solución de recarga.
    });

    document.getElementById('back-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
})();