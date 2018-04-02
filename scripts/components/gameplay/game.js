Game.game = ( function (input) {
    
    //game components
    let that = {}, playingGame, image,
        lastTimeStamp = performance.now();


    //variables
    let _graphics = Game.graphics,
        _keyboard;
    
    function update(elapsedTime) { 
        _keyboard.update(elapsedTime);
    }

    function render() { 
        _graphics.clear();
        _graphics.drawImage({image: image, x: 0, y: 0, w: 1280, h: 720});

    }
    
    function gameLoop (curTime) {
        if (!playingGame) {
            reset();
            return;
        }
        update(curTime - lastTimeStamp, curTime);
        lastTimeStamp = curTime;
        render();
        requestAnimationFrame(gameLoop);
    }
    
    that.initialize = function() {
        playingGame = true;
        _keyboard = Master.input.Keyboard();
        registerKeyCommands();
        _graphics.initialize();

        image = new Image();
        image.onload = function () { ready = true; };
        image.src = "assets/grassBackground.jpg";
    }

    that.run = function() { requestAnimationFrame(gameLoop); }
    
    return that;

    function registerKeyCommands() {
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
            // cancelNextRequest = true;
            Menu.menu.showScreen('main-menu');
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function () {
            // _paddle.move('right');
        });

        _keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function () {
            // _paddle.move('left');
        });
    }

    function reset() {
        _graphics.clear();
        playingGame = true;
    }

}(Master.input)); 