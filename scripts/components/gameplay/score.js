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
        money,
        curRound,
        waitToStart,
        xhttp,
        localScores;

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
        curRound = 1;
        waitToStart = true;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            console.log(JSON.parse(this.responseText));
            // localScores = this.responseText;
            // console.log(localScores.scores);
          };
        xhttp.open("GET", "https://api.jsonbin.io/b/5adeaf3e0917ce62fac6b2c6", true);
        xhttp.send();

    }

    that.reset = function () {
        startCountdownTime = 0;
        timeSoFar = 0;
        gameOver = false;
        countDown = 0;
        gameRunning = false;
        scoreRecorded = false;
        curRound = 1;
        waitToStart = true;
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

    that.roundFinished = function () {
        curRound++;
        gameRunning = false;
        
        if (curRound > 3) {
            gameOver = true;
        } else {
            waitToStart = true;
        }
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



        if (remainingLives < 1) {
            gameOver = true;
            gameRunning = false;
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

        document.getElementById('id-start-level').disabled = gameRunning || gameOver;


        return gameRunning;
    }

    document.getElementById('id-start-level').addEventListener('click',
        function () {
            waitToStart = false;
            countDown = 3;
        });

    that.startNextRound = function() { waitToStart = false; countDown = 3; }

    that.render = function () {
        graphics.drawText(
            { x: 350, y: 780 },
            'Lives: ' + remainingLives,
            'black',
            '24px Arial'
        );
        graphics.drawText(
            { x: 550, y: 780 },
            'Score: ' + score,
            'black',
            '24px Arial'
        );
        graphics.drawText(
            { x: 750, y: 780 },
            'Money: $' + money,
            'black',
            '24px Arial'
        );

        if (countDown > 0 && !gameOver)
            graphics.drawText(
                { x: 620, y: 400 },
                countDown,
                'white',
                '72px Arial'
            );

        if (gameOver)
            graphics.drawText(
                { x: 500, y: 400 },
                'Game Over',
                'red',
                '72px Arial'
            );

        if (waitToStart)
            graphics.drawText(
                { x: 525, y: 400 },
                'Ready?',
                'black',
                '72px Arial'
            );
    };

    return that;
}(Game.graphics));