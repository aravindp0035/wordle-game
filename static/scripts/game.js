const wordList = ["APPLE", "CRANE", "BRAIN", "SWORD", "NINJA", "GHOST", "ZEBRA"];
const answer = wordList[Math.floor(Math.random() * wordList.length)];
let currentRow = 0;
let currentCol = 0;
const totalCols = 5;
const totalRows = 6;

document.addEventListener("DOMContentLoaded", () => {
    // Focus the first tile
    const firstTile = document.getElementById(`tile-0-0`);
    if (firstTile) firstTile.focus();

    // Add event listeners to all tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.addEventListener("input", handleTileInput);
        tile.addEventListener("keydown", handleKeyDown);
    });

    // Add event listener to submit button
    document.getElementById("submit-button").addEventListener("click", submitGuess);
});

function handleTileInput(e) {
    const key = e.target.value.toUpperCase();
    e.target.value = key;  // Force uppercase

    // Move to next tile if not last column
    if (/^[A-Z]$/.test(key) && currentCol < totalCols - 1) {
        currentCol++;
        const nextTile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        if (nextTile) nextTile.focus();
    }
}

function handleKeyDown(e) {
    if (e.key === "Backspace" && currentCol > 0) {
        e.preventDefault();
        const prevTile = document.getElementById(`tile-${currentRow}-${currentCol - 1}`);
        if (prevTile) {
            prevTile.value = "";
            prevTile.focus();
            currentCol--;
        }
    } else if (e.key === "Enter") {
        submitGuess();
    }
}

function submitGuess() {
    let guess = "";
    for (let col = 0; col < totalCols; col++) {
        const tile = document.getElementById(`tile-${currentRow}-${col}`);
        guess += tile.value.toUpperCase();
    }

    if (guess.length !== totalCols) return;

    const result = checkGuess(guess, answer);

    for (let col = 0; col < totalCols; col++) {
        const tile = document.getElementById(`tile-${currentRow}-${col}`);
        tile.disabled = true;

        if (result[col] === "correct") {
            tile.style.backgroundColor = "#4CAF50"; // green
        } else if (result[col] === "present") {
            tile.style.backgroundColor = "#FFC107"; // yellow
        } else {
            tile.style.backgroundColor = "#555"; // gray
        }

        tile.style.color = "#fff";
    }

    const statusMessage = document.getElementById("status-message");
    if (guess === answer) {
      statusMessage.textContent = `🎉 You guessed it! The word was ${answer}`;
      statusMessage.classList.add("correct-message");
        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === totalRows) {
      statusMessage.textContent = `❌ Out of attempts! The word was ${answer}`;
      statusMessage.classList.add("error-message");
    } else {
        const nextTile = document.getElementById(`tile-${currentRow}-0`);
        if (nextTile) nextTile.focus();
    }
}

function checkGuess(guess, answer) {
    const result = Array(5).fill("absent");
    const answerLetters = answer.split("");

    // First pass for correct
    for (let i = 0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            result[i] = "correct";
            answerLetters[i] = null;
        }
    }

    // Second pass for present
    for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;

        const idx = answerLetters.indexOf(guess[i]);
        if (idx !== -1) {
            result[i] = "present";
            answerLetters[idx] = null;
        }
    }

    return result;
}
