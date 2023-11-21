import generateWords from "./wordgen.js";
import TimeLimitGame from "./gamemodes/time.js";

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
    private running: RunningStatus = RunningStatus.STOPPED;
    private gamemode: Gamemode;
    private words: Word[];
    private index: number = 0;
    private amount: number;
    private startTime: number;
    private endTime: number = 0;
    private correctWords: number = 0;
    private wordClassMap = {
        [WordStatus.ACTIVE]: "word-active",
        [WordStatus.INACTIVE]: "word-inactive",
        [WordStatus.CORRECT]: "word-correct",
        [WordStatus.INCORRECT]: "word-incorrect",
    };

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

    getProgressHtml(): string {
        return this.gamemode.getProgressHtml();
    }

    getHtml(): string {
        return this.words
            .map(
                (word) =>
                    `<span class="word ${this.getWordClass(word)}">${
                        word.value
                    }</span>`
            )
            .join("");
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

    private getWordClass(word: Word): string {
        return this.wordClassMap[word.wordStatus];
    }

    private getWPM(): number {
        const time = this.endTime - this.startTime;
        const minutes = time / 1000 / 60;
        return Math.round(this.correctWords / minutes);
    }

    private getAccuracy(): number {
        if (this.index === 0) return 0;
        return Math.round((this.correctWords / this.index) * 100);
    }

    private getTime(): number {
        return this.endTime - this.startTime;
    }
}
