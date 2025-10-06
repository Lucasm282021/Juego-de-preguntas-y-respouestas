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

function loadConfig(){
    const raw = localStorage.getItem('quiz_config');
    if(raw){
        try{ return JSON.parse(raw); }catch(e){ console.error('Error parsing config',e); }
    }
    return defaultConfig;
}

const cfg = loadConfig();
let questions = cfg.questions || defaultConfig.questions;

function refreshQuestionsFromConfig(){
    if(forceDefault){
        questions = defaultConfig.questions;
    } else {
        const c = loadConfig();
        questions = (c && c.questions) ? c.questions : defaultConfig.questions;
    }
}

// Estado del juego (configurable desde admin)
let pointsPerQuestion = cfg.pointsPerQuestion || defaultConfig.pointsPerQuestion;
let pointsToWin = cfg.pointsToWin || defaultConfig.pointsToWin;
let lifelines = { double: cfg.doubleStart || defaultConfig.doubleStart, switch: cfg.switchStart || defaultConfig.switchStart };

let state = {
    score: 0,
    currentIndex: null,
    usedDoubleForThis: false
};

// Reglas específicas
const MAX_QUESTIONS_PER_GAME = 5;
const MAX_ERRORS_ALLOWED = 2;

// temporizador (se carga desde cfg.timePerQuestion o por defecto 10s)
let timePerQuestion = cfg.timePerQuestion || 10;
let timer = null;
let timeLeft = timePerQuestion;
let askedIndices = new Set();
let questionsAskedCount = 0;
let errorsCount = 0;
// límites de comodines por juego
let lifelineLimits = { double: 1, switch: 1, eliminate: 1 };


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
const playerNameInput = document.getElementById('player-name');
const playerEmailInput = document.getElementById('player-email');
// modal removido: usaremos messageDiv para mostrar avisos

// Nota: el panel admin fue movido a /admin/index.html; la configuración se carga desde localStorage
const questionListDiv = document.getElementById('question-list');
const useDefaultBtn = document.getElementById('use-default-questions');
const configInfoDiv = document.getElementById('config-info');
let forceDefault = true; // por defecto usamos las preguntas internas en app.js

function init(){
    // asegurarse de cargar las preguntas desde la configuración forzada/actual
    refreshQuestionsFromConfig();
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
    state.score = 0;
    scoreSpan.textContent = state.score;
    // usar valores cargados desde la configuración (localStorage)
    pointsPerQuestion = cfg.pointsPerQuestion || pointsPerQuestion;
    pointsToWin = cfg.pointsToWin || pointsToWin;
    targetSpan.textContent = pointsToWin;
    lifelines.double = cfg.doubleStart || lifelines.double;
    lifelines.switch = cfg.switchStart || lifelines.switch;
    // tiempo por pregunta
    timePerQuestion = cfg.timePerQuestion || timePerQuestion;
    timeLeft = timePerQuestion;
        // mostrar los límites por juego (1 por diseño)
        doubleCount.textContent = lifelineLimits.double;
        switchCount.textContent = lifelineLimits.switch;
        eliminateCount.textContent = lifelineLimits.eliminate;
    messageDiv.textContent = '';
    // asegurar que no haya timer activo ni modal visible al cargar
    stopTimer();
        messageDiv.textContent = '';
    if(timerFill) timerFill.style.width = '100%';
    // ocultar la UI de juego hasta que inicien
    document.getElementById('game').classList.add('hidden');
    startScreen.classList.remove('hidden');
    askedIndices.clear();
    questionsAskedCount = 0;
    errorsCount = 0;
}

    function pickRandomQuestion(){
        state.usedDoubleForThis = false;
        if(questionsAskedCount >= MAX_QUESTIONS_PER_GAME){
            endGame();
            return;
        }
        // escoger pregunta no repetida
        let attempts = 0;
        let idx;
        do{
            idx = Math.floor(Math.random()*questions.length);
            attempts++;
            if(attempts>100) break;
        }while(askedIndices.has(idx) && askedIndices.size < questions.length);
        askedIndices.add(idx);
        state.currentIndex = idx;
        questionsAskedCount++;
        showQuestion(questions[idx]);
    }

    function showQuestion(q){
        qText.textContent = q.text;
        optionsDiv.innerHTML = '';
        q.options.forEach((opt,i)=>{
            const b = document.createElement('div');
            b.className = 'option';
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
        const q = questions[state.currentIndex];
        // disable options
        Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
        stopTimer();
        if(chosen === q.answer){
            e.currentTarget.classList.add('correct');
            // sumar puntos
            const earned = state.usedDoubleForThis ? pointsPerQuestion*2 : pointsPerQuestion;
            state.score += earned;
            scoreSpan.textContent = state.score;
            messageDiv.textContent = `¡Correcto! Ganaste ${earned} puntos.`;
        } else {
            e.currentTarget.classList.add('wrong');
            // marcar la correcta
            const correctEl = Array.from(optionsDiv.children).find(ch=>parseInt(ch.dataset.index,10)===q.answer);
            if(correctEl) correctEl.classList.add('correct');
            messageDiv.textContent = 'Respuesta incorrecta.';
            errorsCount++;
        }

        checkWin();
        nextBtn.classList.remove('hidden');
    }

    function checkWin(){
        if(state.score >= pointsToWin){
            messageDiv.textContent = `¡Has ganado! Alcanzaste ${state.score} puntos.`;
            // bloquear opciones
            Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
            nextBtn.classList.add('hidden');
        }
        if(errorsCount > MAX_ERRORS_ALLOWED){
            // perder el juego
                messageDiv.textContent = 'Juego terminado. Has errado más de '+MAX_ERRORS_ALLOWED+' preguntas. Perdiste.';
            endGame();
        }
    }

    nextBtn.addEventListener('click', ()=>{
        pickRandomQuestion();
        nextBtn.classList.add('hidden');
    });

    function attachEvents(){
        doubleBtn.addEventListener('click', ()=>{
            if(lifelineLimits.double<=0){ alert('Solo puedes usar un comodín de duplicar por juego.'); return; }
            if(state.usedDoubleForThis){ alert('Ya usaste duplicar en esta pregunta.'); return; }
            lifelineLimits.double -= 1;
            doubleCount.textContent = lifelineLimits.double;
            state.usedDoubleForThis = true;
            messageDiv.textContent = 'Duplicador activado para esta pregunta.';
        });

        switchBtn.addEventListener('click', ()=>{
            if(lifelineLimits.switch<=0){ alert('Solo puedes cambiar una pregunta por juego.'); return; }
            lifelineLimits.switch -=1;
            switchCount.textContent = lifelineLimits.switch;
            messageDiv.textContent = 'Pregunta cambiada.';
            pickRandomQuestion();
        });

        eliminateBtn.addEventListener('click', ()=>{
            if(lifelineLimits.eliminate<=0){ alert('No tienes comodines de eliminar opción.'); return; }
            // eliminar una opción incorrecta visible
            const q = questions[state.currentIndex];
            const optionEls = Array.from(optionsDiv.children);
            const incorrectEls = optionEls.filter(ch=>parseInt(ch.dataset.index,10)!==q.answer && !ch.classList.contains('removed'));
            if(incorrectEls.length===0){ alert('No hay opciones para eliminar.'); return; }
            // eliminar aleatoria
            const rem = incorrectEls[Math.floor(Math.random()*incorrectEls.length)];
            rem.classList.add('removed');
            rem.style.opacity = '0.35';
            rem.style.pointerEvents = 'none';
            lifelineLimits.eliminate -=1;
            eliminateCount.textContent = lifelineLimits.eliminate;
            messageDiv.textContent = 'Se eliminó una opción incorrecta.';
        });

    // Start game
    startBtn.addEventListener('click', ()=>{
        const name = playerNameInput.value.trim();
        const email = playerEmailInput.value.trim();
        if(!name || !email){ alert('Ingresa nombre y correo para continuar.'); return; }
        // guardar jugador (temporal)
        localStorage.setItem('quiz_player', JSON.stringify({name,email}));
        // mostrar juego
        startScreen.classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        // comenzar primera pregunta
        pickRandomQuestion();
    });

    if(useDefaultBtn){
        useDefaultBtn.addEventListener('click', ()=>{
            forceDefault = true;
            refreshQuestionsFromConfig();
            renderQuestionList();
            updateConfigInfo();
            alert('Se están usando las preguntas internas (app.js).');
        });
    }

    // el flujo de siguiente se maneja con el botón 'Siguiente' visible (nextBtn)

}

function startTimer(){
    stopTimer();
    timeLeft = timePerQuestion;
    updateTimerFill();
    timer = setInterval(()=>{
        timeLeft -= 0.2; // smoother
        if(timeLeft<=0){
            stopTimer();
            onTimeOut();
        }
        updateTimerFill();
    },200);
}

function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }

function updateTimerFill(){
    const pct = Math.max(0, Math.min(1, timeLeft / timePerQuestion));
    timerFill.style.width = (pct*100)+'%';
}

function onTimeOut(){
    // marcar como fallo y mostrar modal
    Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
    errorsCount++;
    messageDiv.textContent = 'Tiempo agotado. Se marcó como fallo.';
    nextBtn.classList.remove('hidden');
}

// funciones modal removidas: showModal/hideModal

function endGame(){
    stopTimer();
    // mostrar resumen
    messageDiv.textContent = 'Fin del juego. Puntos: '+state.score+' - Errores: '+errorsCount;
    // bloquear UI
    Array.from(optionsDiv.children).forEach(ch=>ch.style.pointerEvents='none');
}

function renderQuestionList(){
    if(!questionListDiv) return; // no hay lugar para mostrar la lista en la página principal
    questionListDiv.innerHTML = '';
    questions.forEach(q=>{
        const d = document.createElement('div');
        d.className = 'question-item';
        d.textContent = q.text;
        questionListDiv.appendChild(d);
    });
}

init();
