Game.score = (function (graphics) {
    let that = {},
        curScore,
        remainingLives,
        gameOver,
        countDown,
        startCountdownTime ,
        timeSoFar,
        scoreRecorded,
        gameRunning,
        score;

    that.initialize = function() {
        curScore = null;
        remainingLives;
        gameOver = false;
        countDown = 3;
        startCountdownTime = 0;
        timeSoFar = 0;
        scoreRecorded = false;
        gameRunning = false;
        score = 0;
    }

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
        graphics.drawText(
                {x: 1190, y: 915},
                'Score: ' + score,
                '#CCCCCC',
                '16px Arial'
            );

        if (countDown > 0 && !gameOver)
            graphics.drawText(
                {x: 475, y: 400},
                countDown,
                '#CCCCCC',
                '72px Arial'
            );

        if (gameOver)
            graphics.drawText(
                {x: 300, y: 400},
                'Game Over',
                'white',
                '72px Arial'
            );
    };
    
    return that;
}(Game.graphics));