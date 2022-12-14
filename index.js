//the board array is going to store the board state in array of columns from left to right each column holding cells bottom to top (ie. board[0][0] represents the bottom cell in the left column.) The array will hold either 0, 1, or 2 representing unused, player1 and player2.
let numBoard = [];
let numCol = 7;
let numRow = 6;
const winLength = 4;
let numPlayers = 2;
let currentPlayer = 1;
let playerNames = [
    "This space intentionally left blank",
    "Player 1",
    "Player 2",
];

const screenBoard = document.getElementById("screenBoard");
const playerDisplay = document.getElementById("currentPlayer");
const quitButton = document.getElementById("quitGame");
const menuPopup = document.getElementById("menuPopup");
const playerSelect = document.getElementById("playerSelect");
const player1NameField = document.getElementById("player1Name");
const player2NameField = document.getElementById("player2Name");
const columnSelect = document.getElementById("columnSelect");
const rowSelect = document.getElementById("rowSelect");
const menuClose = document.getElementById("menuClose");

columnSelect.onchange = function () {
    numCol = this.value;
    this.labels[0].innerText = 'Number of Columns: '+this.value;
};
rowSelect.onchange = function () {
    numRow = this.value;
    this.labels[0].innerText = 'Number of Rows: '+this.value;
};
menuClose.onclick = function () {
    numPlayers = Number(playerSelect.value);
    if (numPlayers === 1) {
        playerNames[1] = player1NameField.value;
        playerNames[2] = "Computer";
    } else {
        playerNames[1] = player1NameField.value;
        playerNames[2] = player2NameField.value;
    }
    constructBoard();
    currentPlayer = Math.floor(Math.random() * 2) + 1;
    if (numPlayers === 1 && currentPlayer === 2) {
        playInColumn(numBoard, computerCol(), currentPlayer);
        switchPlayer();
    }

    updateBoard();
    menuPopup.style.display = "none";
};
quitButton.onclick = function () {
    menuPopup.style.display = "flex";
};

//this function needs to construct both the numBoard array and the screenBoard HTML. if this is the second game it needs remove the old game and reconstruct.
function constructBoard() {
    //remove the old numBoard and screenBoard
    numBoard = [];
    while (screenBoard.firstChild) {
        screenBoard.removeChild(screenBoard.firstChild);
    }
    //construct numBoard and screenBoard using the numCol and numRow values
    for (let i = 0; i < numCol; i++) {
        numBoard.push([]);
        const newCol = document.createElement("div");
        newCol.classList.add("column");
        screenBoard.appendChild(newCol);

        for (let j = 0; j < numRow; j++) {
            numBoard[i].push(0);
            const newCell = document.createElement("div");
            newCell.classList.add("cell");
            newCol.appendChild(newCell);
        }
    }
}

//this function needs to update the screenBoard to match the numBoard. also update the playerDisplay to the currentPlayer
function updateBoard() {
    screenBoard.style.backgroundColor = '#FFE135'
    for (let col = 0; col < numCol; col++) {
        for (let row = 0; row < numRow; row++) {
            if (numBoard[col][row]) {
                if (numBoard[col][row] === 1) {
                    screenBoard.children[col].children[row].classList.add(
                        "player1"
                    );
                } else if (numBoard[col][row] === 2) {
                    screenBoard.children[col].children[row].classList.add(
                        "player2"
                    );
                }
            } else {
                screenBoard.children[col].children[row].classList.remove(
                    "player1",
                    "player2"
                );
            }
        }
    }

    playerDisplay.innerText = playerNames[currentPlayer];
    if (currentPlayer === 1) {
        playerDisplay.style.color = "red";
    } else if (currentPlayer === 2) {
        playerDisplay.style.color = "blue";
    }
}

//this function takes a column and attempts to play in that column as the currentPlayer. It modifies the board array and returns true if the play was successful. If the passed column could not be played in the function returns false and the board array is not changed.
//to enable the computer to check hypothetical moves and board states, the function now takes a board array and player as parameters
function playInColumn(passedBoard, paramCol, paramPlayer) {
    const height = passedBoard[paramCol].indexOf(0);
    if (height >= 0) {
        passedBoard[paramCol][height] = paramPlayer;
        return true;
    } else {
        return false;
    }
}

//this function should switch the player to a specified player, or toggle the player if nothing is specified
function switchPlayer(input) {
    switch (input) {
        case undefined:
            if (currentPlayer === 1) {
                currentPlayer = 2;
            } else if (currentPlayer === 2) {
                currentPlayer = 1;
            }
            return true;
        case 1:
            currentPlayer = 1;
            return true;
        case 2:
            currentPlayer = 2;
            return true;
        default:
            return false;
    }
}

screenBoard.addEventListener("click", function (event) {
    //lots of the initial if statements here are so the user can click on either a cell or the space between a cell
    if (event.target.matches(".cell") || event.target.matches('.column')) {
        let clickedCol = {};
        if (event.target.matches(".cell")) {
            clickedCol = event.target.parentElement;
        } else {
            clickedCol = event.target;
        }
        const clickedColNum = Array.from(clickedCol.parentElement.children).indexOf(clickedCol);

        if (playInColumn(numBoard, clickedColNum, currentPlayer)) {
            if (checkWin(numBoard, clickedColNum)) {
                menuPopup.childNodes[1].childNodes[1].innerText = `${playerNames[currentPlayer]} Wins!!!`;
                menuPopup.style.display = "flex";
                updateBoard();
            } else {
                if (numPlayers === 1) {
                    switchPlayer();
                    updateBoard();

                    let computerMove = computerCol();
                    playInColumn(numBoard, computerMove, currentPlayer);
                    if (checkWin(numBoard, computerMove)) {
                        menuPopup.childNodes[1].childNodes[1].innerText = `${playerNames[currentPlayer]} Wins!!!`;
                        menuPopup.style.display = "flex";
                        switchPlayer();
                        updateBoard();
                    } else {
                        switchPlayer();
                        updateBoard();
                    }
                } else {
                    switchPlayer();
                    updateBoard();
                }
            }
        }
    }
});

//The win function takes the column that was last played in and checks if that token won the game. To enable the computer to checkWin on a hypothetical future board, checkWin now takes a array representing a board.
function checkWin(passedBoard, currentCol) {
    let currentRow = passedBoard[currentCol].indexOf(0) - 1;
    if (currentRow < 0) currentRow = passedBoard[currentCol].length - 1;
    const checkPlayer = passedBoard[currentCol][currentRow];

    //Check Down
    let count = 1;
    for (let i = 1; i < winLength; i++) {
        if (passedBoard[currentCol][currentRow - i] === checkPlayer) {
            count++;
        } else {
            count = 1;
            break;
        }
        if (count >= winLength) {
            return true;
        }
    }

    //check horizontal
    count = 0;
    for (let i = 0; i < numCol; i++) {
        if (passedBoard[i][currentRow] === checkPlayer) {
            count++;
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
    count = 0;
    while (startCol < numCol && startRow < numRow) {
        if (passedBoard[startCol][startRow] === checkPlayer) {
            count++;
        } else {
            count = 0;
        }
        if (count >= winLength) return true;
        startCol++;
        startRow++;
    }

    //Check diagonal down
    startCol = currentCol;
    startRow = currentRow;
    while (startCol < numCol - 1 && startRow > 0) {
        startCol++;
        startRow--;
    }
    count = 0;
    while (startCol >= 0 && startRow < numRow) {
        if (passedBoard[startCol][startRow] === checkPlayer) {
            count++;
        } else {
            count = 0;
        }
        if (count >= winLength) return true;
        startCol--;
        startRow++;
    }
    return false;
}

//this function chooses a column for the computer to play in. starting with a random choice.
function computerCol() {
    //check if there is a win available
    for (let i=0; i<numCol; i++) {
        const copy = [];
        for (let col of numBoard) {
            copy.push([...col])
        }
        playInColumn(copy, i, 2);
        if (checkWin(copy, i)) {
            return i;
        }
    }
    //if no win is available play in a random column
    let pick = Math.floor(Math.random() * numCol);
    while (numBoard[pick].indexOf(0) < 0) {
        pick = Math.floor(Math.random() * numCol);
    }
    return pick;
}
