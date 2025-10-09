// Juego de preguntas simple
// Cargar configuración desde localStorage (guardada por admin/index.html)
const defaultConfig = {
    pointsPerQuestion: 2,
    pointsToWin: 10,
    doubleStart: 2,
    switchStart: 1,
    questions: [
        {id:1, text:'¿Cuál es una buena práctica para crear contraseñas seguras?', options:['Usar tu fecha de nacimiento','Usar palabras comunes','Combinar letras, números y símbolos'], answer:2},
        {id:2, text:'¿Cada cuánto tiempo deberías cambiar tus contraseñas?', options:['Nunca','Cada 6 meses o menos','Solo si olvidas la contraseña'], answer:1},
        {id:3, text:'¿Es recomendable usar la misma contraseña en diferentes servicios?', options:['Sí, para recordarlas fácilmente','No, cada servicio debe tener una contraseña única','Solo si es una contraseña muy segura'], answer:1},
        {id:4, text:'¿Qué es la autenticación en dos pasos?', options:['Un tipo de contraseña doble','Un método que requiere dos formas de verificación','Un sistema de respaldo'], answer:1},
        {id:5, text:'¿Por qué es importante actualizar el software regularmente?', options:['Para tener nuevas funciones','Para evitar que se vuelva lento','Para corregir vulnerabilidades de seguridad'], answer:2},
        {id:6, text:'¿Qué tipo de redes Wi-Fi deberías evitar?', options:['Las que no requieren contraseña','Las de tu casa','Las que tienen nombre largo'], answer:0},
        {id:7, text:'¿Qué significa cifrar tus datos?', options:['Guardarlos en la nube','Protegerlos con contraseña','Convertirlos en un formato ilegible sin clave'], answer:2},
        {id:8, text:'¿Qué es un firewall?', options:['Un antivirus','Un sistema que bloquea accesos no autorizados','Un tipo de malware'], answer:1},
        {id:9, text:'¿Qué debes hacer si pierdes tu dispositivo móvil?', options:['Esperar a que alguien lo devuelva','Bloquearlo y cambiar tus contraseñas','Publicarlo en redes sociales'], answer:1},
        {id:10, text:'¿Es seguro guardar contraseñas en el navegador?', options:['Sí, siempre','No, es mejor usar un gestor de contraseñas','Solo si el navegador es confiable'], answer:1},
        {id:11, text:'¿Qué es el phishing?', options:['Un sistema de respaldo','Un ataque que busca robar información personal mediante engaños','Un tipo de antivirus'], answer:1},
        {id:12, text:'¿Cómo identificar un correo electrónico fraudulento?', options:['Tiene errores ortográficos y urgencia','Viene de tu jefe','Tiene un logo official'], answer:0},
        {id:13, text:'¿Qué es un malware?', options:['Un tipo de hardware','Un software malicioso','Un sistema operativo'], answer:1},
        {id:14, text:'¿Qué es un ransomware?', options:['Un virus que borra tus archivos','Un software que secuestra tus datos y pide rescate','Un programa de respaldo'], answer:1},
        {id:15, text:'¿Qué señales indican que tu equipo podría estar infectado?', options:['Lentitud, ventanas emergentes, comportamiento extraño','Mayor velocidad','Silencio total del sistema'], answer:0},
        {id:16, text:'¿Qué es un ataque de ingeniería social?', options:['Un ataque físico','Manipulación psicológica para obtener información','Un error técnico'], answer:1},
        {id:17, text:'¿Qué es el spoofing?', options:['Suplantación de identidad digital','Un tipo de firewall','Un sistema de respaldo'], answer:0},
        {id:18, text:'¿Qué tipo de archivos adjuntos pueden ser peligrosos?', options:['.exe, .zip, .scr','.txt','.jpg'], answer:0},
        {id:19, text:'¿Qué es un keylogger?', options:['Un programa que registra tus pulsaciones de teclado','Un antivirus','Un sistema de respaldo'], answer:0},
        {id:20, text:'¿Qué es el pharming?', options:['Redireccionar a sitios falsos sin que el usuario lo note','Cultivar datos','Un tipo de phishing físico'], answer:0},
        {id:21, text:'¿Es seguro compartir información personal en redes sociales?', options:['Sí, si tienes pocos seguidores','No, puede ser usada en tu contra','Solo si es tu nombre'], answer:1},
        {id:22, text:'¿Qué precauciones debes tomar al descargar archivos de internet?', options:['Verificar la fuente y escanear con antivirus','Descargar todo lo que parezca útil','Usar redes públicas'], answer:0},
        {id:23, text:'¿Qué es una VPN y cuándo deberías usarla?', options:['Una red privada para navegar seguro','Un tipo de navegador','Un antivirus'], answer:0},
        {id:24, text:'¿Qué tipo de sitios web son más vulnerables a ataques?', options:['Sitios sin HTTPS','Sitios gubernamentales','Sitios con muchos colores'], answer:0},
        {id:25, text:'¿Qué debes hacer si recibes un mensaje sospechoso por WhatsApp?', options:['Reenviarlo','No abrirlo y reportarlo','Responder para confirmar'], answer:1},
        {id:26, text:'¿Es seguro hacer clic en enlaces acortados?', options:['Sí, siempre','No, pueden ocultar destinos maliciosos','Solo si son de amigos'], answer:1},
        {id:27, text:'¿Qué información nunca deberías compartir por correo electrónico?', options:['Tu nombre','Contraseñas y datos bancarios','Opiniones personales'], answer:1},
        {id:28, text:'¿Qué es el robo de identidad digital?', options:['Usar tu nombre en redes','Acceder y usar tus datos personales sin permiso','Crear un perfil falso'], answer:1},
        {id:29, text:'¿Qué debes revisar antes de instalar una aplicación?', options:['Opiniones y permisos solicitados','El ícono','Si es gratuita'], answer:0},
        {id:30, text:'¿Qué hacer si crees que tu cuenta ha sido comprometida?', options:['Ignorar el problema','Cambiar la contraseña y activar autenticación en dos pasos','Borrar la cuenta'], answer:1}
    ]
};

// Carga la configuración desde localStorage o devuelve la configuración por defecto.
function loadConfig(){
    const raw = localStorage.getItem('quiz_config');
    if(raw){
        // Fusiona la configuración guardada con la por defecto para asegurar que todas las claves existan.
        try{ return { ...defaultConfig, ...JSON.parse(raw) }; }catch(e){ console.error('Error al analizar la configuración guardada:',e); }
    }
    return defaultConfig;
}

const cfg = loadConfig();
// Forzamos el uso de las preguntas definidas en este archivo (defaultConfig),
// ignorando las que puedan existir en localStorage para cumplir con el requisito.
// Las otras configuraciones del juego (puntos, comodines) sí se cargarán desde localStorage si existen.
let questions = defaultConfig.questions;

// Esta función parece redundante y no se usa de forma consistente. Se puede eliminar.
// La lógica de carga de preguntas se simplificará.
/*
function refreshQuestionsFromConfig(){
    if(forceDefault){
        questions = defaultConfig.questions;
    } else {
        const c = loadConfig();
        questions = (c && c.questions) ? c.questions : defaultConfig.questions;
    }
}
*/

// Estado del juego
const gameState = {
    score: 0,
    currentIndex: null,
    usedDoubleForThis: false,
    askedIndices: new Set(),
    questionsAskedCount: 0,
    errorsCount: 0,
    correctAnswersCount: 0, // Nuevo contador para respuestas correctas
    timer: null,
    timeLeft: 0,
    playerName: '',
    gameStartTime: 0
};


// DOM
const qText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const scoreSpan = document.getElementById('score');
const targetSpan = document.getElementById('target');
const nextBtn = document.getElementById('next-btn');
const messageDiv = document.getElementById('message');
const doubleBtn = document.getElementById('double-btn');
const switchBtn = document.getElementById('switch-btn');
const doubleCount = document.getElementById('double-count');
const switchCount = document.getElementById('switch-count');
const eliminateBtn = document.getElementById('eliminate-btn');
const eliminateCount = document.getElementById('eliminate-count');
const timerFill = document.getElementById('timer-fill');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardDisplay = document.getElementById('leaderboard-display');

// Nota: el panel admin fue movido a /admin/index.html; la configuración se carga desde localStorage
const questionListDiv = document.getElementById('question-list');
const useDefaultBtn = document.getElementById('use-default-questions');
const configInfoDiv = document.getElementById('config-info');
let forceDefault = true; // por defecto usamos las preguntas internas en app.js

function init(){
    // asegurarse de cargar las preguntas desde la configuración forzada/actual
    // refreshQuestionsFromConfig(); // Eliminado para simplificar
    renderQuestionList();
    resetToStart();
    attachEvents();
    updateConfigInfo();
}

function updateConfigInfo(){
    const raw = localStorage.getItem('quiz_config');
    if(forceDefault){
        if(configInfoDiv) configInfoDiv.textContent = 'Usando preguntas internas (defaultConfig).';
        console.log('Using defaultConfig (forced)');
        return;
    }
    if(raw){
        try{ const c = JSON.parse(raw); if(configInfoDiv) configInfoDiv.textContent = `Configuración cargada desde localStorage. Preguntas: ${ (c.questions||[]).length }`; console.log('Loaded config from localStorage',c); return; }catch(e){ if(configInfoDiv) configInfoDiv.textContent = 'Config en localStorage inválida'; }
    }
    if(configInfoDiv) configInfoDiv.textContent = 'Usando preguntas internas (defaultConfig).';
}

function resetToStart(){
    gameState.score = 0;
    gameState.askedIndices.clear();
    gameState.questionsAskedCount = 0;
    gameState.errorsCount = 0;
    gameState.correctAnswersCount = 0;

    // Reiniciar comodines disponibles para el juego
    gameState.lifelines = {
        double: cfg.doubleStart,
        switch: cfg.switchStart,
        eliminate: 1 // Asumiendo que este comodín siempre empieza en 1
    };

    scoreSpan.textContent = gameState.score;
    targetSpan.textContent = cfg.pointsToWin;
    doubleCount.textContent = gameState.lifelines.double;
    switchCount.textContent = gameState.lifelines.switch;
    eliminateCount.textContent = gameState.lifelines.eliminate;

    messageDiv.textContent = '';
    stopTimer();
    if(timerFill) timerFill.style.width = '100%';
    document.getElementById('game').classList.add('hidden');
    startScreen.classList.remove('hidden');
}

    function pickRandomQuestion(){
        gameState.usedDoubleForThis = false;
        if(gameState.questionsAskedCount >= cfg.maxQuestionsPerGame){
            endGame(false); // Especificar que es una derrota
            return;
        }
        // escoger pregunta no repetida
        let attempts = 0;
        let idx;
        do{
            idx = Math.floor(Math.random()*questions.length);
            attempts++;
            if(attempts > 100) { endGame(false, "No se encontraron más preguntas únicas."); return; }
        }while(gameState.askedIndices.has(idx) && gameState.askedIndices.size < questions.length);
        gameState.askedIndices.add(idx);
        gameState.currentIndex = idx;
        gameState.questionsAskedCount++;
        showQuestion(questions[idx]);
    }

    function showQuestion(q){
        qText.textContent = q.text;
        optionsDiv.innerHTML = '';
        q.options.forEach((opt,i)=>{
            const b = document.createElement('div');
            b.className = 'question-card__option';
            b.textContent = opt;
            b.dataset.index = i;
            b.addEventListener('click', onChoose);
            optionsDiv.appendChild(b);
        });
        // iniciar temporizador
        startTimer();
    }

    function onChoose(e){
        const chosen = parseInt(e.currentTarget.dataset.index,10);
        const q = questions[gameState.currentIndex];
        // disable options
        Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
        stopTimer();
        messageDiv.classList.remove('game__message--correct', 'game__message--wrong', 'game__message--timeout'); // Limpiar clases previas

        if(chosen === q.answer){
            e.currentTarget.classList.add('question-card__option--correct');
            // sumar puntos
            const earned = gameState.usedDoubleForThis ? cfg.pointsPerQuestion*2 : cfg.pointsPerQuestion;
            gameState.score += earned;
            scoreSpan.textContent = gameState.score;
            messageDiv.textContent = `¡Correcto! Ganaste ${earned} puntos.`;
            gameState.correctAnswersCount++; // Incrementar respuestas correctas
            messageDiv.classList.add('game__message--correct');
        } else {
            e.currentTarget.classList.add('question-card__option--wrong');
            // marcar la correcta
            const correctEl = Array.from(optionsDiv.children).find(ch=>parseInt(ch.dataset.index,10)===q.answer);
            if(correctEl) correctEl.classList.add('question-card__option--correct');
            messageDiv.textContent = `Respuesta incorrecta. La respuesta correcta era: "${q.options[q.answer]}"`;
            gameState.errorsCount++;
            messageDiv.classList.add('game__message--wrong');
        }

        checkWin();
        nextBtn.classList.remove('hidden');
    }

    function checkWin(){
        const WIN_BY_CORRECT_ANSWERS = 5;

        // Condiciones de victoria inmediata
        if(gameState.score >= cfg.pointsToWin){
            endGame(true, `¡Has ganado! Alcanzaste ${gameState.score} puntos.`);
            return;
        }
        if(gameState.correctAnswersCount >= WIN_BY_CORRECT_ANSWERS){
            endGame(true, `¡Has ganado! Respondiste ${WIN_BY_CORRECT_ANSWERS} preguntas correctamente.`);
            return;
        }

        // Condición de derrota por errores
        if(gameState.errorsCount >= cfg.maxErrorsAllowed) {
            endGame(false, `Juego terminado. Has superado el límite de ${cfg.maxErrorsAllowed} errores.`);
        }
        // Condición de fin de juego por número de preguntas (se maneja en pickRandomQuestion)
        else if (gameState.questionsAskedCount >= cfg.maxQuestionsPerGame) {
            endGame(false); // Especificar que es una derrota
        }
    }

    nextBtn.addEventListener('click', ()=>{
        messageDiv.textContent = ''; // Limpiar mensaje al pasar a la siguiente
        messageDiv.classList.remove('game__message--correct', 'game__message--wrong', 'game__message--timeout');
        pickRandomQuestion();
        nextBtn.classList.add('hidden');
    });

    function attachEvents(){
        doubleBtn.addEventListener('click', ()=>{
            if(gameState.lifelines.double <= 0){ alert('No te quedan comodines para duplicar puntos.'); return; }
            if(gameState.usedDoubleForThis){ alert('Ya usaste este comodín en esta pregunta.'); return; }
            gameState.lifelines.double--;
            doubleCount.textContent = gameState.lifelines.double;
            if (gameState.lifelines.double <= 0) doubleBtn.classList.add('lifeline--disabled');
            gameState.usedDoubleForThis = true;
            messageDiv.textContent = 'Duplicador activado para esta pregunta.';
        });

        switchBtn.addEventListener('click', ()=>{
            if(gameState.lifelines.switch <= 0){ alert('No te quedan comodines para cambiar la pregunta.'); return; }
            gameState.lifelines.switch--;
            switchCount.textContent = gameState.lifelines.switch;
            if (gameState.lifelines.switch <= 0) switchBtn.classList.add('lifeline--disabled');
            messageDiv.textContent = 'Pregunta cambiada.';
            pickRandomQuestion();
        });

        eliminateBtn.addEventListener('click', ()=>{
            if(gameState.lifelines.eliminate <= 0){ alert('No te quedan comodines para eliminar opción.'); return; }
            // eliminar una opción incorrecta visible
            const q = questions[gameState.currentIndex];
            const optionEls = Array.from(optionsDiv.children);
            const incorrectEls = optionEls.filter(ch=>parseInt(ch.dataset.index,10)!==q.answer && !ch.classList.contains('removed'));
            if(incorrectEls.length===0){ alert('No hay opciones para eliminar.'); return; }
            // eliminar aleatoria
            const rem = incorrectEls[Math.floor(Math.random()*incorrectEls.length)];
            rem.classList.add('removed');
            rem.style.pointerEvents = 'none';
            gameState.lifelines.eliminate--;
            eliminateCount.textContent = gameState.lifelines.eliminate;
            if (gameState.lifelines.eliminate <= 0) eliminateBtn.classList.add('lifeline--disabled');
            messageDiv.textContent = 'Se eliminó una opción incorrecta.';
        });

    // Start game
    startBtn.addEventListener('click', ()=>{
        gameState.playerName = 'Jugador'; // Nombre por defecto
        // mostrar juego
        gameState.gameStartTime = Date.now();
        startScreen.classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        // comenzar primera pregunta
        pickRandomQuestion();
    });

    if(useDefaultBtn){
        useDefaultBtn.addEventListener('click', ()=>{
            forceDefault = true;
            questions = defaultConfig.questions; // Carga directamente las preguntas por defecto
            renderQuestionList();
            updateConfigInfo();
            alert('Se están usando las preguntas internas (app.js).');
        });
    }

    leaderboardBtn.addEventListener('click', () => {
        toggleLeaderboard();
    });

    // el flujo de siguiente se maneja con el botón 'Siguiente' visible (nextBtn)

}

function startTimer(){
    stopTimer();
    gameState.timeLeft = cfg.timePerQuestion;
    updateTimerFill();
    gameState.timer = setInterval(()=>{
        gameState.timeLeft -= 0.1; // Intervalo más frecuente para suavidad
        if(gameState.timeLeft <= 0){
            stopTimer();
            onTimeOut();
        }
        updateTimerFill();
    }, 100);
}

function stopTimer(){ if(gameState.timer){ clearInterval(gameState.timer); gameState.timer=null; } }

function updateTimerFill(){
    const pct = Math.max(0, Math.min(1, gameState.timeLeft / cfg.timePerQuestion));
    timerFill.style.width = (pct*100)+'%';
}

function onTimeOut(){
    // marcar como fallo y mostrar modal
    Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
    gameState.errorsCount++;
    messageDiv.classList.remove('game__message--correct', 'game__message--wrong');
    messageDiv.textContent = 'Tiempo agotado. Se marcó como fallo. 😟';
    messageDiv.classList.add('game__message--timeout');
    nextBtn.classList.remove('hidden');
}

// funciones modal removidas: showModal/hideModal

function endGame(isWin = false, customMessage = ''){
    stopTimer();
    const totalTime = Math.round((Date.now() - gameState.gameStartTime) / 1000);
    // Guardar siempre la puntuación con el nombre por defecto "Jugador"
    saveScore({ name: 'Jugador', score: gameState.score, time: totalTime });

    let finalMessage = customMessage;
    if (!finalMessage) {
        // Mensaje por defecto si no se gana o pierde por una razón específica
        finalMessage = isWin ? `¡Has ganado!` : `Fin del juego. No cumpliste el objetivo. Puntuación: ${gameState.score}.`;
    }
    messageDiv.innerHTML = `${finalMessage}<br>Presiona F5 para volver a jugar.`;
    // bloquear UI
    Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
    nextBtn.classList.add('hidden');
}

function saveScore(playerData) {
    const leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
    
    leaderboard.push({
        name: playerData.name,
        score: playerData.score,
        time: playerData.time
    });

    // Ordenar por puntuación (desc) y luego por tiempo (asc)
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);

    // Mantener solo los 10 mejores
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

function renderQuestionList(){
    if(!questionListDiv) return; // no hay lugar para mostrar la lista en la página principal
    questionListDiv.innerHTML = '';
    questions.forEach(q=>{
        const d = document.createElement('div');
        d.className = 'question-list__item';
        d.textContent = q.text;
        questionListDiv.appendChild(d);
    });
}

init();
