Game.score = (function (graphics) {
    let that = {};
    let curScore;
    let remainingLives;
    var canvas = document.getElementById('canvas-main');
	var context = canvas.getContext('2d');
    let gameOver = false;
    let countDown = 3;
    let startCountdownTime = 0;
    let timeSoFar = 0;
    let scoreRecorded = false;
    let gameRunning = false;
    let score = 0;

    that.reset = function () {
        startCountdownTime = 0;
        timeSoFar = 0;
        gameOver = false;
        countDown = 3;
        gameRunning = false;
        scoreRecorded = false;
    }

    that.update = function (timeElapsed) {
        let canGo = false;
        if (countDown > 0) {
            timeSoFar += timeElapsed;
            if (1000 < timeSoFar) {
                countDown--;
                timeSoFar = 0;
            }
            if (countDown === 0) {
                canGo = true;
                gameRunning = true;
                timeSoFar = 0;
            }
        }

        if ((gameOver) && !scoreRecorded) {
            scoreRecorded = true;

            let previousScores = localStorage.getItem('MyGame.highScores');
            let highScores = {};
            if (previousScores !== null) {
                highScores = JSON.parse(previousScores);
            }

            let scoresArray = [];
            for (let key in highScores) {
                scoresArray.push(highScores[key]);
            }
            scoresArray.push(score);

            scoresArray.sort(function (a, b) { return b - a; })
            let newScores = {};
            let scoreLength = Math.min(5, scoresArray.length);
            for (let i = 0; i < scoreLength; i++) {
                newScores[i] = scoresArray[i];
            }
            localStorage['MyGame.highScores'] = JSON.stringify(newScores);
        }
        return gameRunning;
    }

    that.render = function () {
        //score
        context.font = "16px Arial";
        context.fillStyle = "#CCCCCC";
        context.fillText("Score: " + score, canvas.width - 90, canvas.height - 5);

        if (countDown > 0 && !gameOver) {
            context.font = "72px Arial";
            context.fillStyle = "#CCCCCC";
            context.fillText(countDown, 475, 400);
        }

        if (gameOver) {
            context.font = "72px Arial";
            context.fillStyle = "white";
            context.fillText("Game Over", 300, 400);
        }
    };


    return that;
}(Game.graphics));