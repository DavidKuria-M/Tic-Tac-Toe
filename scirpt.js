const cells = document.querySelectorAll('.cell');
const turnBadge = document.querySelector('.turn-badge');
const scoreX = document.querySelector('.player-x .score');
const scoreO = document.querySelector('.player-o .score');


let board = ['','','','','','','','',''];
let currentPlayer = 'X';
let isGameActive = true;
let scores = {X:0,O:0};

cells.forEach((cell,index) =>{
    cell.addEventListener('click',() => handleCellClick(index));
})

function handleCellClick(index){
    if(board[index] != '' || !isGameActive || currentPlayer !== 'X') return;

    makeMove(index,'X');
}

function makeMove(index, player){
    board[index] = player;
    cells[index].textContent = player;

    if(player === 'X'){
        cells[index].classList.add('icon-x-lg');
        cells[index].classList.remove('icon-o-log');
    }else{
        cells[index].classList.add('icon-o-lg');
        cells[index].classList.remove('icon-x-lg');
    }
}

function handleCellClick(index){
    if(board[index] !== '' || !isGameActive || currentPlayer !== 'X') return;

    makeMove(index,'X');

    if(checkWin('X')){
        endGame('X');
        return;
    }else if(checkTie()){
        endGame('Tie');
        return;
    }

    currentPlayer = 'O';
    turnBadge.textContent = "O's turn";

    isGameActive = false;
    setTimeout(computerMove,500);
}

function computerMove(){
    let bestMove = null;

    bestMove = findWinningMove('O');

    if(bestMove === null){
        bestMove = findWinningMove('X');
    }
    if(bestMove === null){
        let emptyCells = [];
        board.forEach((val,idx) => {
            if(val === '') emptyCells.push(idx);
        });

        if(emptyCells.length > 0){
            bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    if(bestMove !== null){
        makeMove(bestMove,'O');

        if(checkWin('O')){
            endGame('O');
            return;
        }else if(checkTie()){
            endGame('Tie');
            return;
        }
    }
    currentPlayer = 'X';
    turnBadge.textContent = "X's turn";
    isGameActive = true;
}

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function checkWin(player){
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkTie(){
    return board.every(cell => cell !== '');
}

function endGame(winner){
    isGameActive = false;

    if(winner === 'X'){
        turnBadge.textContent = "X wins!";
        scores.X++;
        scoreX.textContent = scores.X;

    }else if(winner === 'O'){
        turnBadge.textContent = "O wins!";
        scores.O++;
        scoreO.textContent = scores.O;
    }else{
        turnBadge.textContent = "It's a Tie!";
    }
}

function startNewGame(){
    board = ['','','','','','','','',''];
    isGameActive = true;
    currentPlayer = 'X';
    turnBadge.textContent = "X's turn";

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('icon-x-lg','icon-o-lg');
    });
}

function resetScores(){
    scores.X = 0;
    scores.O = 0;
    scoreX.textContent = '0';
    scoreO.textContent = '0';

    startNewGame();
}

function findWinningMove(player){
    let emptyCells = [];

    board.forEach((val,idx) => {
        if(val === '') emptyCells.push(idx);
    });

    for(let i = 0;i < emptyCells.length;i++){
        let index = emptyCells[i];

        board[index] = player;

        let wins = checkWin(player);
        board[index] = '';

        if(wins){
            return index;
        }
    }

    return null;
}