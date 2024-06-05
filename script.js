document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('resetButton');
    const modeSelector = document.getElementById('mode');
    let currentPlayer = 'X';
    let board = Array(9).fill(null);
    let gameMode = 'pvp'; // Default to Player vs Player
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleClick(event) {
        const index = event.target.dataset.index;
        if (!board[index] && !message.textContent) {
            makeMove(index, currentPlayer);
            if (!checkGameOver()) {
                if (gameMode === 'pva' && currentPlayer === 'O') {
                    currentPlayer = 'X';
                    setTimeout(aiMove, 500); // AI makes its move after a short delay
                }
            }
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        currentPlayer = player === 'X' ? 'O' : 'X';
    }

    function aiMove() {
        const bestMove = getBestMove();
        makeMove(bestMove, 'O');
        checkGameOver();
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        let scores = {
            'O': 1,
            'X': -1,
            'tie': 0
        };
        let result = checkWin();
        if (result !== null) {
            return scores[result];
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWin() {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(cell => cell)) {
            return 'tie';
        }
        return null;
    }

    function checkGameOver() {
        let winner = checkWin();
        if (winner) {
            message.textContent = winner === 'tie' ? `It's a draw!` : `${winner} wins!`;
            return true;
        }
        return false;
    }

    function resetGame() {
        board = Array(9).fill(null);
        cells.forEach(cell => cell.textContent = '');
        message.textContent = '';
        currentPlayer = 'X';
    }

    function updateGameMode() {
        gameMode = modeSelector.value;
        resetGame();
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);
    modeSelector.addEventListener('change', updateGameMode);
});