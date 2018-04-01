Master.game = ( function (menu, input) {
    
    let that = {},
        _graphics = Game.graphics;
    
    function update() { }

    function render() { 
        _graphics.clear();
        // graphics.drawText(
        //     { x: 240, y: 639 },
        //     'Score: ' + this.curScore,
        //     'black',
        //     '12px Arial'
        // );
        _graphics.drawBackground();
    }
    
    function gameLoop (curTime) {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
    
    that.initialize = function() {
        _graphics.initialize();
    }

    that.run = function() { requestAnimationFrame(gameLoop); }
    
    return that;
}(Master.menu, Master.input)); 