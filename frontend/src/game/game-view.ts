import Scroller from "./scroller.js";
import Game, { TimeLimitGame, WordLimitGame } from "./game.js";
import Settings from "./settings.js";

const input: any = document.getElementById("word-input");
const up = document.getElementById("scroll-up");
const down = document.getElementById("scroll-down");
const wordsElement = document.getElementById("words");
const progressElement = document.getElementById("progress");
const scroll = new Scroller("words");
const wordsButton = document.getElementById("words-btn");
const wordLimitDiv = document.getElementById("word-limit");
const timeButton = document.getElementById("time-btn");
const timeLimitDiv = document.getElementById("time-limit");
const settings = new Settings();

let game = new Game(new WordLimitGame(15), 15);

let activeY: number =
    document.querySelector(".word-active")?.getBoundingClientRect().y || 0;

if (wordsElement) wordsElement.innerHTML = game.getHtml();

function handleInput(e: any) {
    if (!game.isRunning()) {
        game.startGame();
    }
    const val = e.target.value;
    const correct = val == game.getCurrentWord().value;
    if (val.endsWith(" ") || (correct && game.isLastWord())) {
        game.validateWord(val.trim());
        e.target.value = "";
        input.value = "";
        if (game.isGameOver()) {
            alert("Game over!");
        }
    }
    scrollIfNewLine();
}

function scrollIfNewLine() {
    const newActiveY =
        document.querySelector(".word-active")?.getBoundingClientRect().y || 0;
    if (activeY === 0) activeY = newActiveY;
    if (newActiveY > activeY) {
        scroll.down();
        activeY = newActiveY;
    }
}

function handleReset(e: any) {
    if (e.key === "Escape") {
        reset();
    }
}

function reset() {
    game.reset();
    resetInput();
    scroll.top();
    activeY = 0;
    updateUI();
}

function addEventListeners() {
    document.addEventListener("keydown", handleReset);
    up?.addEventListener("click", scroll.up.bind(scroll));
    down?.addEventListener("click", scroll.down.bind(scroll));
    input?.addEventListener("input", handleInput);
    wordsButton?.addEventListener("click", updateWordHtml);
    timeButton?.addEventListener("click", updateTimeHtml);
    addWordLimitEventListeners();
    addTimeLimitEventListeners();
}

function addWordLimitEventListeners() {
    const wordAmounts = document.querySelectorAll(".word-amount");
    wordAmounts.forEach((amount) => {
        amount.addEventListener("click", handleWordLimitClick);
    });
}

function addTimeLimitEventListeners() {
    const timeAmounts = document.querySelectorAll(".time-amount");
    timeAmounts.forEach((amount) => {
        amount.addEventListener("click", handleTimeLimitClick);
    });
}

function handleWordLimitClick(e: any) {
    const wordLimit = parseInt(e.target.id.split("-")[1]);
    settings.setWordLimit(wordLimit);
    game = new Game(new WordLimitGame(wordLimit), wordLimit);
    resetInput();
    scroll.top();
    updateWordHtml();
}

function handleTimeLimitClick(e: any) {
    const timeLimit = parseInt(e.target.id.split("-")[1]);
    settings.setTimeLimit(timeLimit);
    game = new Game(new TimeLimitGame(timeLimit), 100);
    resetInput();
    scroll.top();
    updateTimeHtml();
}

function updateTimeHtml() {
    settings.setGamemode("time");
    clearAmountLists();
    timeButton?.classList.add("active");
    wordsButton?.classList.remove("active");
    wordLimitDiv?.classList.add("hidden");
    timeLimitDiv?.classList.remove("hidden");
    const timeLimit = settings.getTimeLimit();
    const activeTimeLimit = document.getElementById(`time-${timeLimit}`);
    activeTimeLimit?.classList.add("active");
    settings.setTimeLimit(timeLimit);
    game = new Game(new TimeLimitGame(timeLimit), 100);
}

function updateWordHtml() {
    settings.setGamemode("word");
    clearAmountLists();
    wordsButton?.classList.add("active");
    timeButton?.classList.remove("active");
    timeLimitDiv?.classList.add("hidden");
    wordLimitDiv?.classList.remove("hidden");
    const wordLimit = settings.getWordLimit();
    const activeWordLimit = document.getElementById(`word-${wordLimit}`);
    activeWordLimit?.classList.add("active");
    settings.setWordLimit(wordLimit);
    game = new Game(new WordLimitGame(wordLimit), wordLimit);
}

function clearAmountLists() {
    const wordAmounts = document.querySelectorAll(".word-amount");
    const timeAmounts = document.querySelectorAll(".time-amount");
    wordAmounts.forEach((amount) => {
        amount.classList.remove("active");
    });
    timeAmounts.forEach((amount) => {
        amount.classList.remove("active");
    });
}

function loadSettings() {
    const gamemode = settings.getGamemode();
    if (gamemode === "word") {
        updateWordHtml();
    } else {
        updateTimeHtml();
    }
    updateUI();
}

function updateUI() {
    if (wordsElement) wordsElement.innerHTML = game.getHtml();
    if (progressElement) progressElement.innerHTML = game.getProgressHtml();
}

function resetInput() {
    input.value = "";
    input.focus();
}

addEventListeners();
scroll.top();
resetInput();
loadSettings();
updateUI();

setInterval(() => {
    if (game.isGameOver()) {
        alert("Game over!");
        reset();
    }
    updateUI();
}, 50);
