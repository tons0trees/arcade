//the board array is going to store the board state in array of columns from left to right each column holding cells bottom to top (ie. board[0][0] represents the bottom cell in the left column.) The array will hold either 0, 1, or 2 representing unused, player1 and player2.
const numBoard = [];
const screenBoard = document.getElementById("screenBoard");

const numCol = 7;
const numRow = 6;
const winLength = 4;

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

//The win function takes the column that was last played in and checks if that token won the game.
function checkWin(currentCol) {
    const currentRow = numBoard[currentCol].length-1;
    const checkPlayer = numBoard[currentCol][currentRow];

    //Check Down
    let count = 1;
    for (let i=1; i<winLength; i++) {
        if (numBoard[currentCol][currentRow-i]===checkPlayer) {
            count++;
            // console.log(count);
        } else {
            count = 1;
            break;
        }
        if (count >= winLength) {
            return true;
        }
    }

    //check horizontal
    //check left first, carrying count to the right check without reseting
    count = 0;
    for (let i=0; i<numCol; i++) {
        if (numBoard[i][currentRow]===checkPlayer) {
            count++;
            console.log(`Cell:${i},${currentRow} Count:${count}`);
        } else {
            count = 0;
        }
        if (count >= winLength) {
            return true;
        }
    }
    return false;
}
