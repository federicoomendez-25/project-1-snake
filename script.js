// ELEMENTOS DOM
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const playerNameInput = document.getElementById('playerName');
const board = document.getElementById('game-board');

let playerName = 'Jugador';

// CONFIGURACIÓN
const boxSize = 20;
const columns = 30;
const rows = 20;

let snake = [];
let food = {};
let direction = null;
let score = 0;
let speed = 200;
let lastRenderTime = 0;
let gameLoopId;

// BOTONES
startBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'Jugador';
    menu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    displayPlayerName();
    initGame();
});

restartBtn.addEventListener('click', () => {
    window.cancelAnimationFrame(gameLoopId); // detener animación
    gameOverScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    menu.classList.remove('hidden');
    playerNameInput.value = '';
});

// MOSTRAR NOMBRE DEL JUGADOR
function displayPlayerName() {
    const nameDisplay = document.getElementById('player-name');
    nameDisplay.textContent = `Player: ${playerName}`;
}

// INICIALIZAR JUEGO
function initGame() {
    snake = [{ x: Math.floor(columns / 2), y: Math.floor(rows / 2) }];
    direction = null;
    score = 0;
    speed = 200;
    scoreDisplay.textContent = `Puntaje: ${score}`;
    generateFood();
    lastRenderTime = 0;
    gameLoopId = window.requestAnimationFrame(gameLoop);
    document.addEventListener('keydown', changeDirection);
}

// GENERAR COMIDA
function generateFood() {
    food = {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
    };
}

// CAMBIAR DIRECCIÓN
function changeDirection(event) {
    if(event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if(event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if(event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if(event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
}

// LOOP DEL JUEGO
function gameLoop(currentTime) {
    gameLoopId = window.requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < speed / 1000) return;
    lastRenderTime = currentTime;

    moveSnake();
    drawSnake();
    checkCollision();
}

// DIBUJAR SERPIENTE Y COMIDA
function drawSnake() {
    board.innerHTML = '';

    // Dibujar comida
    const foodDiv = document.createElement('div');
    foodDiv.classList.add('food');
    foodDiv.style.left = `${food.x * boxSize}px`;
    foodDiv.style.top = `${food.y * boxSize}px`;
    board.appendChild(foodDiv);

    // Dibujar serpiente
    snake.forEach((segment, index) => {
        const snakeDiv = document.createElement('div');
        if (index === 0) {
            snakeDiv.classList.add('snake-head');
        } else {
            snakeDiv.classList.add('snake-body');
        }
        snakeDiv.style.left = `${segment.x * boxSize}px`;
        snakeDiv.style.top = `${segment.y * boxSize}px`;
        board.appendChild(snakeDiv);
    });
}

// MOVER SERPIENTE
function moveSnake() {
    if (!direction) return;

    const head = { ...snake[0] };

    switch(direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }

    // Comer comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        increaseSpeed();
        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    scoreDisplay.textContent = `Puntaje: ${score}`;
}

// INCREMENTAR VELOCIDAD
function increaseSpeed() {
    speed = speed > 60 ? speed - 10 : 50;
}

// REVISAR COLISIONES
function checkCollision() {
    const head = snake[0];
    // Bordes
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
        endGame();
        return;
    }
    // Cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }
}

// GAME OVER
function endGame() {
    window.cancelAnimationFrame(gameLoopId);
    gameContainer.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `Tu puntaje: ${score}`;
}
