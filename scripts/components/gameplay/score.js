Game.score = (function (graphics) {
    let that = {}, curScore, remainingLives,
        canvas, context;

    that.initialize = function () {
        // canvas = document.getElementById('canvas-main');
        // context = canvas.getContext('2d');

        // Object.defineProperty(this, 'curScore', {
        //     value: 0,
        //     writable: true
        // });

        // Object.defineProperty(this, 'remainingLives', {
        //     value: 3,
        //     writable: true
        // });
        // this.remainingLives = 3;
    }

    that.draw = function () {

        // for (let i = 0; i < this.remainingLives; i++)
        //     graphics.drawRectangle({ x: i * 30, y: 635 }, { width: 25, height: 8 }, 'red');

        // graphics.drawText(
        //     { x: 240, y: 639 },
        //     'Score: ' + this.curScore,
        //     'white',
        //     '12px Arial'
        //     );
    }


    return that;
    // return {
    //     initialize: initialize,
    //     draw: draw
    // };
}(Game.graphics));