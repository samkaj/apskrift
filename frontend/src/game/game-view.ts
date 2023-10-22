import Scroller from "./scroller.js";
import Game, { WordLimitGame } from "./game.js";

const scroller = new Scroller("words");
const up = document.getElementById("scroll-up");
const down = document.getElementById("scroll-down");
up?.addEventListener("click", scroller.up.bind(scroller));
down?.addEventListener("click", scroller.down.bind(scroller));

const game = new Game(new WordLimitGame(9));
const gameBox = document.getElementById("words");
if (gameBox) gameBox.innerHTML = game.getHtml();
const input: any = document.getElementById("word-input");
input?.addEventListener("input", (e: any) => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
        game.validateWord(val.trim());
        e.target.value = "";
        input.value = "";
        if (gameBox) gameBox.innerHTML = game.getHtml();
        if (game.isGameOver()) {
            alert("Game over!");
        }
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Tab" || e.key === "Escape") {
        game.reset();
        if (gameBox) gameBox.innerHTML = game.getHtml();
        input.focus();
    }
});
