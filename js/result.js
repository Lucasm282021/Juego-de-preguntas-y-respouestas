function displayResults() {
    const resultRaw = localStorage.getItem('quiz_result');
    // Borrar el resultado inmediatamente después de leerlo.
    try { localStorage.removeItem('quiz_result'); } catch (e) {}

    if (!resultRaw) {
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

    // Mostrar comodines solo si existen en el resultado (página de victoria)
    const lifelinesEl = document.getElementById('lifelines');
    if (lifelinesEl && res.lifelinesUsed) {
        const lifelineNames = {
            double: 'X2',
            switch: 'Cambiar',
            eliminate: '50:50'
        };

        const usedLifelines = Object.keys(res.lifelinesUsed)
            .filter(key => res.lifelinesUsed[key])
            .map(key => lifelineNames[key] || key);

        lifelinesEl.textContent = usedLifelines.length > 0 ? usedLifelines.join(', ') : 'Ninguno';
    }

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
    }
}