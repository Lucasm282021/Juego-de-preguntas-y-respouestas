# Juego de Preguntas y Respuestas

Este es un juego de preguntas y respuestas interactivo, desarrollado completamente con HTML, CSS y JavaScript puro (Vanilla JS). El proyecto está diseñado para ser modular y fácilmente configurable a través de un panel de administración.

## Características Principales

- **Juego Dinámico:** Preguntas y opciones se cargan y barajan aleatoriamente.
- **Sistema de Puntuación:** Los jugadores ganan puntos por respuestas correctas.
- **Comodines (Lifelines):** Incluye comodines como "Duplicar Puntos (X2)", "Cambiar Pregunta" y "50:50".
- **Temporizador:** Cada pregunta tiene un límite de tiempo para ser respondida.
- **Ranking de Jugadores:** Guarda y muestra las mejores puntuaciones, ordenadas por múltiples criterios (puntos, tiempo, errores, comodines usados).
- **Panel de Administración:** Una interfaz para configurar las reglas del juego (puntos, tiempo, etc.) y gestionar las preguntas.
- **Persistencia de Datos:** Utiliza `localStorage` para guardar la configuración del juego y el ranking de jugadores.
- **Personalización de Interfaz:** Incluye opciones para silenciar el sonido y activar/desactivar una textura de fondo.
- **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla.

Nota rápida: durante el desarrollo se añadieron páginas de resultado (`win.html` y `loser.html`) que muestran un resumen detallado de la partida (nombre, puntos, respuestas acertadas/erradas, tiempo empleado y uso de comodines). Ambas páginas comparten estilos y lógica para la renderización de resultados.

---

## Estructura del Proyecto

```
Juego-de-preguntas-y-respouestas/
├── admin/
│   ├── admin.css
│   ├── admin.js
│   └── index.html
├── css/
│   ├── style.css
│   └── result.css        # estilos compartidos para win/loser pages
├── js/
│   ├── app.js
│   ├── result.js         # lógica compartida para mostrar resultados
│   ├── win.js            # comportamiento específico para la página de victoria (confetti, audio)
│   └── loser.js          # comportamiento específico para la página de derrota (audio, temática)
├── img/
│   └── (archivos de imágenes)
├── sound/
│   └── (archivos de audio)
├── defaultConfig.json
├── index.html
├── INSTRUCCIONES.txt
├── loser.html            # página de derrota (usa result.css + loser.js)
└── win.html              # página de victoria (usa result.css + win.js)
```

---

## Funcionamiento del Código

### JavaScript (`js/app.js`)

Este es el cerebro del juego. Su lógica principal se puede dividir en las siguientes partes:

1.  **Inicialización (`init`)**:
    - Se ejecuta cuando el DOM está completamente cargado.
    - Llama a `loadConfig()` para cargar la configuración del juego.
    - Llama a `attachEvents()` para asignar todos los listeners de eventos (clics en botones, etc.).

2.  **Gestión de Configuración (`loadConfig`)**:
    - Intenta cargar la configuración desde `localStorage` (clave `quiz_config`).
    - Si no existe, la carga desde el archivo `defaultConfig.json` y la guarda en `localStorage` para futuras sesiones.

3.  **Estado del Juego (`gameState`)**:
    - Un objeto central que almacena toda la información de la partida actual: puntuación, errores, preguntas ya hechas, comodines disponibles, tiempo restante, etc.
    - La función `resetToStart()` se encarga de reiniciar este objeto a sus valores por defecto al comenzar una nueva partida.

4.  **Flujo del Juego**:
    - **`startGame()`**: Se activa al hacer clic en "Jugar". Pide el nombre del jugador, oculta la pantalla de inicio y muestra la del juego. Llama a `pickRandomQuestion()` para empezar.
    - **`pickRandomQuestion()` y `showQuestion()`**: Seleccionan una pregunta al azar que no haya sido mostrada antes, barajan sus opciones y las renderizan en la pantalla. Inicia el temporizador.
    - **`onChoose()`**: Se ejecuta cuando el jugador selecciona una opción. Detiene el temporizador, verifica si la respuesta es correcta, actualiza la puntuación y los errores, muestra un mensaje y guarda el resultado en el historial (`gameState.history`).
    - **`checkWin()`**: Después de cada respuesta, comprueba si se ha cumplido una condición de fin de juego (alcanzar la meta de puntos, superar el límite de errores o quedarse sin preguntas).
    - **`endGame()`**: Se llama cuando el juego termina. Guarda el resultado final en `localStorage` (clave `quiz_result`) y redirige a `win.html` o `loser.html`.

5.  **Ranking (`saveScore` y `toggleLeaderboard`)**:
    - **`saveScore()`**: Al final de cada partida, esta función añade la nueva puntuación a la lista guardada en `localStorage` (clave `quiz_leaderboard`), la ordena según los criterios definidos y la recorta para mantener solo los 10 mejores.
    - **`toggleLeaderboard()`**: Muestra u oculta la tabla de jugadores en la pantalla de inicio, leyendo los datos de `quiz_leaderboard`.

6.  **Comodines (Lifelines)**:
    - Los botones de comodines tienen listeners que, al ser activados, modifican el `gameState` (restando un uso) y aplican su efecto correspondiente (ej. `performSwitchQuestion()` para cambiar la pregunta).

7.  **Panel de Administración (`admin.js`)**:
    - Gestiona la interfaz en `admin/index.html`.
    - Permite leer y modificar el objeto de configuración (`quiz_config`) en `localStorage`.
    - Incluye funciones para añadir/eliminar preguntas y borrar el ranking de jugadores.

### HTML

- **`index.html`**: La página principal. Contiene la pantalla de inicio (`#start-screen`), la del juego (`#game`) y el modal de instrucciones (`<dialog>`). La visibilidad se controla con JS.
- **`win.html` / `loser.html`**: Páginas estáticas que muestran el resultado. Su contenido se rellena dinámicamente con JS (`js/result.js`, `js/win.js`, `js/loser.js`) leyendo el objeto `quiz_result` de `localStorage`.
- **`admin/index.html`**: Contiene los formularios para que el administrador pueda cambiar la configuración del juego.

### CSS

- **`css/style.css`**: Hoja de estilos principal.
    - Utiliza **variables CSS** (`:root`) para definir una paleta de colores y tamaños consistentes, facilitando la personalización del tema.
    - Incluye media queries para la **responsividad**.
- **`css/result.css`**: Estilos compartidos por `win.html` y `loser.html`. La página de derrota (`loser.html`) tiene una clase `result--lose` en el `<body>` que aplica un tema de colores rojos definido en este mismo archivo.
- **`admin/admin.css`**: Estilos dedicados exclusivamente al panel de administración.

---

## Cómo Jugar

1.  Abre `index.html` en un navegador.
2.  Haz clic en "Jugar" e introduce tu nombre.
3.  Responde a las preguntas antes de que se acabe el tiempo.
4.  Usa los comodines para ayudarte a ganar puntos o salir de un apuro.

---

## Cambios recientes (resumen importante)

- Se agregó un contador de errores visible en la UI principal (`Errores`) que aumenta cuando el jugador responde incorrectamente o se agota el tiempo.
- Se implementaron páginas dedicadas de resultado: `win.html` (victoria) y `loser.html` (derrota). Ambas páginas leen un objeto `quiz_result` desde `localStorage` para mostrar el resumen.
- Reproductor de audio:
    - En victoria se intenta reproducir `sound/applause-cheer-236786.mp3`.
    - En derrota se intenta reproducir `sound/error-170796.mp3`.
    - Si el navegador bloquea la reproducción automática, ambas páginas muestran un botón para reproducir el audio manualmente.
- Efectos visuales: la página de victoria incluye una animación de confetti (CSS + JS) y estilos ampliados para destacar el resultado.
- Registro de historial: durante la partida se guarda en memoria (y se incluye en `quiz_result`) el detalle por pregunta: texto de pregunta, opción elegida, si fue correcta, tiempo que tomó responder y si se usó el comodín "Duplicar" en esa pregunta.

## Claves importantes en localStorage

- `quiz_config`: configuración del juego (se inicializa desde `defaultConfig.json` si no existe).
- `quiz_leaderboard`: array con los mejores resultados guardados por `saveScore()`.
- `quiz_result`: objeto con el resumen de la última partida. Las páginas `win.html` y `loser.html` lo leen para renderizar la vista de resultados.
- `quiz_mute`: booleano (`"true"`/`"false"`) que indica si el usuario silenció los sonidos en la UI.
- `quiz_texture_active`: booleano que guarda la preferencia del usuario sobre la textura de fondo.
- `quiz_recent_questions`: array con los IDs de las últimas preguntas mostradas para mejorar la aleatoriedad entre partidas.

### Formato de `quiz_result`

Ejemplo (JSON):

{
    "name": "Ana",
    "score": 10,
    "totalTime": 95,
    "correctAnswers": 5,
    "errors": 3,
    "lifelinesUsed": {
        "double": true,
        "switch": false,
        "eliminate": true
    },
    "history": [
        {
            "id": 5,
            "text": "¿Cuál es la capital de Francia?",
            "chosenIndex": 1,
            "chosenText": "París",
            "correctIndex": 1,
            "correctText": "París",
            "correct": true,
            "timeTaken": 6.2,
            "usedDouble": false
        }
    ]
}

## Probar localmente (recomendado)

Por seguridad los navegadores restringen ciertas operaciones cuando se abre un archivo `file://` directamente (p. ej. fetch a `defaultConfig.json` y reproducción automática de audio). Para evitar problemas, sirve el proyecto con un servidor HTTP local.

Usando Python 3 (desde la carpeta del proyecto):

```powershell
python -m http.server 8000
```

Luego abre en el navegador: http://localhost:8000

Alternativas (Node.js):

```powershell
npx http-server -p 8000
```

## Notas sobre audio / Autoplay

- Los navegadores pueden bloquear la reproducción automática de audio. Las páginas de resultado intentan reproducir el audio al cargar, pero muestran un botón de reproducción manual si el intento es bloqueado.
- Si quieres desactivar todos los sonidos por defecto, en la UI principal pulsa el botón de silenciar; la preferencia se guarda en `quiz_mute`.

## Depuración y comprobaciones rápidas

- Asegúrate de que las rutas a los audios existen en `sound/` y que los nombres coinciden con los usados en el código.
- Si `win.html` o `loser.html` muestran que `quiz_result` es `null` o vacío, probablemente se accedió a la página directamente sin jugar una partida; juega una partida completa para que `js/app.js` guarde el objeto antes de la redirección.
- Para ver el contenido del `quiz_result` en tiempo real, abre las herramientas del navegador (DevTools) > Application (Almacenamiento) > Local Storage.

## Sugerencias y mejoras futuras

- Centralizar la lógica de reproducción de audio de las páginas de resultado para evitar código duplicado.
- Añadir accesibilidad (roles ARIA y manejo de foco) en las páginas de resultado.
- Exportar el historial de partida a JSON/CSV para análisis externo.


## Panel de Administración

1.  En la pantalla de inicio, haz clic en "Jugar".
2.  Cuando se te pida el nombre, escribe `admin`.
3.  Introduce la contraseña (`31381993` por defecto).
4.  Serás redirigido al panel de administración donde podrás configurar el juego.
