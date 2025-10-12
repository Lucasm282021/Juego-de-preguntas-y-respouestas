(function(){
    const resultRaw = localStorage.getItem('quiz_result');
    // Borrar el resultado inmediatamente después de leerlo para evitar que se muestre de nuevo al recargar.
    try { localStorage.removeItem('quiz_result'); } catch (e) {}

    if (!resultRaw) {
      // Si no hay datos (porque la página fue recargada), no mostrar nada.
      document.querySelector('main').innerHTML = '<h1>Resultado no disponible</h1><p>Serás redirigido al inicio.</p>';
      setTimeout(() => { window.location.href = 'index.html'; }, 2500);
      return;
    }
    const res = JSON.parse(resultRaw);
    document.getElementById('name').textContent = res.name || 'Jugador';
    document.getElementById('score').textContent = res.score ?? 0;
    document.getElementById('time').textContent = (res.totalTime != null) ? (res.totalTime + 's') : '-';
    document.getElementById('corrects').textContent = res.correctAnswers ?? 0;
    document.getElementById('errors').textContent = res.errors ?? 0;

    const listEl = document.getElementById('history-list');
    if (Array.isArray(res.history) && res.history.length) {
      res.history.forEach((h, i) => {
        const div = document.createElement('div');
        div.className = 'q ' + (h.correct ? 'correct' : 'wrong');
        div.innerHTML = `<strong>Q${i+1}:</strong> ${h.text} <br>
          Tu respuesta: <em>${h.chosenText}</em> ${h.correct ? '<span style="color:var(--color-accent-primary)">✔</span>' : '<span style="color:var(--color-error)">✖</span>'} <br>
          Respuesta correcta: <em>${h.correctText}</em> <br>
          Tiempo: ${h.timeTaken}s ${h.usedDouble ? ' | Duplicador usado' : ''}
        `;
        listEl.appendChild(div);
      });
    } else {
      listEl.innerHTML = '<p>No hay historial de preguntas.</p>';
    }

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