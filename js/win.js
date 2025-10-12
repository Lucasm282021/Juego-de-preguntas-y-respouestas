(function(){
    const resultRaw = localStorage.getItem('quiz_result');
    if (!resultRaw) {
        document.getElementById('message').textContent = 'No se encontró información del juego.';
        return;
    }
    const res = JSON.parse(resultRaw);
    document.getElementById('name').textContent = res.name || 'Jugador';
    document.getElementById('score').textContent = res.score ?? 0;
    document.getElementById('time').textContent = (res.totalTime != null) ? (res.totalTime + 's') : '-';
    document.getElementById('corrects').textContent = res.correctAnswers ?? 0;
    document.getElementById('errors').textContent = res.errors ?? 0;
    const lif = res.lifelinesUsed || {};
    const lifelineNames = {
        double: 'X2',
        switch: 'Cambio de pregunta',
        eliminate: '50:50'
    };

    const usedLifelinesText = Object.keys(lif)
        .filter(key => lif[key])
        .map(key => lifelineNames[key] || key)
        .join(', ');
    document.getElementById('lifelines').textContent = usedLifelinesText || 'Ninguno';

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

    const audio = document.getElementById('win-audio');
    // reproducir respetando la preferencia de mute guardada en start page (si existe)
    try {
        const mutePref = localStorage.getItem('quiz_mute');
        if (mutePref === 'true') {
            audio.muted = true;
        }
    } catch (e) {}

    // Crear contenedor de confetti
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    function createConfetti(count = 70) {
        const colors = ['#FF3B30','#FF9500','#FFCC00','#4CD964','#5AC8FA','#5856D6','#FF2D55'];
        const w = window.innerWidth;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            const color = colors[Math.floor(Math.random() * colors.length)];
            el.style.background = color;
            const left = Math.random() * w;
            el.style.left = (left - 10) + 'px';
            const delay = Math.random() * 0.5;
            const duration = 2 + Math.random() * 2.5;
            el.style.top = '-10vh';
            el.style.opacity = 0.95;
            el.style.transform = `rotate(${Math.random()*360}deg)`;
            el.style.animationDuration = `${duration}s, ${0.8 + Math.random()*1.2}s`;
            el.style.animationDelay = `${delay}s, 0s`;
            confettiContainer.appendChild(el);
            // remover después de animar
            setTimeout(() => { try{ confettiContainer.removeChild(el); }catch(e){} }, (duration + 0.6) * 1000 + delay*1000);
        }
    }

    // Intentar reproducir; algunos navegadores bloquean autoplay sin interacción
    audio.play().then(() => {
        // si reproduce, lanzar confetti
        createConfetti(90);
    }).catch(() => {
        // Si falla, mostrar un botón para reproducir y activar confetti al pulsarlo
        const playBtn = document.createElement('button');
        playBtn.className = 'btn';
        playBtn.textContent = 'Reproducir aplausos';
        playBtn.addEventListener('click', () => {
            audio.play().then(() => createConfetti(90));
        });
        document.querySelector('main').appendChild(playBtn);
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        // limpiar el resultado y volver al inicio
        try { localStorage.removeItem('quiz_result'); } catch (e) {}
        window.location.href = 'index.html';
    });
})();