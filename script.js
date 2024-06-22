const words = {
    easy: ['CAT', 'DOG', 'RUN', 'JUMP', 'PLAY', 'BALL', 'HAPPY', 'SMILE', 'LAUGH', 'FRIEND'],
    medium: ['JAVASCRIPT', 'PYTHON', 'HANGMAN', 'COMPUTER', 'PROGRAM', 'DEVELOPER', 'FUNCTION', 'VARIABLE', 'OBJECT', 'ARRAY'],
    hard: ['CRYPTOCURRENCY', 'AUTHENTICATION', 'OPTIMIZATION', 'SCALABILITY', 'ASYNCHRONOUS', 'ENCAPSULATION', 'POLYMORPHISM', 'SERIALIZATION', 'MIDDLEWARE', 'MICROSERVICES']
};

let selectedWord = '';
let guessedLetters = [];
let remainingGuesses = 6;
let currentDifficulty = 'medium';
let money = 0;
let hintsUsed = 0;

const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const mainMenuBtn = document.getElementById('main-menu-btn');
const leaveGameBtn = document.getElementById('leave-game-btn');
const moneyDisplay = document.getElementById('money-display');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const hangmanGroup = document.getElementById('hangman');

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    difficultyBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

function initGame() {
    selectedWord = words[currentDifficulty][Math.floor(Math.random() * words[currentDifficulty].length)];
    guessedLetters = [];
    remainingGuesses = 6;
    hintsUsed = 0;
    updateWordDisplay();
    resetHangmanDrawing();
    createKeyboard();
    message.textContent = '';
    restartBtn.style.display = 'none';
    mainMenuBtn.style.display = 'none';
    hintBtn.style.display = 'inline-block';
    leaveGameBtn.style.display = 'inline-block';
    hangmanGroup.classList.remove('swing');
}

function updateWordDisplay() {
    wordDisplay.textContent = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
}

function createKeyboard() {
    keyboard.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'key';
        button.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(button);
    }
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    document.querySelector(`.key:nth-child(${letter.charCodeAt(0) - 64})`).disabled = true;

    if (selectedWord.includes(letter)) {
        updateWordDisplay();
        if (!wordDisplay.textContent.includes('_')) {
            endGame(true);
        }
    } else {
        remainingGuesses--;
        updateHangmanDrawing();
        if (remainingGuesses === 0) {
            endGame(false);
        }
    }
}

function resetHangmanDrawing() {
    const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    parts.forEach(part => {
        document.getElementById(part).setAttribute('visibility', 'hidden');
    });
}

function updateHangmanDrawing() {
    const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    const partToShow = 6 - remainingGuesses - 1;
    if (parts[partToShow]) {
        document.getElementById(parts[partToShow]).setAttribute('visibility', 'visible');
    }
}

function endGame(isWin) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.disabled = true);

    if (isWin) {
        message.textContent = 'Congratulations! You won!';
        money += 10;
        moneyDisplay.textContent = `Money: $${money}`;
    } else {
        message.textContent = `Game over! The word was: ${selectedWord}`;
        hangmanGroup.classList.add('swing');
    }

    restartBtn.style.display = 'inline-block';
    mainMenuBtn.style.display = 'inline-block';
    hintBtn.style.display = 'none';
    leaveGameBtn.style.display = 'none';
}

function buyHint() {
    if (money >= 5) {
        money -= 5;
        hintsUsed++;
        moneyDisplay.textContent = `Money: $${money}`;

        const hiddenLetters = selectedWord.split('').filter(letter => !guessedLetters.includes(letter));
        if (hiddenLetters.length > 0) {
            const hintLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
            handleGuess(hintLetter);
        }
    } else {
        message.textContent = 'Not enough money to buy a hint!';
    }
}

restartBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', buyHint);
leaveGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the game?')) {
        gameContainer.style.display = 'none';
        mainMenu.style.display = 'block';
    }
});
mainMenuBtn.addEventListener('click', () => {
    gameContainer.style.display = 'none';
    mainMenu.style.display = 'block';
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => setDifficulty(e.target.dataset.difficulty));
});

document.getElementById('start-game-btn').addEventListener('click', () => {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
});

// Load money from local storage
if (localStorage.getItem('hangmanMoney')) {
    money = parseInt(localStorage.getItem('hangmanMoney'));
    moneyDisplay.textContent = `Money: $${money}`;
}

// Save money to local storage when the page is unloaded
window.addEventListener('beforeunload', () => {
    localStorage.setItem('hangmanMoney', money);
});

setDifficulty('medium');