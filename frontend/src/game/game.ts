import generateWords from "./wordgen.js";

interface Gamemode {
    isGameOver(): boolean;
    startGame(): void;
    onInput(): void;
    reset(): void;
    getProgressHtml(): string;
    getGamemodeHtml(): string;
}

enum WordStatus {
    ACTIVE,
    INACTIVE,
    CORRECT,
    INCORRECT,
}

enum RunningStatus {
    RUNNING,
    STOPPED,
    FINISHED,
}

type Word = {
    value: string;
    wordStatus: WordStatus;
};

export default class Game {
    running: RunningStatus = RunningStatus.STOPPED;
    private gamemode: Gamemode;
    private words: Word[];
    private index: number = 0;
    private amount: number;
    private startTime: number;
    private endTime: number = 0;
    private correctWords: number = 0;

    constructor(gamemode: Gamemode, amount: number = 60) {
        this.gamemode = gamemode;
        this.words = this.createWords(amount);
        this.words[0].wordStatus = WordStatus.ACTIVE;
        this.amount = amount;
        this.startTime = Date.now();
    }

    createWords(amount: number): Word[] {
        return generateWords(amount).map((value) => {
            return { value: value, wordStatus: WordStatus.INACTIVE };
        });
    }

    addRandomWord(): void {
        this.words.push({
            value: generateWords(1)[0],
            wordStatus: WordStatus.INACTIVE,
        });
    }

    reset(): void {
        this.words = this.createWords(this.amount);
        this.words[0].wordStatus = WordStatus.ACTIVE;
        this.index = 0;
        this.running = RunningStatus.STOPPED;
        this.endTime = Date.now();
        this.correctWords = 0;
        this.gamemode.reset();
    }

    isGameOver(): boolean {
        const gameOver =
            this.gamemode.isGameOver() &&
            this.running === RunningStatus.RUNNING;
        if (gameOver) {
            this.endTime = Date.now();
            this.running = RunningStatus.FINISHED;
        }
        return gameOver;
    }

    isFirstWord(): boolean {
        return this.index === 0;
    }

    isRunning(): boolean {
        return this.running === RunningStatus.RUNNING;
    }

    isFinished(): boolean {
        return (
            this.running === RunningStatus.FINISHED ||
            this.gamemode.isGameOver()
        );
    }

    startGame(): void {
        this.startTime = Date.now();
        this.running = RunningStatus.RUNNING;
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
        if (currentWord.value === word) {
            this.correctWords++;
        }
        this.index++;
        if (this.index < this.words.length)
            this.words[this.index].wordStatus = WordStatus.ACTIVE;
        if (
            this.gamemode instanceof TimeLimitGame &&
            this.index >= Math.floor(this.words.length - 1) / 2
        ) {
            this.addRandomWord();
        }
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
                return "word-active";
            case WordStatus.INACTIVE:
                return "word-inactive";
            case WordStatus.CORRECT:
                return "word-correct";
            case WordStatus.INCORRECT:
                return "word-incorrect";
        }
    }

    getWPM(): number {
        const time = this.endTime - this.startTime;
        const minutes = time / 1000 / 60;
        return Math.round(this.correctWords / minutes);
    }

    getAccuracy(): number {
        if (this.index === 0) return 0;
        return Math.round((this.correctWords / this.index) * 100);
    }

    getTime(): number {
        return this.endTime - this.startTime;
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

    getStatsHtml(): string {
        return `
            <h1>${this.gamemode.getGamemodeHtml()}</h1>
            <p><span class="label">WPM</span> ${this.getWPM()}
            <span class="label">Accuracy</span> ${this.getAccuracy()}%
            <span class="label">Elapsed time</span> ${Math.floor(
                this.getTime() / 1000
            )}s</p>
        `;
    }
}

export class TimeLimitGame implements Gamemode {
    private timeLimit: number;
    private timer: Timer;
    private wordsTyped: number;

    constructor(timeLimit: number) {
        this.timeLimit = timeLimit;
        this.timer = new Timer(timeLimit);
        this.wordsTyped = 0;
    }

    startGame(): void {
        this.timer = new Timer(this.timeLimit);
        this.timer.startTimer();
        this.wordsTyped = 0;
    }

    isGameOver(): boolean {
        return this.timer.getTime() <= 0;
    }

    onInput() {
        this.wordsTyped++;
    }

    reset(): void {
        this.timer.stopTimer();
    }

    getProgressHtml(): string {
        return `${Math.max(this.timer.getTime(), 0)}`;
    }

    getGamemodeHtml(): string {
        return `<span class="label">Words typed</span> ${this.wordsTyped}`;
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

    getGamemodeHtml(): string {
        return `${this.wordLimit} words`;
    }
}

class Timer {
    private countdown: number;
    private timer: number;
    private interval: number;

    constructor(countdown: number) {
        this.countdown = countdown;
        this.timer = countdown;
    }

    getTime(): number {
        return this.countdown;
    }

    stopTimer(): void {
        window.clearInterval(this.interval);
        this.countdown = this.timer;
    }

    startTimer(): void {
        this.interval = window.setInterval(() => {
            this.countdown--;
        }, 1000);
    }
}
