import Scroller from "./scroller.js";
import Game, { WordLimitGame } from "./game.js";

const input: any = document.getElementById("word-input");
const up = document.getElementById("scroll-up");
const down = document.getElementById("scroll-down");
const game = new Game(new WordLimitGame(15), 15);
const wordsElement = document.getElementById("words");
const progressElement = document.getElementById("progress");
const scroll = new Scroller("words");

let activeY: number =
    document.querySelector(".active")?.getBoundingClientRect().y || 0;

if (wordsElement) wordsElement.innerHTML = game.getHtml();

function handleInput(e: any) {
    const val = e.target.value;
    if (val.endsWith(" ")) {
        game.validateWord(val.trim());
        e.target.value = "";
        input.value = "";
        if (wordsElement) wordsElement.innerHTML = game.getHtml();
        if (progressElement) progressElement.innerHTML = game.getProgressHtml();
        if (game.isGameOver()) {
            alert("Game over!");
        }
        scrollIfNewLine();
    }
}

function scrollIfNewLine() {
    const newActiveY =
        document.querySelector(".active")?.getBoundingClientRect().y || 0;
    if (activeY === 0) activeY = newActiveY;
    if (newActiveY > activeY) {
        scroll.down();
        activeY = newActiveY;
    }
}

function handleReset(e: any) {
    if (e.key === "Escape") {
        game.reset();
        if (wordsElement) wordsElement.innerHTML = game.getHtml();
        resetInput();
        scroll.top();
        if (progressElement) progressElement.innerHTML = game.getProgressHtml();
    }
}

function addEventListeners() {
    document.addEventListener("keydown", handleReset);
    up?.addEventListener("click", scroll.up.bind(scroll));
    down?.addEventListener("click", scroll.down.bind(scroll));
    input?.addEventListener("input", handleInput);
}

function resetInput() {
    input.value = "";
    input.focus();
}

addEventListeners();
scroll.top();
resetInput();
