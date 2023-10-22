import Scroller from "./scroller.js";
import Game, { WordLimitGame } from "./game.js";

const input: any = document.getElementById("word-input");
const up = document.getElementById("scroll-up");
const down = document.getElementById("scroll-down");
const game = new Game(new WordLimitGame(90));
const gameBox = document.getElementById("words");
const scroll = new Scroller("words");

let activeY: number =
    document.querySelector(".active")?.getBoundingClientRect().y || 0;

if (gameBox) gameBox.innerHTML = game.getHtml();

function handleInput(e: any) {
    const val = e.target.value;
    if (val.endsWith(" ")) {
        game.validateWord(val.trim());
        e.target.value = "";
        input.value = "";
        if (gameBox) gameBox.innerHTML = game.getHtml();
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
        if (gameBox) gameBox.innerHTML = game.getHtml();
        input.value = "";
        input.focus();
    }
}

function addEventListeners() {
    document.addEventListener("keydown", handleReset);
    up?.addEventListener("click", scroll.up.bind(scroll));
    down?.addEventListener("click", scroll.down.bind(scroll));
    input?.addEventListener("input", handleInput);
}

addEventListeners();
