export default class Settings {
    private gamemode: string;
    private wordLimit: number;
    private timeLimit: number;

    constructor() {
        this.gamemode = localStorage.getItem("gamemode") || "word";
        this.wordLimit = parseInt(localStorage.getItem("word-limit") || "50");
        this.timeLimit = parseInt(localStorage.getItem("time-limit") || "15");
        this.save();
    }

    public getGamemode(): string {
        return this.gamemode;
    }

    public setGamemode(gamemode: string): void {
        this.gamemode = gamemode;
    }

    public getWordLimit(): number {
        return this.wordLimit;
    }

    public setWordLimit(wordLimit: number): void {
        this.wordLimit = wordLimit;
        this.save();
    }

    public getTimeLimit(): number {
        return this.timeLimit;
    }

    public setTimeLimit(timeLimit: number): void {
        this.timeLimit = timeLimit;
        this.save();
    }

    private save(): void {
        localStorage.setItem("gamemode", this.gamemode);
        localStorage.setItem("word-limit", this.wordLimit.toString());
        localStorage.setItem("time-limit", this.timeLimit.toString());
    }
}
