import generateWords from "./wordgen.js";

/**
 * Game describes different ways of checking if a game is over.
 */
interface Gamemode {
    isGameOver(): boolean;
    startGame(): void;
    onInput(): void;
    reset(): void;
    getProgressHtml(): string;
}

enum WordStatus {
    ACTIVE,
    INACTIVE,
    CORRECT,
    INCORRECT,
}

type Word = {
    value: string;
    wordStatus: WordStatus;
};

export default class Game {
    private gamemode: Gamemode;
    private words: Word[];
    private index: number = 0;
    private amount: number;

    constructor(gamemode: Gamemode, amount: number = 60) {
        this.gamemode = gamemode;
        this.words = this.getWords(amount);
        this.words[0].wordStatus = WordStatus.ACTIVE;
        this.amount = amount;
    }

    getWords(amount: number): Word[] {
        return generateWords(amount).map((value) => {
            return { value: value, wordStatus: WordStatus.INACTIVE };
        });
    }

    reset(): void {
        this.words = this.getWords(this.amount);
        this.words[0].wordStatus = WordStatus.ACTIVE;
        this.index = 0;
        this.gamemode.reset();
    }

    isGameOver(): boolean {
        return this.gamemode.isGameOver();
    }

    startGame(): void {
        this.gamemode.startGame();
    }

    validateWord(word: string): void {
        if (this.isGameOver()) return;
        this.gamemode.onInput();
        const currentWord = this.words[this.index];
        this.words[this.index].wordStatus =
            currentWord.value === word
                ? WordStatus.CORRECT
                : WordStatus.INCORRECT;
        this.index++;
        if (this.index < this.words.length)
            this.words[this.index].wordStatus = WordStatus.ACTIVE;
    }

    getCurrentWord(): Word {
        return this.words[this.index];
    }

    isLastWord(): boolean {
        return this.index === this.words.length - 1;
    }

    getWordClass(word: Word): string {
        switch (word.wordStatus) {
            case WordStatus.ACTIVE:
                return "active";
            case WordStatus.INACTIVE:
                return "inactive";
            case WordStatus.CORRECT:
                return "correct";
            case WordStatus.INCORRECT:
                return "incorrect";
        }
    }

    getProgressHtml(): string {
        return this.gamemode.getProgressHtml();
    }

    getHtml(): string {
        var html = "";
        this.words.forEach((word) => {
            html += `<span class="word ${this.getWordClass(word)}">${
                word.value
            }</span>`;
        });
        return html;
    }
}

export class TimeLimitGame implements Gamemode {
    private timeLimit: number;
    private timer: Timer;

    constructor(timeLimit: number) {
        this.timeLimit = timeLimit;
        this.timer = new Timer();
    }

    startGame(): void {
        this.timer = new Timer();
    }

    isGameOver(): boolean {
        return this.timeLimit <= this.timer.getTime();
    }

    onInput() {
        // Do nothing
    }

    reset(): void {
        this.timer.stopTimer();
    }

    getProgressHtml(): string {
        return `${this.timer.getTime()} / ${this.timeLimit}`;
    }
}

export class WordLimitGame implements Gamemode {
    private wordLimit: number;
    private wordsTyped: number = 0;

    constructor(wordLimit: number) {
        this.wordLimit = wordLimit;
    }

    startGame(): void {
        this.wordsTyped = 0;
    }

    isGameOver(): boolean {
        return this.wordLimit <= this.wordsTyped;
    }

    onInput() {
        this.wordsTyped++;
    }

    reset(): void {
        this.wordsTyped = 0;
    }

    getProgressHtml(): string {
        return `${this.wordsTyped} / ${this.wordLimit}`;
    }
}

class Timer {
    private time: number = 0;
    private timer: number = 0;

    constructor() {
        this.timer = window.setInterval(() => {
            this.time++;
        }, 1000);
    }

    getTime(): number {
        return this.time;
    }

    stopTimer(): void {
        window.clearInterval(this.timer);
    }

    startTimer(): void {
        this.timer = window.setInterval(() => {
            this.time++;
        }, 1000);
    }
}
