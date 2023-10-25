import GameView from "./game-view.js";

function main() {
    const gameView = new GameView();

    setInterval(() => {
        if (gameView.game.isGameOver()) {
            alert(gameView.game.getWPM());
            gameView.reset();
        }
        gameView.updateUI();
    }, 50);
}

main();
