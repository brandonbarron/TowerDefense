Game.game = ( function (menu, input) {
    
<<<<<<< HEAD
    let that = {},
        _graphics = Game.graphics,
        _keyboard = input.Keyboard(),
        playingGame,
        cancelNextRequest = false;
    let _menu = menu;//TODO: somehow the menu is undefined it is assigned to later in initialize
    
    function update() { 
        _keyboard.update();
=======
    //game components
    let that = {}, playingGame,
        lastTimeStamp = performance.now();


    //variables
    let _graphics = Game.graphics,
        _keyboard = input.Keyboard();
    
    function update(elapsedTime) { 
        _keyboard.update(elapsedTime);
>>>>>>> 0f7ac9d80c7473fba30bff9ad82f175153974542
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

        if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
    }
    
    that.initialize = function(menu1, input) {
        _menu = menu1;
        playingGame = true;
        _keyboard = input.Keyboard();
        cancelNextRequest = false;
        registerKeyCommands();
        _graphics.initialize();
    }

    that.run = function() { requestAnimationFrame(gameLoop); }
    

    function registerKeyCommands() {
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
            cancelNextRequest = true;
            _menu.showScreen('main-menu');
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function () {
            // _paddle.move('right');
        });

        _keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function () {
            // _paddle.move('left');
        });
    }

    return that;

}(Master.menu, Master.input)); 