//the board array is going to store the board state in array of columns from left to right each column holding cells bottom to top (ie. board[0][0] represents the bottom cell in the left column.) The array will hold either 0, 1, or 2 representing unused, player1 and player2.
const numBoard = [];
const screenBoard = document.getElementById("screenBoard");

let numCol = 7;
let numRow = 6;

for (let i=0; i<numCol; i++) {
    numBoard.push([]);
    const newCol = document.createElement('div');
    newCol.classList.add('column');
    screenBoard.appendChild(newCol);

    for (let j=0; j<numRow; j++) {
        // numBoard[i].push(0);
        const newCell = document.createElement('div');
        newCell.classList.add('cell');
        newCol.appendChild(newCell);
    }
}

//this function needs to update the screenBoard to match the numBoard
function updateBoard() {
    for (let col=0; col<numCol; col++) {
        for (let row=0; row<numRow; row++) {
            if (numBoard[col][row]) {
                if (numBoard[col][row]===1) {
                    screenBoard.children[col].children[row].classList.add('player1');
                } else if (numBoard[col][row]===2) {
                    screenBoard.children[col].children[row].classList.add('player2');
                }
            } else {
                screenBoard.children[col].children[row].classList.remove('player1','player2');
            }
        }
    }
}

let currentPlayer = 1;

screenBoard.addEventListener('click', function(event) {
    // console.log(event.target.matches('.cell'));

    let clickedCol = event.target;
    if (event.target.matches('.cell')) {
        clickedCol = event.target.parentElement;
    }

    //this sucks theres got to be a better way to know which sibling an element is
    const numCol = Array.from(clickedCol.parentElement.children).indexOf(clickedCol);

    numBoard[numCol].push(currentPlayer);
    updateBoard();

    if (currentPlayer === 1) {
        currentPlayer = 2;
    } else if (currentPlayer === 2) {
        currentPlayer = 1;
    }
})