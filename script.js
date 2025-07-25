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
  if (level === 'easy') return [4, 2];
  if (level === 'medium') return [4, 4];
  if (level === 'hard') return [6, 6];
}

function startGame() {
  board.innerHTML = '';
  status.textContent = '';
  clearInterval(timer);
  seconds = 0;
  timerDisplay.textContent = 'Time: 0s';

  const level = document.getElementById('difficulty').value;
  const [cols, rows] = setGrid(level);
  const totalTiles = cols * rows;
  totalPairs = totalTiles / 2;

  board.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  let symbols = shuffle(symbolsList).slice(0, totalPairs);
  tiles = shuffle([...symbols, ...symbols]);

  tiles.forEach(symbol => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.symbol = symbol;

    const tileInner = document.createElement('div');
    tileInner.classList.add('tile-inner');

    const front = document.createElement('div');
    front.classList.add('tile-front');

    const back = document.createElement('div');
    back.classList.add('tile-back');
    back.textContent = symbol;

    tileInner.appendChild(front);
    tileInner.appendChild(back);
    tile.appendChild(tileInner);

    tile.addEventListener('click', handleTileClick);
    board.appendChild(tile);
  });

  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);

  matchedCount = 0;
  lockBoard = false;
  [firstTile, secondTile] = [null, null];
}

function handleTileClick(e) {
  const tile = e.currentTarget;
  if (lockBoard || tile.classList.contains('revealed') || tile.classList.contains('matched')) return;

  flipSound.play();
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