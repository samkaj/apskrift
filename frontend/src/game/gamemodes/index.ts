export default interface Gamemode {
    isGameOver(): boolean;
    startGame(): void;
    onInput(): void;
    reset(): void;
    getProgressHtml(): string;
    getGamemodeHtml(): string;
}
