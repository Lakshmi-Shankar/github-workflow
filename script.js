const symbolsList = ['🍎','🍌','🍓','🍇','🍍','🥝','🍉','🍒','🥥','🍑','🥭','🍋','🍈','🍐','🍏','🫐','🥕','🌽'];
const board = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const status = document.getElementById('status');

const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const winSound = document.getElementById('winSound');

let tiles = [];
let firstTile = null;
let secondTile = null;
let lockBoard = false;
let matchedCount = 0;
let totalPairs = 0;
let timer = null;
let seconds = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function setGrid(level) {
  if (level === 'easy') return [4, 2]; // 8 tiles
  if (level === 'medium') return [4, 4]; // 16 tiles
  if (level === 'hard') return [6, 6]; // 36 tiles
}

function startGame() {
  // Reset
  board.innerHTML = '';
  status.textContent = '';
  clearInterval(timer);
  seconds = 0;
  timerDisplay.textContent = 'Time: 0s';

  // Set difficulty
  const level = document.getElementById('difficulty').value;
  const [cols, rows] = setGrid(level);
  const totalTiles = cols * rows;
  totalPairs = totalTiles / 2;

  // Grid setup
  board.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  // Pick and shuffle symbols
  let symbols = shuffle(symbolsList).slice(0, totalPairs);
  tiles = shuffle([...symbols, ...symbols]);

  // Create tiles
  tiles.forEach(symbol => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.symbol = symbol;
    tile.textContent = '';
    tile.addEventListener('click', handleTileClick);
    board.appendChild(tile);
  });

  // Start timer
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);

  matchedCount = 0;
  lockBoard = false;
  [firstTile, secondTile] = [null, null];
}

function handleTileClick(e) {
  const tile = e.target;
  if (lockBoard || tile.classList.contains('revealed') || tile.classList.contains('matched')) return;

  flipSound.play();
  tile.textContent = tile.dataset.symbol;
  tile.classList.add('revealed');

  if (!firstTile) {
    firstTile = tile;
  } else {
    secondTile = tile;
    lockBoard = true;

    if (firstTile.dataset.symbol === secondTile.dataset.symbol) {
      matchSound.play();
      firstTile.classList.add('matched');
      secondTile.classList.add('matched');
      matchedCount++;

      if (matchedCount === totalPairs) {
        winSound.play();
        clearInterval(timer);
        status.textContent = `🎉 You won in ${seconds} seconds!`;
      }

      resetTurn();
    } else {
      setTimeout(() => {
        firstTile.textContent = '';
        secondTile.textContent = '';
        firstTile.classList.remove('revealed');
        secondTile.classList.remove('revealed');
        resetTurn();
      }, 1000);
    }
  }
}

function resetTurn() {
  [firstTile, secondTile] = [null, null];
  lockBoard = false;
}
