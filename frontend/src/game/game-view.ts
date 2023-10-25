import Game, { TimeLimitGame, WordLimitGame } from "./game.js";
import Scroller from "./scroller.js";
import Settings from "./settings.js";

export default class GameView {
    game: Game;
    private scroll: Scroller;
    private settings: Settings;
    private activeY: number;
    private input: HTMLInputElement;
    private wordBox: HTMLElement | null;
    private chooseWordsButton: HTMLElement | null;
    private chooseTimeButton: HTMLElement | null;
    private wordLimits: HTMLElement | null;
    private timeLimits: HTMLElement | null;
    private progress: HTMLElement | null;

    constructor() {
        this.game = new Game(new WordLimitGame(100), 100);
        this.initElements();
        this.initListeners();
        this.activeY = 0;
        this.settings = new Settings();
        this.loadSettings();
        this.updateUI();
        this.addEventListeners();
        this.scroll.top();
    }

    updateUI() {
        if (this.wordBox) this.wordBox.innerHTML = this.game.getHtml();
        if (this.progress)
            this.progress.innerHTML = this.game.getProgressHtml();
    }

    reset() {
        this.game.reset();
        this.resetInput();
        this.scroll.top();
        this.activeY = 0;
        this.updateUI();
    }

    private initElements() {
        this.input = document.getElementById("word-input") as HTMLInputElement;
        this.wordBox = document.getElementById("words");
        this.chooseWordsButton = document.getElementById("words-btn");
        this.chooseTimeButton = document.getElementById("time-btn");
        this.wordLimits = document.getElementById("word-limit");
        this.timeLimits = document.getElementById("time-limit");
        this.progress = document.getElementById("progress");
        this.scroll = new Scroller("words");
    }

    private loadSettings() {
        const gamemode = this.settings.getGamemode();
        if (gamemode === "word") {
            this.updateWordHtml();
        } else {
            this.updateTimeHtml();
        }
        this.updateUI();
    }

    private addEventListeners() {
        this.input.addEventListener("input", this.handleInput);
        document.addEventListener("keydown", this.handleReset);
        this.chooseWordsButton?.addEventListener(
            "click",
            this.updateWordHtml.bind(this)
        );
        this.chooseTimeButton?.addEventListener(
            "click",
            this.updateTimeHtml.bind(this)
        );
        this.addWordLimitEventListeners();
        this.addTimeLimitEventListeners();
    }

    private addWordLimitEventListeners() {
        const wordAmounts = document.querySelectorAll(".word-amount");
        wordAmounts.forEach((amount) => {
            amount.addEventListener(
                "click",
                this.handleWordLimitClick.bind(this)
            );
        });
    }

    private addTimeLimitEventListeners() {
        const timeAmounts = document.querySelectorAll(".time-amount");
        timeAmounts.forEach((amount) => {
            amount.addEventListener(
                "click",
                this.handleTimeLimitClick.bind(this)
            );
        });
    }

    private handleWordLimitClick(e: any) {
        const wordLimit = parseInt(e.target.id.split("-")[1]);
        this.settings.setWordLimit(wordLimit);
        this.game = new Game(new WordLimitGame(wordLimit), wordLimit);
        this.resetInput();
        this.scroll.top();
        this.updateWordHtml();
    }

    private handleReset(e: any) {
        if (e.key === "Escape") {
            this.reset();
        }
    }

    private handleTimeLimitClick(e: any) {
        const timeLimit = parseInt(e.target.id.split("-")[1]);
        this.settings.setTimeLimit(timeLimit);
        this.game = new Game(new TimeLimitGame(timeLimit), 100);
        this.resetInput();
        this.scroll.top();
        this.updateTimeHtml();
    }

    private initListeners() {
        this.input.addEventListener("input", this.handleInput);
        document.addEventListener("keydown", this.handleReset);
        this.chooseWordsButton?.addEventListener(
            "click",
            this.handleWordLimitClick
        );
        this.chooseTimeButton?.addEventListener(
            "click",
            this.handleTimeLimitClick
        );
    }

    private handleInput = (e: any) => {
        if (!this.game.isRunning()) {
            this.game.startGame();
        }
        const val = e.target.value;
        const correct = val == this.game.getCurrentWord().value;
        if (val.endsWith(" ") || (correct && this.game.isLastWord())) {
            this.game.validateWord(val.trim());
            e.target.value = "";
            this.input.value = "";
            if (this.game.isGameOver()) {
                alert(this.game.getWPM());
            }
        }

        this.scrollIfNewLine();
    };
    private scrollIfNewLine() {
        const newActiveY =
            document.querySelector(".word-active")?.getBoundingClientRect().y ||
            0;
        if (this.activeY === 0) this.activeY = newActiveY;
        if (newActiveY > this.activeY) {
            this.scroll.down();
            this.activeY = newActiveY;
        }
    }

    private updateTimeHtml() {
        this.settings.setGamemode("time");
        this.clearAmountLists();
        this.chooseTimeButton?.classList.add("active");
        this.chooseWordsButton?.classList.remove("active");
        this.wordLimits?.classList.add("hidden");
        this.timeLimits?.classList.remove("hidden");
        const timeLimit = this.settings.getTimeLimit();
        const activeTimeLimit = document.getElementById(`time-${timeLimit}`);
        activeTimeLimit?.classList.add("active");
        this.settings.setTimeLimit(timeLimit);
        this.game = new Game(new TimeLimitGame(timeLimit), 100);
    }

    private updateWordHtml() {
        this.settings.setGamemode("word");
        this.clearAmountLists();
        this.chooseTimeButton?.classList.remove("active");
        this.chooseWordsButton?.classList.add("active");
        this.wordLimits?.classList.remove("hidden");
        this.timeLimits?.classList.add("hidden");
        const wordLimit = this.settings.getWordLimit();
        const activeWordLimit = document.getElementById(`word-${wordLimit}`);
        activeWordLimit?.classList.add("active");
        this.settings.setWordLimit(wordLimit);
        this.game = new Game(new WordLimitGame(wordLimit), wordLimit);
    }

    private clearAmountLists() {
        const wordAmounts = document.querySelectorAll(".word-amount");
        const timeAmounts = document.querySelectorAll(".time-amount");
        wordAmounts.forEach((amount) => {
            amount.classList.remove("active");
        });
        timeAmounts.forEach((amount) => {
            amount.classList.remove("active");
        });
    }

    private resetInput() {
        this.input.value = "";
        this.input.focus();
    }
}
