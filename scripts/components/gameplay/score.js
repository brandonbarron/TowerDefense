Game.score = (function (graphics) {
    let that = {},
        curScore,
        remainingLives,
        gameOver,
        countDown,
        startCountdownTime,
        timeSoFar,
        scoreRecorded,
        gameRunning,
        score,
        money;

    that.initialize = function () {
        curScore = null;
        remainingLives = 5;
        gameOver = false;
        countDown = 0;
        startCountdownTime = 0;
        timeSoFar = 0;
        scoreRecorded = false;
        gameRunning = false;
        score = 0;
        money = 1000;
    }

    that.reset = function () {
        startCountdownTime = 0;
        timeSoFar = 0;
        gameOver = false;
        countDown = 0;
        gameRunning = false;
        scoreRecorded = false;
    }

    that.killedSprite = function () {
        money += 100;
        score++;
    }

    that.spriteEscaped = function () {
        remainingLives--;
    }

    that.purchaseIfAble = function (amount) {
        if (money => amount) {
            money -= amount;
            return true;
        }
        return false;
    }

    that.sellItem = function (amount) {
        money += amount;
    }

    that.getMoney = function () {
        return money;
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

        document.getElementById('id-new-turret-type1').disabled = money < 400;
        document.getElementById('id-new-turret-type2').disabled = money < 600;
        document.getElementById('id-new-turret-type3').disabled = money < 800;
        document.getElementById('id-new-turret-type4').disabled = money < 1000;

        document.getElementById('id-start-level').disabled = gameRunning;


        return gameRunning;
    }

    document.getElementById('id-start-level').addEventListener('click',
        function () {
            countDown = 3;
        });

    that.render = function () {
        graphics.drawText(
            { x: 1185, y: 915 },
            'Score: ' + score,
            '#CCCCCC',
            '16px Arial'
        );

        graphics.drawText(
            { x: 1185, y: 895 },
            'Money: ' + money,
            '#CCCCCC',
            '16px Arial'
        );

        graphics.drawText(
            { x: 1185, y: 875 },
            'Lives: ' + remainingLives,
            '#CCCCCC',
            '16px Arial'
        );

        if (countDown > 0 && !gameOver)
            graphics.drawText(
                { x: 575, y: 400 },
                countDown,
                '#CCCCCC',
                '72px Arial'
            );

        if (gameOver)
            graphics.drawText(
                { x: 300, y: 400 },
                'Game Over',
                'white',
                '72px Arial'
            );
    };

    return that;
}(Game.graphics));