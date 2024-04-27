var board;
var initialBoard; // Store the initial state of the board
var score = 0;
var rows = 4;
var columns = 4;
var gameOverAlertShown = false; // Flag to track whether game over alert has been shown


window.onload = function() {
    loadGame(); // load every game
    displayRecord(); // display record
    displayLeaderboard(); // display leaderboard

    // Add event listener for reset leaderboard button
    document.getElementById("resetLeaderboardBtn").addEventListener("click", resetLeaderboard);

    // Add event listener for the "New Game" button
    document.getElementById("newGameBtn").addEventListener("click", newGame);

    document.getElementById("bg_music").play();

    // Add event listener for the "Stop Music" button
    document.getElementById("stopMusicBtn").addEventListener("click", stopBackgroundMusic);

     // Add event listener for the "Stop Music" button
     document.getElementById("playMusicBtn").addEventListener("click", playBackgroundMusic);

     // Add event listener to the checkbox
    document.getElementById("agreeCheckbox").addEventListener("change", function() {
        // Check if the checkbox is checked
        if (this.checked) {
            // Show the pop-up message
            alert("You have agreed to the terms and conditions.");
        }
    });

    // Add event listener for the "Reset Record" button
    document.getElementById("resetNewRecordBtn").addEventListener("click", resetRecord);

    // Add event listeners for controlling tile movement
    document.getElementById("moveLeftBtn").addEventListener("click", moveLeft);
    document.getElementById("moveUpBtn").addEventListener("click", moveUp);
    document.getElementById("moveRightBtn").addEventListener("click", moveRight);
    document.getElementById("moveDownBtn").addEventListener("click", moveDown);


}


function resetRecord() {
    // Reset the record to 0
    setRecord(0);

    // Display the updated record
    displayRecord();
}

function stopBackgroundMusic() {
    document.getElementById("bg_music").pause();
}

function playBackgroundMusic() {
    document.getElementById("bg_music").play();
}

function loadGame() {
    // Initialize the game board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Store the initial state of the board
    initialBoard = JSON.parse(JSON.stringify(board));

    // Create tiles and update the game board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // Set initial tiles
    setTwo();
    setTwo();

    // Display the record
    displayRecord();
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        checkGameOver(); // Check for game over before setting two tiles
        return;
    }

    let found = false;
    while (!found) {
        // Generate random row and column
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            // Place "2" tile
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }

    checkGameOver(); // Check for game over after setting two tiles
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

let keyEventListenerActive = true; // Add a variable to track whether the key event listener is active 

document.addEventListener("keyup", (e) => {

     if (!keyEventListenerActive || !isValidKey(e.code)) return; // Check if the key event listener is active and if the pressed key is valid

    // Store the current state of the board
    const currentState = JSON.stringify(board);

    if (e.code === "KeyA" || e.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    } 
    else if (e.code === "KeyW" || e.code === "ArrowUp") {
        slideUp();
        setTwo();
    } 
    else if (e.code === "KeyD" || e.code === "ArrowRight") {
        slideRight();
        setTwo();
    } 
    else if (e.code === "KeyS" || e.code === "ArrowDown") {
        slideDown();
        setTwo();
    } 


    // Check if the board has changed after the move
    const newState = JSON.stringify(board);
    if (currentState !== newState) {
        // Update score and check for game over if the board has changed
        updateScore();
        checkGameOver();
    } else {
        // Reset the game if no valid move was made
        resetGame();
    }
});

function isValidKey(code) {
    return code.startsWith("Arrow") || code === "KeyA" || code === "KeyW" || code === "KeyS" || code === "KeyD";
}


function filterZero(row) {
    return row.filter(num => num != 0); // Get rid of zeroes
}

function slide(row) {
    row = filterZero(row); // Get rid of zeroes

    // Slide
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // Add zeroes
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        // Update tiles
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        // Update tiles
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        // Update tiles
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        // Update tiles
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function getRecord() {
    // Retrieve the record from local storage or set it to 0 if it doesn't exist
    return localStorage.getItem("record") ? parseInt(localStorage.getItem("record")) : 0;
}

// Function to set the record in local storage and update the display
function setRecord(newRecord, updateDisplay = true) {
    document.getElementById("newrec_sound").play();
    const oldRecord = getRecord();
    localStorage.setItem("record", newRecord);
    if (updateDisplay) {
        displayRecord(); // Update the displayed record
    }

    // Check if a new record has been set
    if (newRecord > oldRecord) {
        alert("Congratulations! You set a new record of " + score);
        // Update the record displayed in the dashboard
        displayRecord();
    }
}

// Function to check for new record and display game over
function checkGameOver() {
    // Check if the game is over and the alert hasn't been shown yet
    if (!hasEmptyTile() && !canMove() && !gameOverAlertShown) {
        // Check if the current score is higher than the record
        let record = getRecord();
        if (score > record) {
            // Set the new record without updating the display
            setRecord(score, false);
            // Prompt for player name
            let playerName = prompt('Game Over! Your score is ' + score + '. Please enter your name:');
            if (playerName !== null) {
                // Call updateLeaderboard to update the leaderboard with the latest score after resetting the game
                updateLeaderboard(playerName, score);
            }
            // Display a message about the new record
            alert("Congratulations! You set a new record of " + score);
            // Update the record displayed in the dashboard
            displayRecord();
            // Reset the flag if the game is still ongoing
            gameOverAlertShown = false;
            return;
        }

        // Set the flag to true to indicate that the alert has been shown
        gameOverAlertShown = true;
        alert('Game Over! Your score is ' + score); // Display Game Over alert with score
        // Reset the flag if the game is still ongoing
        gameOverAlertShown = false;
    }
}





function resetGame() {
    document.getElementById("gameOverSound").play();
    // Reset the board to its initial state
    board = JSON.parse(JSON.stringify(initialBoard));

    // Update tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    
    // Check if a new record has been set
    let record = getRecord();
    if (score > record) {
        // Set the new record without updating the display
        setRecord(score, false);
        // Prompt for player name
        let playerName = prompt("Congratulations! You set a new record of " + score + ". Please enter your name:");
        if (playerName !== null) {
            // Call updateLeaderboard to update the leaderboard with the latest score after resetting the game
            updateLeaderboard(playerName, score);
        }
        // Display a message about the new record
        alert("Congratulations! You set a new record of " + score);
        // Update the record displayed in the dashboard
        displayRecord();
    } else {
        let playerName = prompt('Game Over! Your score is ' + score + '. Please enter your name:');
            if (playerName !== null) {
                // Call updateLeaderboard to update the leaderboard with the latest score after resetting the game
                updateLeaderboard(playerName, score);
            }

        
    }

    // Reset the score
    score = 0;
    updateScore();

    // Reset the record
    displayRecord();

    // Call displayLeaderboard to update the leaderboard after every game
    displayLeaderboard();

    // Reset the flag for showing the Game Over alert
    gameOverAlertShown = false;
}





// Function to start a new game
function newGame() {
    // Reset the board to its initial state
    board = JSON.parse(JSON.stringify(initialBoard));

    // Update tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    // Reset the score
    score = 0;
    updateScore();

    // Reset the record display
    displayRecord();

    // Reset the game over alert flag
    gameOverAlertShown = false;

    // Re-enable the key event listener
    keyEventListenerActive = true;

    // Check if there is a new record
    checkGameOver();
}

// Function to display the record
function displayRecord() {
    let record = getRecord();
    document.getElementById("record").innerText = record;
}

// Function to check if there are any available moves
function canMove() {
    // Check if there are any adjacent cells with the same value
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true; // If there's an empty cell, the game can still move
            }
            // Check right cell
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                return true;
            }
            // Check bottom cell
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return true;
            }
        }
    }
    return false; // No available moves
}

// Update the leaderboard
function updateLeaderboard(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort scores in descending order
    leaderboard = leaderboard.slice(0, 10); // Keep only the top 10 scores
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Display the leaderboard
function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = "<h3>Leaderboard</h3>";
    if (leaderboard.length === 0) {
        leaderboardContainer.innerHTML += "<h5>No scores yet!</h5>";
    } else {
        leaderboard.forEach((entry, index) => {
            leaderboardContainer.innerHTML += `<p>${index + 1}. ${entry.name}: ${entry.score}</p>`;
        });
    }
}

// Function to reset the leaderboard
function resetLeaderboard() {
    localStorage.removeItem("leaderboard");
    alert("Leaderboard has been reset!");
    displayLeaderboard(); // Update the leaderboard display
}

// Function to handle left movement when the "Move Left" button is clicked
function moveLeft() {
    if (keyEventListenerActive) {
        slideLeft();
        setTwo();
    }
}

// Function to handle up movement when the "Move Up" button is clicked
function moveUp() {
    if (keyEventListenerActive) {
        slideUp();
        setTwo();
    }
}

// Function to handle right movement when the "Move Right" button is clicked
function moveRight() {
    if (keyEventListenerActive) {
        slideRight();
        setTwo();
    }
}

// Function to handle down movement when the "Move Down" button is clicked
function moveDown() {
    if (keyEventListenerActive) {
        slideDown();
        setTwo();
    }
}










