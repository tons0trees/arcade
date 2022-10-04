//the board array is going to store the board state in array of columns from left to right each column holding cells bottom to top (ie. board[0][0] represents the bottom cell in the left column.) The array will hold either 0, 1, or 2 representing unused, player1 and player2.
const numBoard = [];
const screenBoard = document.getElementById("screenBoard");
const playerDisplay = document.getElementById("currentPlayer");

const numCol = 7;
const numRow = 6;
const winLength = 4;
let currentPlayer = 1;

for (let i=0; i<numCol; i++) {
    numBoard.push([]);
    const newCol = document.createElement('div');
    newCol.classList.add('column');
    screenBoard.appendChild(newCol);

    for (let j=0; j<numRow; j++) {
        numBoard[i].push(0);
        const newCell = document.createElement('div');
        newCell.classList.add('cell');
        newCol.appendChild(newCell);
    }
}

updateBoard();

//this function needs to update the screenBoard to match the numBoard. update the playerDisplay to the currentPlayer
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

    playerDisplay.innerText = `Player ${currentPlayer}`
    if (currentPlayer===1) {
        playerDisplay.style.color = 'red';
    } else if (currentPlayer === 2) {
        playerDisplay.style.color = 'blue';
    }
}



function playInColumn(paramCol) {
    const height = numBoard[paramCol].indexOf(0);
    if (height >=0) {
        numBoard[paramCol][height] = currentPlayer;
        return true
    } else {
        return false;
    }
}

screenBoard.addEventListener('click', function(event) {
    // console.log(event.target.matches('.cell'));

    let clickedCol = event.target;
    if (event.target.matches('.cell')) {
        clickedCol = event.target.parentElement;
    }

    //this sucks theres got to be a better way to know which sibling an element is
    const numCol = Array.from(clickedCol.parentElement.children).indexOf(clickedCol);

    if(playInColumn(numCol)) {
        if (currentPlayer === 1) {
            currentPlayer = 2;
        } else if (currentPlayer === 2) {
            currentPlayer = 1;
        }
        updateBoard();
    }
})

//The win function takes the column that was last played in and checks if that token won the game.
function checkWin(currentCol) {
    let currentRow = numBoard[currentCol].indexOf(0)-1;
    if (currentRow<0) currentRow=numBoard[currentCol].length-1
    const checkPlayer = numBoard[currentCol][currentRow];

    //Check Down
    console.log('checking down');
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
    console.log('checking horizontal')
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

    //check diagonal up
    //find the starting cell
    let startCol = currentCol;
    let startRow = currentRow;
    while (startCol > 0 && startRow > 0) {
        startCol--;
        startRow--;
    }
    console.log(`[${startCol}][${startRow}]`)
    count = 0;
    while(startCol < numCol && startRow < numRow) {
        if (numBoard[startCol][startRow]===checkPlayer) {
            count++;
        } else {
            count = 0;
        }
        if (count >= winLength) return true
        startCol++;
        startRow++;
    }

    //Check diagonal down
    startCol = currentCol;
    startRow = currentRow;
    while (startCol < numCol-1 && startRow > 0) {
        startCol++;
        startRow--;
    }
    console.log(`[${startCol}][${startRow}]`)
    count = 0;
    while(startCol >= 0 && startRow < numRow) {
        if (numBoard[startCol][startRow]===checkPlayer) {
            count++;
        } else {
            count = 0;
        }
        if (count >= winLength) return true
        startCol--;
        startRow++;
    }
    return false;
}
