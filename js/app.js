document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game');
    const startBtn = document.getElementById('start-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const leaderboardDisplay = document.getElementById('leaderboard-display');
    const qText = document.getElementById('question-text');
    const optionsDiv = document.getElementById('options');
    const scoreSpan = document.getElementById('score');
    const targetSpan = document.getElementById('target');
    const nextBtn = document.getElementById('next-btn');
    const messageDiv = document.getElementById('message');
    const doubleBtn = document.getElementById('double-btn');
    const switchBtn = document.getElementById('switch-btn');
    const eliminateBtn = document.getElementById('eliminate-btn');
    const doubleCount = document.getElementById('double-count');
    const switchCount = document.getElementById('switch-count');
    const eliminateCount = document.getElementById('eliminate-count');
    const timerFill = document.getElementById('timer-fill');
    const questionCounterSpan = document.getElementById('question-counter');
    const errorsSpan = document.getElementById('errors');
    const timerSound = new Audio('sound/timer-ticks-314055.mp3');
    const errorSound = new Audio('sound/error-170796.mp3');
    const correctSound = new Audio('sound/sonido-correcto-331225.mp3');
    const winSound = new Audio('sound/applause-cheer-236786.mp3');
    const muteBtn = document.getElementById('mute-btn');
    
    const toggleTextureBtn = document.getElementById('toggle-texture-btn');
    // Admin Login Elements
    const adminLogin = document.getElementById('admin-login');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const startScreenActions = document.querySelector('.start-screen__actions');

    // Instructions Elements
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsDialog = document.getElementById('instructions-dialog');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    
    // Game State
    const gameState = {        score: 0,
        currentIndex: null,
        currentCorrectIndex: null,
        usedDoubleForThis: false,
        askedIndices: new Set(),
        questionsAskedCount: 0,
        errorsCount: 0,
        correctAnswersCount: 0,
        timer: null,
        timeLeft: 0,
        playerName: '',
        gameStartTime: 0,
        isGameOver: false,
        history: [],
        questionStartTime: 0,
        usedLifelines: {
            double: false,
            switch: false,
            eliminate: false,
        }
    };

    let cfg = {};
    let questions = [];

    async function init() {
        await loadConfig();
        resetToStart();
        attachEvents();
        toggleMute();
        applyInitialTextureState();
    }

    async function loadConfig() {
        const rawConfig = localStorage.getItem('quiz_config');
        if (rawConfig) {
            cfg = JSON.parse(rawConfig);
        } else {
            try {
                const response = await fetch('defaultConfig.json');
                cfg = await response.json();
                localStorage.setItem('quiz_config', JSON.stringify(cfg));
            } catch (error) {
                console.error('Could not load default config:', error);
            }
        }
        questions = cfg.questions || [];
    }

    function showStartScreenActions() {
        adminLogin.style.display = 'none';
        startScreenActions.style.display = 'flex';
        adminPasswordInput.value = '';
    }

    function resetToStart() {
        gameState.score = 0;
        gameState.askedIndices.clear();
        gameState.questionsAskedCount = 0;
        gameState.errorsCount = 0;
        gameState.correctAnswersCount = 0;
        gameState.playerName = '';
        gameState.isGameOver = false;

        // Contadores de comodines disponibles
        gameState.lifelineCounts = {
            double: cfg.doubleStart,
            switch: cfg.switchStart,
            eliminate: cfg.eliminateStart,
        };

        scoreSpan.textContent = gameState.score;
        targetSpan.textContent = cfg.pointsToWin;
        if (errorsSpan) errorsSpan.textContent = gameState.errorsCount;
        doubleCount.textContent = gameState.lifelineCounts.double;
        switchCount.textContent = gameState.lifelineCounts.switch;
        eliminateCount.textContent = gameState.lifelineCounts.eliminate;
        if (questionCounterSpan) questionCounterSpan.textContent = `0/${cfg.maxQuestionsPerGame}`;

    // reset history and lifeline usage
    gameState.history = [];
    gameState.questionStartTime = 0;
    gameState.usedLifelines = { double: false, switch: false, eliminate: false };

        nextBtn.textContent = 'Siguiente';
        messageDiv.textContent = '';
        stopTimer();
        if (timerFill) timerFill.style.width = '100%';
    // detener sonido de victoria si estaba sonando
    try { winSound.pause(); winSound.currentTime = 0; } catch (e) {}
        gameScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        nextBtn.classList.add('hidden');

        // Reset admin login form
        showStartScreenActions();
    }

    function startGame() {
        const name = prompt('Por favor, ingresa tu nombre:', 'Jugador');

        if (name === null) {
            return;
        }

        if (name.toLowerCase() === 'admin') {
            startScreenActions.style.display = 'none';
            adminLogin.style.display = 'flex';
            adminPasswordInput.focus();
            return;
        }

        gameState.playerName = name || 'Jugador';
        gameState.gameStartTime = Date.now();
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        pickRandomQuestion();
    }

    function handleAdminLogin() {
        const password = adminPasswordInput.value;
        if (password === '31381993') {
            alert('Acceso concedido. Redirigiendo al panel de administrador...');
            window.location.href = 'admin/index.html';
        } else {
            alert('Contraseña incorrecta.');
            showStartScreenActions();
        }
    }

    function pickRandomQuestion() {
        // Si no hay preguntas cargadas, evitar terminar el juego inmediatamente
        if (!questions || questions.length === 0) {
            alert('No se encontraron preguntas. Revisa que "defaultConfig.json" exista y tenga preguntas.');
            resetToStart();
            return;
        }
        gameState.usedDoubleForThis = false;
        if (gameState.askedIndices.size >= questions.length || gameState.questionsAskedCount >= cfg.maxQuestionsPerGame) {
            endGame(false);
            return;
        }

        let idx;
        const recentlyAsked = getRecentlyAsked();
        let attempts = 0;
        const maxAttempts = questions.length * 2; // Límite para evitar bucles infinitos

        do {
            idx = Math.floor(Math.random() * questions.length);
            attempts++;
            // Si hemos intentado muchas veces y no encontramos una pregunta "nueva",
            // ignoramos la lista de "recientes" para evitar un bucle infinito.
            if (attempts > maxAttempts) {
                break;
            }
        } while (gameState.askedIndices.has(idx) || recentlyAsked.includes(idx));

        gameState.askedIndices.add(idx);
        updateRecentlyAsked(idx);
        gameState.currentIndex = idx;
        gameState.questionsAskedCount++;
        if (questionCounterSpan) questionCounterSpan.textContent = `${gameState.questionsAskedCount}/${cfg.maxQuestionsPerGame}`;
        showQuestion(questions[idx]);
    }

    function showQuestion(q) {
        qText.textContent = q.text;
        optionsDiv.innerHTML = '';

        // marcar tiempo de inicio de la pregunta
        gameState.questionStartTime = Date.now();

        const correctAnswerText = q.options[q.answer];
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        gameState.currentCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

        shuffledOptions.forEach((opt, i) => {
            // Habilitar los comodines para la nueva pregunta
            const b = document.createElement('button');
            b.className = 'question-card__option';
            b.textContent = opt;
            b.dataset.index = i;
            b.addEventListener('click', onChoose);
            optionsDiv.appendChild(b);
        });
        setLifelinesState(true); // Habilitar comodines para la nueva pregunta
        startTimer();
    }

    function onChoose(e) {
        const chosen = parseInt(e.currentTarget.dataset.index, 10);
        const q = questions[gameState.currentIndex];
        setLifelinesState(false); // Deshabilitar comodines al responder
        Array.from(optionsDiv.children).forEach(ch => ch.style.pointerEvents = 'none');
        stopTimer();
        messageDiv.classList.remove('game__message--correct', 'game__message--wrong', 'game__message--timeout');

        // tiempo tomado en segundos (con 1 decimal)
        const timeTakenMs = Date.now() - (gameState.questionStartTime || Date.now());
        const timeTaken = Math.round((timeTakenMs / 1000) * 10) / 10;

        if (chosen === gameState.currentCorrectIndex) {
            e.currentTarget.classList.add('question-card__option--correct');
            const earned = gameState.usedDoubleForThis ? cfg.pointsPerQuestion * 2 : cfg.pointsPerQuestion;
            gameState.score += earned;
            scoreSpan.textContent = gameState.score;
            messageDiv.textContent = `¡Correcto! Ganaste ${earned} puntos.`;
            gameState.correctAnswersCount++;
            messageDiv.classList.add('game__message--correct');
            correctSound.play();
            // registrar en el historial
            gameState.history.push({
                id: q.id || gameState.currentIndex,
                text: q.text,
                chosenIndex: chosen,
                chosenText: e.currentTarget.textContent,
                correctIndex: q.answer,
                correctText: q.options[q.answer],
                correct: true,
                timeTaken,
                usedDouble: !!gameState.usedDoubleForThis
            });
        } else {
            e.currentTarget.classList.add('question-card__option--wrong');
            const correctEl = Array.from(optionsDiv.children).find(ch => parseInt(ch.dataset.index, 10) === gameState.currentCorrectIndex);
            if (correctEl) correctEl.classList.add('question-card__option--correct');
            messageDiv.textContent = `Respuesta incorrecta. La respuesta correcta era: "${q.options[q.answer]}"`;
                gameState.errorsCount++;
                if (errorsSpan) errorsSpan.textContent = gameState.errorsCount;
            messageDiv.classList.add('game__message--wrong');
            errorSound.play();
            // registrar en el historial
            gameState.history.push({
                id: q.id || gameState.currentIndex,
                text: q.text,
                chosenIndex: chosen,
                chosenText: e.currentTarget.textContent,
                correctIndex: q.answer,
                correctText: q.options[q.answer],
                correct: false,
                timeTaken,
                usedDouble: !!gameState.usedDoubleForThis
            });
        }

        if (!checkWin()) {
            nextBtn.classList.remove('hidden');
        }
    }

    function checkWin() {
        if (gameState.score >= cfg.pointsToWin) {
            endGame(true, `¡Has ganado! Alcanzaste ${gameState.score} puntos.`);
            return true;
        }
        if (gameState.errorsCount >= cfg.maxErrorsAllowed) {
            endGame(false, `Juego terminado. Has superado el límite de ${cfg.maxErrorsAllowed} errores.`);
            return true;
        }
        if (gameState.askedIndices.size >= questions.length || gameState.questionsAskedCount >= cfg.maxQuestionsPerGame) {
            endGame(false);
            return true;
        }
        return false;
    }

    function endGame(isWin = false, customMessage = '') {
        stopTimer();
        // Guardar resultado detallado y redirigir a la página correspondiente
        const totalTime = Math.round((Date.now() - gameState.gameStartTime) / 1000);
        const result = {
            name: gameState.playerName,
            score: gameState.score,
            totalTime,
            correctAnswers: gameState.correctAnswersCount,
            errors: gameState.errorsCount,
            lifelinesUsed: { ...gameState.usedLifelines },
            history: gameState.history
        };

        const lifelinesUsedCount = Object.values(gameState.usedLifelines).filter(Boolean).length;
        // Guardar la puntuación en el leaderboard
        saveScore({
            name: result.name,
            score: result.score,
            time: result.totalTime,
            errors: gameState.errorsCount,
            lifelines: lifelinesUsedCount
        });
        try {
            localStorage.setItem('quiz_result', JSON.stringify(result));
        } catch (e) {
            console.warn('No se pudo guardar el resultado en localStorage:', e);
        }
        if (isWin) {
            window.location.href = 'win.html';
            return;
        } else {
            // pérdida: redirigir a pantalla de derrota
            window.location.href = 'loser.html';
            return;
        }
        // Nota: código restante (mostrar mensaje, etc.) no se ejecutará porque redirigimos
    }

    function saveScore(playerData) {
        const leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
        leaderboard.push(playerData);
        // Lógica de ordenamiento:
        // 1. Mayor puntuación primero.
        // 2. Menor tiempo primero (en caso de empate en puntos).
        // 3. Menor cantidad de errores primero (en caso de empate en puntos y tiempo).
        // 4. Menor cantidad de comodines usados primero (en caso de empate en todo lo anterior).
        leaderboard.sort((a, b) => 
            b.score - a.score || a.time - b.time || a.errors - b.errors || a.lifelines - b.lifelines);
        const topScores = leaderboard.slice(0, 10);
        localStorage.setItem('quiz_leaderboard', JSON.stringify(topScores));
    }

    function toggleLeaderboard() {
        if (!leaderboardDisplay.classList.contains('hidden')) {
            leaderboardDisplay.classList.add('hidden');
            return;
        }

        const leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
        let html = '<h3>Mejores Jugadores</h3>';
        if (leaderboard.length === 0) {
            html += '<p>Aún no hay puntuaciones. ¡Sé el primero!</p>';
        } else {
            html += '<ol>';
            leaderboard.slice(0, 3).forEach(entry => {
                html += `<li>${entry.name} - ${entry.score} pts (${entry.time}s, ${entry.errors ?? 0} errores, ${entry.lifelines ?? 0} comodines)</li>`;
            });
            html += '</ol>';
        }
        leaderboardDisplay.innerHTML = html;
        leaderboardDisplay.classList.remove('hidden');
    }

    function nextQuestionHandler() {
        if (gameState.isGameOver) {
            resetToStart();
            return;
        }
        messageDiv.textContent = '';
        messageDiv.classList.remove('game__message--correct', 'game__message--wrong', 'game__message--timeout');
        pickRandomQuestion();
        nextBtn.classList.add('hidden');
    }

    function performSwitchQuestion() {
        gameState.askedIndices.delete(gameState.currentIndex);

        let idx;
        do {
            idx = Math.floor(Math.random() * questions.length);
        } while (gameState.askedIndices.has(idx));

        gameState.askedIndices.add(idx);
        gameState.currentIndex = idx;
        
        gameState.usedDoubleForThis = false;

        showQuestion(questions[idx]);
    }

    function toggleMute() {
        const isMuted = !muteBtn.checked;
        timerSound.muted = isMuted;
        errorSound.muted = isMuted;
        correctSound.muted = isMuted;
        winSound.muted = isMuted;
        try { localStorage.setItem('quiz_mute', String(isMuted)); } catch (e) {}
    }

    // --- Lógica de "Preguntas Recientes" para mejorar la aleatoriedad entre partidas ---
    const RECENTLY_ASKED_BUFFER_SIZE = 15; // Recordar las últimas 15 preguntas

    function getRecentlyAsked() {
        try {
            return JSON.parse(localStorage.getItem('quiz_recent_questions') || '[]');
        } catch (e) {
            return [];
        }
    }

    function updateRecentlyAsked(questionIndex) {
        let recent = getRecentlyAsked();
        recent.push(questionIndex);
        if (recent.length > RECENTLY_ASKED_BUFFER_SIZE) {
            recent.shift(); // Elimina la pregunta más antigua de la lista
        }
        localStorage.setItem('quiz_recent_questions', JSON.stringify(recent));
    }

    function setLifelinesState(enabled) {
        const lifelineButtons = [doubleBtn, switchBtn, eliminateBtn];
        lifelineButtons.forEach(btn => {
            if (enabled) {
                // Al habilitar, solo quitamos la clase temporal 'inactive'
                // La clase 'disabled' (por falta de usos) permanece si ya estaba
                btn.classList.remove('lifeline--inactive');
            } else {
                // Al deshabilitar, añadimos la clase temporal 'inactive'
                btn.classList.add('lifeline--inactive');
            }
        });
    }


    function toggleTexture() {
        document.body.classList.toggle('texture-active');
        const isTextureActive = document.body.classList.contains('texture-active');
        try { localStorage.setItem('quiz_texture_active', String(isTextureActive)); } catch (e) {}
    }

    function applyInitialTextureState() {
        try {
            const texturePref = localStorage.getItem('quiz_texture_active');
            // Activar la textura solo si la preferencia guardada es explícitamente 'true'
            if (texturePref === 'true') {
                document.body.classList.add('texture-active');
            }
        } catch (e) {}
    }
    
    async function showInstructions() {
        leaderboardDisplay.classList.add('hidden'); // Ocultar leaderboard si está abierto
        instructionsDialog.showModal();
        const instructionsTextDiv = document.getElementById('instructions-text');

        try {
            const response = await fetch('INSTRUCCIONES.txt');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de instrucciones.');
            }
            const text = await response.text();
            
            // Convertir el texto plano a un HTML simple
            const html = text.split('\n').map(line => line.trim()).filter(line => line)
                .join('\n') // Re-join with single newlines
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/---/g, '<hr>')
                .replace(/\[LIST_START\]\n((?:\* .+\n?)+)\[LIST_END\]/g, (match, listItems) => {
                    return `<ul>${listItems.replace(/\* (.*)/g, '<li>$1</li>')}</ul>`;
                }).replace(/\n/g, '<br>');

            instructionsTextDiv.innerHTML = html;
        } catch (error) {
            instructionsTextDiv.textContent = 'No se pudieron cargar las instrucciones. Por favor, intenta de nuevo más tarde.';
            console.error('Error al cargar instrucciones:', error);
        }
    }

    function hideInstructions() {
        instructionsDialog.close();
    }
    function attachEvents() {
        startBtn.addEventListener('click', startGame);
        leaderboardBtn.addEventListener('click', toggleLeaderboard);
        nextBtn.addEventListener('click', nextQuestionHandler);
        muteBtn.addEventListener('change', toggleMute);
        toggleTextureBtn.addEventListener('click', toggleTexture);
        // Admin Login Events
        adminLoginBtn.addEventListener('click', handleAdminLogin);
        adminPasswordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAdminLogin();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && adminLogin.style.display === 'flex') {
                showStartScreenActions();
            }
        });

        doubleBtn.addEventListener('click', () => {
            if (gameState.lifelineCounts.double > 0 && !gameState.usedDoubleForThis) {
                gameState.lifelineCounts.double--;
                doubleCount.textContent = gameState.lifelineCounts.double;
                gameState.usedDoubleForThis = true;
                gameState.usedLifelines.double = true;
                messageDiv.textContent = 'Duplicador activado para esta pregunta.';
                if (gameState.lifelineCounts.double <= 0) doubleBtn.classList.add('lifeline--disabled');
            }
        });

        switchBtn.addEventListener('click', () => {
            if (gameState.lifelineCounts.switch > 0) {
                gameState.lifelineCounts.switch--;
                switchCount.textContent = gameState.lifelineCounts.switch;
                gameState.usedLifelines.switch = true;
                messageDiv.textContent = 'Pregunta cambiada.';
                performSwitchQuestion();
                if (gameState.lifelineCounts.switch <= 0) switchBtn.classList.add('lifeline--disabled');
            }
        });

        eliminateBtn.addEventListener('click', () => {
            if (gameState.lifelineCounts.eliminate > 0) {
                const incorrectOptions = Array.from(optionsDiv.children).filter(opt => parseInt(opt.dataset.index, 10) !== gameState.currentCorrectIndex);
                if (incorrectOptions.length > 1) {
                    const toRemove = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
                    toRemove.style.visibility = 'hidden';
                    gameState.lifelineCounts.eliminate--;
                    eliminateCount.textContent = gameState.lifelineCounts.eliminate;
                    gameState.usedLifelines.eliminate = true;
                    messageDiv.textContent = 'Se eliminó una opción incorrecta.';
                    if (gameState.lifelineCounts.eliminate <= 0) eliminateBtn.classList.add('lifeline--disabled');
                }
            }
        });

        // Instructions events
        instructionsBtn.addEventListener('click', showInstructions);
        closeInstructionsBtn.addEventListener('click', hideInstructions);
    }

    function startTimer() {
        stopTimer();
        gameState.timeLeft = cfg.timePerQuestion;
        updateTimerFill();
        timerSound.loop = true;
        timerSound.play();
        gameState.timer = setInterval(() => {
            gameState.timeLeft -= 0.1;
            updateTimerFill();
            if (gameState.timeLeft <= 0) {
                stopTimer();
                onTimeOut();
            }
        }, 100);
    }

    function stopTimer() {
        clearInterval(gameState.timer);
        timerSound.pause();
        timerSound.currentTime = 0;
    }

    function updateTimerFill() {
        const pct = Math.max(0, gameState.timeLeft / cfg.timePerQuestion);
        timerFill.style.width = `${pct * 100}%`;
    }

    function onTimeOut() {
        Array.from(optionsDiv.children).forEach(ch => ch.style.pointerEvents = 'none');
        setLifelinesState(false); // Deshabilitar comodines si se acaba el tiempo
            gameState.errorsCount++;
            if (errorsSpan) errorsSpan.textContent = gameState.errorsCount;
        messageDiv.textContent = 'Tiempo agotado. Se marcó como fallo. 😟';
        messageDiv.classList.add('game__message--timeout');
        errorSound.play();
        if (!checkWin()) {
            nextBtn.classList.remove('hidden');
        }
    }

    init();
});