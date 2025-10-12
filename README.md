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
- **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla.

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
│   └── win.css
├── js/
│   ├── app.js
│   └── win.js
├── sound/
│   └── (archivos de audio)
├── defaultConfig.json
├── index.html
├── INSTRUCCIONES.txt
├── loser.html
└── win.html
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

- **`index.html`**: Es la página principal. Contiene la pantalla de inicio (`#start-screen`), la pantalla del juego (`#game`) y el modal de instrucciones (`<dialog>`). La visibilidad de las secciones se controla con JavaScript añadiendo o quitando la clase `.hidden`.
- **`win.html` / `loser.html`**: Páginas estáticas que muestran el resultado de la partida. Su contenido se rellena dinámicamente con JavaScript (`js/win.js` y un script inline en `loser.html`) leyendo el objeto `quiz_result` de `localStorage`.
- **`admin/index.html`**: Contiene los formularios para que el administrador pueda cambiar la configuración del juego.

### CSS

- **`css/style.css`**: Hoja de estilos principal.
    - Utiliza **variables CSS** (`:root`) para definir una paleta de colores y tamaños consistentes, facilitando la personalización del tema.
    - Define el estilo de los componentes principales como `.card`, `.btn-primary`, etc.
    - Incluye media queries para la **responsividad**, ajustando el layout en pantallas más pequeñas.
- **`css/win.css`**: Estilos específicos para la pantalla de victoria.
- **`loser.html` (estilos inline)**: Contiene sus propios estilos dentro de una etiqueta `<style>`, específicos para la pantalla de derrota.
- **`admin/admin.css`**: Estilos dedicados exclusivamente al panel de administración.

---

## Cómo Jugar

1.  Abre `index.html` en un navegador.
2.  Haz clic en "Jugar" e introduce tu nombre.
3.  Responde a las preguntas antes de que se acabe el tiempo.
4.  Usa los comodines para ayudarte a ganar puntos o salir de un apuro.

## Panel de Administración

1.  En la pantalla de inicio, haz clic en "Jugar".
2.  Cuando se te pida el nombre, escribe `admin`.
3.  Introduce la contraseña (`31381993` por defecto).
4.  Serás redirigido al panel de administración donde podrás configurar el juego.
