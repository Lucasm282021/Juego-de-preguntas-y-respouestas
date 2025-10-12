// Llama a la función compartida para mostrar los resultados
displayResults();

(function() {
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
        window.location.href = 'index.html';
    });
})();