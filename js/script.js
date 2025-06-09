const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreDisplay = document.getElementById('score');
const gameBoard = document.querySelector('.game-board');
const coinSound = new Audio('audio/moeda.wav');
const gameOverSound = new Audio('audio/gamer-over.wav');

let passedPipe = false;
let score = 0;
let speed = 1;
let gameOver = false;

// Pulo
const jump = () => {
  if (!gameOver) {
    mario.classList.add('jump');
    setTimeout(() => mario.classList.remove('jump'), 500);
  }
};

document.addEventListener('keydown', jump);

// Criar moeda nova
const createCoin = () => {
  if (gameOver) return;

  const coin = document.createElement('img');
  coin.src = 'img/gg.gif';
  coin.classList.add('coin');

  // Define uma posição aleatória na vertical entre 100px e 200px
  const bottomPosition = Math.random() * 100 + 100;
  coin.style.bottom = `${bottomPosition}px`;

  coin.style.animationDuration = `${5 / (speed / 1)}s`;

  gameBoard.appendChild(coin);

  // Verifica colisão da moeda
  const coinInterval = setInterval(() => {
    const coinPosition = coin.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (
      coinPosition <= 120 &&
      coinPosition > 0 &&
      marioPosition + 40 >= parseFloat(coin.style.bottom) &&
      marioPosition <= parseFloat(coin.style.bottom) + 40
    ) {
      coinSound.play(); // TOCA SOM DE MOEDA

      score+= 5;
      scoreDisplay.textContent = `Score: ${score}`;
      coin.remove();
      clearInterval(coinInterval);

      // Aumentar velocidade a cada 5 moedas
      speed += 0.02; // você pode ajustar o incremento se quiser mais rápido
      pipe.style.animationDuration = `${2 / speed}s`;
    }

    if (coinPosition <= -40) {
      coin.remove();
      clearInterval(coinInterval);
    }
  }, 10);
};

// Loop de geração de moedas
setInterval(() => {
  createCoin();
}, 2000);

// Loop principal (colisão com cano)
const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  // Verifica colisão
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    gameOverSound.play();

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = "img/lug.gif";
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOver = true;
    clearInterval(loop);
  }

  // ✅ Verifica se o Mario pulou o cano com sucesso
  if (pipePosition < 0 && !passedPipe && !gameOver) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    passedPipe = true;

    // Reinicia a flag quando o cano sair da tela
    setTimeout(() => {
      passedPipe = false;
    }, 500); // ajusta conforme o tempo do próximo cano
  }
}, 10);


coinSound.volume = 0.4;
gameOverSound.volume = 0.4;
