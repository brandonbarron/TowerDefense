Game.game = ( function (menu, input) {
    
    //game components
    let that = {}, playingGame,
        lastTimeStamp = performance.now();


    //variables
    let _graphics = Game.graphics,
        _keyboard = input.Keyboard();
    
    function update(elapsedTime) { 
        _keyboard.update(elapsedTime);
    }

    function render() { 
        _graphics.clear();
        _graphics.drawBackground();

        // graphics.drawText(
        //     { x: 240, y: 639 },
        //     'Score: ' + this.curScore,
        //     'black',
        //     '12px Arial'
        // );
    }
    
    function gameLoop (curTime) {
        if (!playingGame) {
            _graphics.clear();
            return;
        }
        update(curTime - lastTimeStamp, curTime);
        lastTimeStamp = curTime;
        render();
        requestAnimationFrame(gameLoop);
    }
    
    that.initialize = function() {
        playingGame = true;
        registerKeyCommands();
        _graphics.initialize();
    }

    that.run = function() { requestAnimationFrame(gameLoop); }
    
    return that;

    function registerKeyCommands() {
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
            // cancelNextRequest = true;
            menu.showScreen('main-menu');
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function () {
            // _paddle.move('right');
        });

        _keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function () {
            // _paddle.move('left');
        });
    }


}(Master.menu, Master.input)); 