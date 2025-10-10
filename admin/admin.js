document.addEventListener('DOMContentLoaded', () => {
    const configForm = document.getElementById('config-form');
    const addQuestionForm = document.getElementById('add-question-form');
    const questionListDiv = document.getElementById('question-list');

    const pointsPerQuestionInput = document.getElementById('points-per-question');
    const pointsToWinInput = document.getElementById('points-to-win');
    const doubleStartInput = document.getElementById('double-start');
    const switchStartInput = document.getElementById('switch-start');
    const timePerQuestionInput = document.getElementById('time-per-question');
    const maxErrorsInput = document.getElementById('max-errors');
    const maxQuestionsInput = document.getElementById('max-questions');

    const questionTextInput = document.getElementById('question-text');
    const questionOptionsInput = document.getElementById('question-options');
    const questionAnswerInput = document.getElementById('question-answer');

    let config = {};

    function loadConfig() {
        const rawConfig = localStorage.getItem('quiz_config');
        config = rawConfig ? JSON.parse(rawConfig) : {};

        pointsPerQuestionInput.value = config.pointsPerQuestion || 2;
        pointsToWinInput.value = config.pointsToWin || 10;
        doubleStartInput.value = config.doubleStart || 2;
        switchStartInput.value = config.switchStart || 1;
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
        config.timePerQuestion = parseInt(timePerQuestionInput.value, 10);
        config.maxErrorsAllowed = parseInt(maxErrorsInput.value, 10);
        config.maxQuestionsPerGame = parseInt(maxQuestionsInput.value, 10);

        localStorage.setItem('quiz_config', JSON.stringify(config));
        alert('Configuración guardada');
    }

    function renderQuestions() {
        questionListDiv.innerHTML = '';
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
            config.questions.splice(index, 1);
            saveQuestions();
            renderQuestions();
        }
    }

    function saveQuestions() {
        localStorage.setItem('quiz_config', JSON.stringify(config));
    }

    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveConfig();
    });

    addQuestionForm.addEventListener('submit', addQuestion);

    questionListDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = parseInt(e.target.dataset.index, 10);
            deleteQuestion(index);
        }
    });

    loadConfig();
});
