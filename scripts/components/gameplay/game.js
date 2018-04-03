Game.game = ( function (input) {
    
    //game components
    let that = {}, 
        playingGame, 
        image, 
        lastTimeStamp = performance.now();
    

    //variables
    let _graphics = Game.graphics,
        _spriteManager = Game.spriteManager,
        _turretManager = Game.turretManager,
        _keyboard;
    
    function update(elapsedTime) { 
        _keyboard.update(elapsedTime);
        _spriteManager.update(elapsedTime);
        _turretManager.update(elapsedTime);
    }

    function render() { 
        _graphics.Tools().clear();
        _graphics.Tools().drawImage({image: image, x: 0, y: 0, w: 1280, h: 720});
        _spriteManager.render();
        _turretManager.render();
        
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
        //_graphics.initialize();
        _spriteManager = Game.spriteManager;//TODO: why is it always undefined unless I assign it here?
        _spriteManager.addTestSprite();

        _turretManager = Game.turretManager;
        _turretManager.addTestTurret();
        
        image = new Image();
        image.onload = function () { ready = true; };
        image.src = "assets/grassBackground.jpg";
        
        
    }

    that.run = function() { requestAnimationFrame(gameLoop); }
    
    return that;

    function registerKeyCommands() {
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
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
        _graphics.Tools().clear();
        _spriteManager.reset();
        _turretManager.reset();
        playingGame = true;
    }

}(Master.input)); 