import Game from "./game.js";
import TimeLimitGame from "./gamemodes/time.js";
import WordLimitGame from "./gamemodes/words.js";
import Scroller from "./scroller.js";
import Settings from "./settings.js";

export default class GameView {
    game: Game;
    private scroll: Scroller;
    private settings: Settings;
    private activeY: number;
    private input: HTMLInputElement;
    private wordBox: HTMLElement | null;
    private stats: HTMLElement | null;
    private chooseWordsButton: HTMLElement | null;
    private chooseTimeButton: HTMLElement | null;
    private resetButton: HTMLElement | null;
    private wordLimits: HTMLElement | null;
    private timeLimits: HTMLElement | null;
    private progress: HTMLElement | null;

    constructor() {
        this.game = new Game(new WordLimitGame(100), 100);
        this.initElements();
        this.activeY = 0;
        this.settings = new Settings();
        this.loadSettings();
        this.updateUI();
        this.addEventListeners();
        this.scroll.top();
    }

    updateUI(): void {
        if (this.progress)
            this.progress.innerHTML = this.game.getProgressHtml();
        if (!this.game.isFinished()) {
            this.renderWords();
            return;
        }
        this.renderStats();
    }

    reset(): void {
        this.game.reset();
        this.scroll.top();
        this.activeY = 0;
        this.updateUI();
        this.resetInput();
    }

    private renderWords(): void {
        if (this.wordBox) this.wordBox.innerHTML = this.game.getHtml();
        this.stats?.classList.add("hidden");
        this.wordBox?.classList.remove("hidden");
        this.input.classList.remove("hidden");
    }

    private renderStats(): void {
        if (this.stats) this.stats.innerHTML = this.game.getStatsHtml();
        this.wordBox?.classList.add("hidden");
        this.stats?.classList.remove("hidden");
        this.input.classList.add("hidden");
    }

    private initElements(): void {
        this.input = document.getElementById("word-input") as HTMLInputElement;
        this.wordBox = document.getElementById("words");
        this.stats = document.getElementById("stats");
        this.chooseWordsButton = document.getElementById("words-btn");
        this.chooseTimeButton = document.getElementById("time-btn");
        this.wordLimits = document.getElementById("word-limit");
        this.timeLimits = document.getElementById("time-limit");
        this.progress = document.getElementById("progress");
        this.resetButton = document.getElementById("reset-btn");
        this.scroll = new Scroller("words");

        if (this.isMobile()) {
            if (this.resetButton) this.resetButton.innerHTML = "restart";
        }
    }

    private loadSettings(): void {
        const gamemode = this.settings.getGamemode();
        if (gamemode === "word") {
            this.updateWordHtml();
        } else {
            this.updateTimeHtml();
        }
    }

    private addEventListeners(): void {
        this.input.addEventListener("input", this.handleInput.bind(this));
        document.addEventListener("keydown", this.handleReset.bind(this));
        this.chooseWordsButton?.addEventListener(
            "click",
            this.switchToWordLimit.bind(this)
        );
        this.chooseTimeButton?.addEventListener(
            "click",
            this.switchToTimeLimit.bind(this)
        );
        this.initAmountButtons();
        this.resetButton?.addEventListener("click", this.reset.bind(this));
    }

    private handleReset(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.reset();
        }
    }

    private switchToTimeLimit(): void {
        this.settings.setGamemode("time");
        this.updateTimeHtml();
        this.reset();
    }

    private switchToWordLimit(): void {
        this.settings.setGamemode("word");
        this.updateWordHtml();
        this.reset();
    }

    private initAmountButtons(): void {
        const wordAmounts = document.querySelectorAll(".word-amount");
        const timeAmounts = document.querySelectorAll(".time-amount");
        if (this.isMobile()) {
            wordAmounts[wordAmounts.length - 1].remove();
            timeAmounts[timeAmounts.length - 1].remove();
        }
        wordAmounts.forEach((amount) => {
            amount.addEventListener("click", this.handleWordAmount.bind(this));
        });
        timeAmounts.forEach((amount) => {
            amount.addEventListener("click", this.handleTimeAmount.bind(this));
        });
    }

    private handleWordAmount(e: Event): void {
        const target = e.target as HTMLElement;
        const wordLimit = target.id.split("-")[1];
        this.settings.setWordLimit(parseInt(wordLimit));
        this.updateWordHtml();
        this.reset();
    }

    private handleTimeAmount(e: Event): void {
        const target = e.target as HTMLElement;
        const timeLimit = target.id.split("-")[1];
        this.settings.setTimeLimit(parseInt(timeLimit));
        this.updateTimeHtml();
        this.reset();
    }

    private handleInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        if (this.game.isFirstWord()) {
            this.game.startGame();
        }
        const val = target.value;
        const correct = val == this.game.getCurrentWord().value;
        if (val.endsWith(" ") || (correct && this.game.isLastWord())) {
            this.game.validateWord(val.trim());
            target.value = "";
        }

        this.scrollIfNewLine();
    }

    private scrollIfNewLine(): void {
        const newActiveY =
            document.querySelector(".word-active")?.getBoundingClientRect().y ||
            0;
        if (this.activeY === 0) this.activeY = newActiveY;
        if (newActiveY > this.activeY) {
            this.scroll.down();
            this.activeY = newActiveY;
        }
    }

    private updateTimeHtml(): void {
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

    private updateWordHtml(): void {
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

    private clearAmountLists(): void {
        const wordAmounts = document.querySelectorAll(".word-amount");
        const timeAmounts = document.querySelectorAll(".time-amount");
        wordAmounts.forEach((amount) => {
            amount.classList.remove("active");
        });
        timeAmounts.forEach((amount) => {
            amount.classList.remove("active");
        });
    }

    private isMobile(): boolean {
        return window.innerWidth < 768;
    }

    private resetInput(): void {
        this.input.value = "";
        this.input.focus();
    }
}
