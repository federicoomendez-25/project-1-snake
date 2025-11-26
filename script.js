const board = document.getElementById('game-board');

// Tamaño de casilla
const boxSize = 20;

// Tamaño del tablero en número de celdas
const columns = 30;
const rows = 20;

// Posición inicial de la serpiente (centro)
let snake = [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }];

// Función para dibujar la serpiente
function drawSnake() {
    // Limpiar tablero
    board.innerHTML = '';

    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.width = `${boxSize}px`;
        snakeElement.style.height = `${boxSize}px`;
        snakeElement.style.backgroundColor = 'lime';
        snakeElement.style.position = 'absolute';
        snakeElement.style.left = `${segment.x * boxSize}px`;
        snakeElement.style.top = `${segment.y * boxSize}px`;
        board.appendChild(snakeElement);
    });
}

// Dibujamos la serpiente inicialmente
drawSnake();
let direction = null; // Dirección actual: 'up', 'down', 'left', 'right'

// Detectar teclas
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';

    moveSnake();
});

function moveSnake() {
    if (!direction) return;

    // Tomamos la cabeza actual
    let head = { ...snake[0] };

    // Movemos la cabeza según la dirección
    switch(direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }

    // Verificar límites
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
       
        // Reiniciamos el juego
        snake = [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }];
        direction = null;
        drawSnake();
        return;
    }

    // Reemplazamos la serpiente con la nueva posición de la cabeza (solo 1 bloque por ahora)
    snake[0] = head;

    drawSnake();
}
