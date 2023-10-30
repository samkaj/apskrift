import GameView from "./game-view.js";

function main() {
    const gameView = new GameView();

    setInterval(() => {
        if (gameView.game.isGameOver()) {
            return;
        }
        gameView.updateUI();
    }, 1000 / 60);
}

main();
