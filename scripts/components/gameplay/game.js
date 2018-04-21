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
        _missileManager = Game.missileManager,
        _score = Game.score,
        _keyboard,
        _mouse;
    
    function update(elapsedTime) { 
        let gameRunning = _score.update(elapsedTime);
        _keyboard.update(elapsedTime);
        _mouse.update(elapsedTime);
        _spriteManager.update(elapsedTime, gameRunning);
        _turretManager.update(elapsedTime, gameRunning, _spriteManager.getAllSprites());
        _missileManager.update(elapsedTime, gameRunning);
    }

    function render() { 
        _graphics.clear();
        _graphics.drawImage({image: image, x: 0, y: 0, w: 1280, h: 720});
        _spriteManager.render();
        _turretManager.render();
        _missileManager.render();
        _score.render();
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
        _mouse = Master.input.Mouse();
        
        //_graphics.initialize();
        _spriteManager = Game.spriteManager;//TODO: why is it always undefined unless I assign it here?
        _spriteManager.addTestSprite();

        _turretManager = Game.turretManager;
        _turretManager.addTestTurret();

        _missileManager = Game.missileManager;

        _score = Game.score
        registerKeyCommands();
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
        _mouse.registerCommand('mouseup', function (event) {
            let x = event.clientX;
            let y = event.clientY;
            
            _turretManager.selectTurret(x, y);
        });
    }

    function reset() {
        _graphics.clear();
        _spriteManager.reset();
        _turretManager.reset();
        _score.reset();
        playingGame = true;
    }

}(Master.input)); 