import Gamemode from ".";

export default class TimeLimitGame implements Gamemode {
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
