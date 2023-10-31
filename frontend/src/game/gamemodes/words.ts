import Gamemode from ".";

export default class WordLimitGame implements Gamemode {
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
