// Simple Tic-Tac-Toe game logic (beginner-friendly)

document.addEventListener('DOMContentLoaded', () => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const currentPlayerEl = document.getElementById('currentPlayer');
  const messageEl = document.getElementById('message');
  const resetButton = document.getElementById('resetButton');

  // Game state
  let board = Array(9).fill(null); // null | 'X' | 'O'
  let currentPlayer = 'X';
  let isGameOver = false;
  let moves = 0;

  // All winning index combinations
  const WIN_COMBINATIONS = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  function updateStatus(){
    currentPlayerEl.textContent = currentPlayer;
    messageEl.textContent = '';
  }

  function handleCellClick(e){
    const btn = e.currentTarget;
    const index = Number(btn.dataset.index);

    if (isGameOver) return;           // no moves after game ends
    if (board[index] !== null) return; // cell already filled

    // Make move
    board[index] = currentPlayer;
    moves += 1;
    btn.textContent = currentPlayer;
    btn.classList.add('filled', currentPlayer === 'X' ? 'x' : 'o');

    // Check for win or draw
    const winnerInfo = checkWinner();
    if (winnerInfo) {
      endGame(winnerInfo);
      return;
    }

    if (moves === 9) {
      // Draw
      isGameOver = true;
      statusEl.textContent = 'Game over';
      messageEl.textContent = "It's a draw!";
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }

  function checkWinner(){
    for (const combo of WIN_COMBINATIONS) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    return null;
  }

  function endGame({ winner, combo }){
    isGameOver = true;
    statusEl.textContent = 'Game over';
    messageEl.textContent = `Player ${winner} wins! 🎉`;

    // Highlight winning cells
    for (const i of combo) {
      const cell = cells[i];
      cell.classList.add('win');
    }

    // Optionally announce winner in status area
    currentPlayerEl.textContent = winner;
  }

  function resetGame(){
    board = Array(9).fill(null);
    currentPlayer = 'X';
    isGameOver = false;
    moves = 0;
    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });
    statusEl.textContent = 'Current turn:';
    updateStatus();
    messageEl.textContent = '';
  }

  // Wire up event listeners
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  // Keyboard accessibility: allow Enter/Space to mark a cell
  cells.forEach(cell => {
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cell.click();
      }
    });
  });

  // Initialize UI
  updateStatus();
});