document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const configForm = document.getElementById('config-form');
    const addQuestionForm = document.getElementById('add-question-form');
    const questionListDiv = document.getElementById('question-list');

    // Botones de acciones
    const saveConfigBtn = document.getElementById('save-config-btn');
    const deleteRankingBtn = document.getElementById('delete-ranking-btn');
    const restoreConfigBtn = document.getElementById('restore-config-btn');

    // Campos de configuración
    const pointsPerQuestionInput = document.getElementById('points-per-question');
    const pointsToWinInput = document.getElementById('points-to-win');
    const doubleStartInput = document.getElementById('double-start');
    const switchStartInput = document.getElementById('switch-start');
    const eliminateStartInput = document.getElementById('eliminate-start');
    const timePerQuestionInput = document.getElementById('time-per-question');
    const maxErrorsInput = document.getElementById('max-errors');
    const maxQuestionsInput = document.getElementById('max-questions');

    // Campos para añadir preguntas
    const questionTextInput = document.getElementById('question-text');
    const questionOptionsInput = document.getElementById('question-options');
    const questionAnswerInput = document.getElementById('question-answer');

    let config = {};

    // --- Lógica de Autenticación ---
    function validateAdmin() {
        const password = prompt('Para confirmar la acción, por favor ingresa la contraseña de administrador:');
        if (password === '31381993') {
            return true;
        } else {
            if (password !== null) { // No mostrar alerta si el usuario cancela el prompt
                alert('Contraseña incorrecta. Acción cancelada.');
            }
            return false;
        }
    }

    // --- Lógica de Configuración ---
    function loadConfig() {
        const rawConfig = localStorage.getItem('quiz_config');
        config = rawConfig ? JSON.parse(rawConfig) : {};

        pointsPerQuestionInput.value = config.pointsPerQuestion || 2;
        pointsToWinInput.value = config.pointsToWin || 10;
        doubleStartInput.value = config.doubleStart || 2;
        switchStartInput.value = config.switchStart || 1;
        eliminateStartInput.value = config.eliminateStart || 1;
        timePerQuestionInput.value = config.timePerQuestion || 15;
        maxErrorsInput.value = config.maxErrorsAllowed || 3;
        maxQuestionsInput.value = config.maxQuestionsPerGame || 10;

        renderQuestions();
    }

    function saveConfig() {
        config.pointsPerQuestion = parseInt(pointsPerQuestionInput.value, 10);
        config.pointsToWin = parseInt(pointsToWinInput.value, 10);
        config.doubleStart = parseInt(doubleStartInput.value, 10);
        config.switchStart = parseInt(switchStartInput.value, 10);
        config.eliminateStart = parseInt(eliminateStartInput.value, 10);
        config.timePerQuestion = parseInt(timePerQuestionInput.value, 10);
        config.maxErrorsAllowed = parseInt(maxErrorsInput.value, 10);
        config.maxQuestionsPerGame = parseInt(maxQuestionsInput.value, 10);

        localStorage.setItem('quiz_config', JSON.stringify(config));
        alert('Configuración guardada');
    }

    // --- Lógica de Preguntas ---
    function renderQuestions() {
        questionListDiv.innerHTML = '';
        const questionCount = document.getElementById('question-count');
        if (questionCount) {
            questionCount.textContent = `(${config.questions ? config.questions.length : 0})`;
        }

        if (!config.questions || config.questions.length === 0) {
            questionListDiv.innerHTML = '<p>No hay preguntas definidas.</p>';
            return;
        }

        config.questions.forEach((q, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <span>${q.text}</span>
                <button data-index="${index}">Eliminar</button>
            `;
            questionListDiv.appendChild(questionItem);
        });
    }

    function addQuestion(e) {
        e.preventDefault();
        if (!validateAdmin()) return;

        const text = questionTextInput.value.trim();
        const options = questionOptionsInput.value.split(',').map(opt => opt.trim());
        const answer = parseInt(questionAnswerInput.value, 10);

        if (text && options.length > 1 && !isNaN(answer) && answer >= 0 && answer < options.length) {
            const newQuestion = {
                id: config.questions ? config.questions.length + 1 : 1,
                text,
                options,
                answer
            };

            if (!config.questions) {
                config.questions = [];
            }
            config.questions.push(newQuestion);
            saveQuestions();
            renderQuestions();
            addQuestionForm.reset();
        } else {
            alert('Por favor, completa todos los campos correctamente.');
        }
    }

    function deleteQuestion(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
            if (!validateAdmin()) return;
            config.questions.splice(index, 1);
            saveQuestions();
            renderQuestions();
        }
    }

    function saveQuestions() {
        // Esta función ahora solo guarda, la validación se hace antes de llamarla
        localStorage.setItem('quiz_config', JSON.stringify(config));
    }

    // --- Event Listeners ---

    // Listener para el botón de guardar configuración
    saveConfigBtn.addEventListener('click', () => {
        if (validateAdmin()) {
            saveConfig();
        }
    });

    // Listener para el formulario de añadir pregunta
    addQuestionForm.addEventListener('submit', addQuestion);

    // Listener para la lista de preguntas (para borrar)
    questionListDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = parseInt(e.target.dataset.index, 10);
            deleteQuestion(index);
        }
    });

    // Listener para borrar el ranking
    deleteRankingBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el ranking de jugadores? Esta acción no se puede deshacer.')) {
            if (validateAdmin()) {
                localStorage.removeItem('quiz_leaderboard');
                alert('El ranking ha sido borrado.');
            }
        }
    });

    // Listener para restaurar la configuración
    restoreConfigBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Se perderán todos los ajustes y las preguntas que hayas añadido.')) {
            if (validateAdmin()) {
                localStorage.removeItem('quiz_config');
                alert('La configuración ha sido restaurada a los valores por defecto. La página se recargará para aplicar los cambios.');
                location.reload();
            }
        }
    });

    // Carga inicial
    loadConfig();
});