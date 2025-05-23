const BOARD_SIZE = 10;
const NUM_MINES = 10;
let board = [];
let mines = [];

function initializeBoard() {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';
    board = [];
    mines = [];

    // 初始化棋盘
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleRightClick);
            boardElement.appendChild(cell);
            row.push({ isMine: false, isRevealed: false, isFlagged: false, count: 0 });
        }
        board.push(row);
    }

    // 随机布置地雷
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            mines.push({ row, col });
            minesPlaced++;
        }
    }

    // 计算每个格子周围的地雷数量
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const newRow = i + x;
                        const newCol = j + y;
                        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol].isMine) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
}

function handleCellClick(event) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    event.target.classList.add('revealed');

    if (cell.isMine) {
        event.target.classList.add('mine');
        event.target.textContent = '👾';
        alert('你捅到了怪物老巢！别废话，赶紧点，重新开始。');
        revealAllMines();
    } else {
        event.target.textContent = cell.count || '';
        if (cell.count === 0) {
            revealAdjacentCells(row, col);
        }
        checkWin();
    }
}

function handleRightClick(event) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    event.target.classList.toggle('flagged', cell.isFlagged);
    event.target.textContent = cell.isFlagged ? '🐶' : '';
}

function revealAdjacentCells(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const newRow = row + x;
            const newCol = col + y;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && !board[newRow][newCol].isRevealed) {
                const cellElement = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
                cellElement.click();
            }
        }
    }
}

function revealAllMines() {
    mines.forEach(mine => {
        const cellElement = document.querySelector(`.cell[data-row='${mine.row}'][data-col='${mine.col}']`);
        cellElement.classList.add('mine');
        cellElement.textContent = '👾';
    });
}

function checkWin() {
    let unrevealedSafeCells = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].isRevealed && !board[i][j].isMine) {
                unrevealedSafeCells++;
            }
        }
    }
    if (unrevealedSafeCells === 0) {
        alert('恭喜你！你的宠物狗很强哦。。');
    }
}

function resetGame() {
    initializeBoard();
}

// 初始化游戏
initializeBoard();