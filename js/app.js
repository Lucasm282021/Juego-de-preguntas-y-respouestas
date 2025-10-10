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

    // Game State
    const gameState = {
        score: 0,
        currentIndex: null,
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
    };

    let cfg = {};
    let questions = [];

    async function init() {
        await loadConfig();
        resetToStart();
        attachEvents();
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
                // Handle error, maybe show a message to the user
            }
        }
        questions = cfg.questions || [];
    }

    function resetToStart() {
        gameState.score = 0;
        gameState.askedIndices.clear();
        gameState.questionsAskedCount = 0;
        gameState.errorsCount = 0;
        gameState.correctAnswersCount = 0;
        gameState.playerName = '';
        gameState.isGameOver = false;

        gameState.lifelines = {
            double: cfg.doubleStart,
            switch: cfg.switchStart,
            eliminate: 1,
        };

        scoreSpan.textContent = gameState.score;
        targetSpan.textContent = cfg.pointsToWin;
        doubleCount.textContent = gameState.lifelines.double;
        switchCount.textContent = gameState.lifelines.switch;
        eliminateCount.textContent = gameState.lifelines.eliminate;

        nextBtn.textContent = 'Siguiente';
        messageDiv.textContent = '';
        stopTimer();
        if (timerFill) timerFill.style.width = '100%';
        gameScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    }

    function startGame() {
        const name = prompt('Por favor, ingresa tu nombre:', 'Jugador');
        gameState.playerName = name || 'Jugador';
        gameState.gameStartTime = Date.now();
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        pickRandomQuestion();
    }

    function pickRandomQuestion() {
        gameState.usedDoubleForThis = false;
        if (gameState.askedIndices.size >= questions.length || gameState.questionsAskedCount >= cfg.maxQuestionsPerGame) {
            endGame(false);
            return;
        }

        let idx;
        do {
            idx = Math.floor(Math.random() * questions.length);
        } while (gameState.askedIndices.has(idx));

        gameState.askedIndices.add(idx);
        gameState.currentIndex = idx;
        gameState.questionsAskedCount++;
        showQuestion(questions[idx]);
    }

    function showQuestion(q) {
        qText.textContent = q.text;
        optionsDiv.innerHTML = '';
        q.options.forEach((opt, i) => {
            const b = document.createElement('div');
            b.className = 'question-card__option';
            b.textContent = opt;
            b.dataset.index = i;
            b.addEventListener('click', onChoose);
            optionsDiv.appendChild(b);
        });
        startTimer();
    }

    function onChoose(e) {
        const chosen = parseInt(e.currentTarget.dataset.index, 10);
        const q = questions[gameState.currentIndex];
        Array.from(optionsDiv.children).forEach(ch => ch.style.pointerEvents = 'none');
        stopTimer();
        messageDiv.classList.remove('game__message--correct', 'game__message--wrong', 'game__message--timeout');

        if (chosen === q.answer) {
            e.currentTarget.classList.add('question-card__option--correct');
            const earned = gameState.usedDoubleForThis ? cfg.pointsPerQuestion * 2 : cfg.pointsPerQuestion;
            gameState.score += earned;
            scoreSpan.textContent = gameState.score;
            messageDiv.textContent = `¡Correcto! Ganaste ${earned} puntos.`;
            gameState.correctAnswersCount++;
            messageDiv.classList.add('game__message--correct');
        } else {
            e.currentTarget.classList.add('question-card__option--wrong');
            const correctEl = Array.from(optionsDiv.children).find(ch => parseInt(ch.dataset.index, 10) === q.answer);
            if (correctEl) correctEl.classList.add('question-card__option--correct');
            messageDiv.textContent = `Respuesta incorrecta. La respuesta correcta era: "${q.options[q.answer]}"`;
            gameState.errorsCount++;
            messageDiv.classList.add('game__message--wrong');
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
        const totalTime = Math.round((Date.now() - gameState.gameStartTime) / 1000);
        saveScore({ name: gameState.playerName, score: gameState.score, time: totalTime });

        let finalMessage = customMessage;
        if (!finalMessage) {
            finalMessage = isWin ? `¡Has ganado!` : `Fin del juego. No cumpliste el objetivo. Puntuación: ${gameState.score}.`;
        }

        messageDiv.innerHTML = `${finalMessage}`;
        Array.from(optionsDiv.children).forEach(ch => ch.style.pointerEvents = 'none');
        gameState.isGameOver = true;
        nextBtn.textContent = 'Jugar de Nuevo';
        nextBtn.classList.remove('hidden');
    }

    function saveScore(playerData) {
        const leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
        leaderboard.push(playerData);
        leaderboard.sort((a, b) => b.score - a.score || a.time - a.time);
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
                html += `<li>${entry.name} - ${entry.score} pts (${entry.time}s)</li>`;
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

    function attachEvents() {
        startBtn.addEventListener('click', startGame);
        leaderboardBtn.addEventListener('click', toggleLeaderboard);
        nextBtn.addEventListener('click', nextQuestionHandler);

        doubleBtn.addEventListener('click', () => {
            if (gameState.lifelines.double > 0 && !gameState.usedDoubleForThis) {
                gameState.lifelines.double--;
                doubleCount.textContent = gameState.lifelines.double;
                gameState.usedDoubleForThis = true;
                messageDiv.textContent = 'Duplicador activado para esta pregunta.';
                if (gameState.lifelines.double <= 0) doubleBtn.classList.add('lifeline--disabled');
            }
        });

        switchBtn.addEventListener('click', () => {
            if (gameState.lifelines.switch > 0) {
                gameState.lifelines.switch--;
                switchCount.textContent = gameState.lifelines.switch;
                messageDiv.textContent = 'Pregunta cambiada.';
                pickRandomQuestion();
                if (gameState.lifelines.switch <= 0) switchBtn.classList.add('lifeline--disabled');
            }
        });

        eliminateBtn.addEventListener('click', () => {
            if (gameState.lifelines.eliminate > 0) {
                const q = questions[gameState.currentIndex];
                const incorrectOptions = Array.from(optionsDiv.children).filter(opt => parseInt(opt.dataset.index, 10) !== q.answer);
                if (incorrectOptions.length > 1) {
                    const toRemove = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
                    toRemove.style.visibility = 'hidden';
                    gameState.lifelines.eliminate--;
                    eliminateCount.textContent = gameState.lifelines.eliminate;
                    messageDiv.textContent = 'Se eliminó una opción incorrecta.';
                    if (gameState.lifelines.eliminate <= 0) eliminateBtn.classList.add('lifeline--disabled');
                }
            }
        });
    }

    function startTimer() {
        stopTimer();
        gameState.timeLeft = cfg.timePerQuestion;
        updateTimerFill();
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
    }

    function updateTimerFill() {
        const pct = Math.max(0, gameState.timeLeft / cfg.timePerQuestion);
        timerFill.style.width = `${pct * 100}%`;
    }

    function onTimeOut() {
        Array.from(optionsDiv.children).forEach(ch => ch.style.pointerEvents = 'none');
        gameState.errorsCount++;
        messageDiv.textContent = 'Tiempo agotado. Se marcó como fallo. 😟';
        messageDiv.classList.add('game__message--timeout');
        if (!checkWin()) {
            nextBtn.classList.remove('hidden');
        }
    }

    init();
});