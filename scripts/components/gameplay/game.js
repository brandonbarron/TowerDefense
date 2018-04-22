Game.game = (function (input) {

    //variables
    let that = {},
        playingGame,
        image,
        lastTimeStamp = performance.now(),
        chooseTurretType,
        aTurretChanged,
        isNewTurretMode;
    //game components
    let _graphics,
        _spriteManager,
        _turretManager,
        _missileManager,
        _score,
        _grid,
        _menu,
        _keyboard,
        _mouse;

    that.initialize = function () {
        _graphics = Game.graphics;
        _spriteManager = Game.spriteManager;
        _turretManager = Game.turretManager;
        _missileManager = Game.missileManager;
        _score = Game.score;
        _grid = Game.grid;
        _menu = Game.menu;
        _keyboard = Master.input.Keyboard();
        _mouse = Master.input.Mouse();
        playingGame = true;
        showGrid = false;
        chooseTurretType = 0;
        aTurretChanged = false;
        isNewTurretMode = false;

        _graphics.initialize();
        _spriteManager.initialize();
        //_spriteManager.addTestSprite()
        _turretManager.initialize();
        _missileManager.initialize();
        _grid.initialize();
        _menu.initialize();
        _score.initialize();

        registerKeyCommands();

        image = new Image();
        image.onload = function () { ready = true; };
        image.src = "assets/grassBackground.jpg";
    }

    function update(elapsedTime) {
        let gameRunning = _score.update(elapsedTime);
        _keyboard.update(elapsedTime);
        _mouse.update(elapsedTime);
        if (aTurretChanged) {
            _grid.update();
            aTurretChanged = false;
        }
        _spriteManager.update(elapsedTime, gameRunning, _grid);
        _turretManager.update(elapsedTime, gameRunning, _spriteManager.getAllSprites());
        _missileManager.update(elapsedTime, gameRunning, _spriteManager.getAllSprites());
    }

    function render() {
        _graphics.clear();
        drawBackAndBorder();
        _grid.render();
        _spriteManager.render();
        _turretManager.render();
        _missileManager.render();
        _score.render();
    }

    function gameLoop(curTime) {
        if (!playingGame) {
            reset();
            return;
        }
        update(curTime - lastTimeStamp, curTime);
        lastTimeStamp = curTime;
        render();
        requestAnimationFrame(gameLoop);
    }

    function turret1() {
        chooseTurretType = 1;
        _turretManager.chooseTurretTypes(chooseTurretType)
        setTimeout(function () {
            isNewTurretMode = true;
        }, 100);
    }

    function turret2() {
        chooseTurretType = 2;
        _turretManager.chooseTurretTypes(chooseTurretType)
        setTimeout(function () {
            isNewTurretMode = true;
        }, 100);
    }

    function turret3() {
        chooseTurretType = 3;
        _turretManager.chooseTurretTypes(chooseTurretType)
        setTimeout(function () {
            isNewTurretMode = true;
        }, 100);
    }

    function turret4() {
        chooseTurretType = 4;
        _turretManager.chooseTurretTypes(chooseTurretType)
        setTimeout(function () {
            isNewTurretMode = true;
        }, 100);
    }

    function registerKeyCommands() {
        document.getElementById('id-upgrade-turret').disabled = true;
        document.getElementById('id-sell-turret').disabled = true;
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
            Menu.menu.showScreen('main-menu');
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_1, function(){ turret1(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_2, function(){ turret2(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_3, function(){ turret3(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_4, function(){ turret4(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_G, function(){ _grid.invertRenderLines(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_C, function(){ _turretManager.toggleShowFireDistance(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_U, function(){ _turretManager.upgradeTurret(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_S, function(){ _turretManager.sellSelectedTurret(); });

        _mouse.registerCommand('mouseup', function (event) {
            let x = event.clientX,
                y = event.clientY,
                col = Math.floor((x - 40) / 40),
                row = Math.floor((y - 20) / 40);
                
            
            if (isNewTurretMode) {
                let isInvalid = validLocation(row, col);
                _turretManager.setIsInvalidTurretLoc(isInvalid);
                if (isInvalid) return; //short curcuit

                let turLoc = _grid.findAndSetTurretLoc(row, col);
                if (turLoc) {
                    _turretManager.placeNewTurret(row, col);
                    isNewTurretMode = false;
                    aTurretChanged = true;
                }
            } else {
                let oneSelected = _turretManager.selectTurret(x, y);
                let canUpgrade = false;
                if (oneSelected) {
                    canUpgrade = _turretManager.canUpgrade();
                }
                document.getElementById('id-upgrade-turret').disabled = !canUpgrade;
                document.getElementById('id-sell-turret').disabled = !oneSelected;
            }
        });
        _mouse.registerCommand('mousemove', function (event) {
            if (isNewTurretMode) {
                let x = event.clientX,
                    y = event.clientY,
                    col = Math.floor((x - 40) / 40),
                    row = Math.floor((y - 20) / 40);
                _turretManager.setIsInvalidTurretLoc(validLocation(row, col));
                _turretManager.chooseTurretLoc(x, y);
            }
        });

        document.getElementById('id-new-turret-type1').addEventListener('click', turret1());
        
        document.getElementById('id-new-turret-type2').addEventListener('click', turret2());

        document.getElementById('id-new-turret-type3').addEventListener('click', turret3());

        document.getElementById('id-new-turret-type4').addEventListener('click', turret4());

        //make sure the button and 'u' are the same
        document.getElementById('id-upgrade-turret').addEventListener(
            'click',
            function () { _turretManager.upgradeTurret(); }
        );
       
        //make sure the button and 'u' are the same
        document.getElementById('id-sell-turret').addEventListener(
            'click',
            function () {
                _turretManager.sellSelectedTurret();
                aTurretChanged = true;
            }
        );
    }

    function validLocation(row, col) {
        return (
            (col < 0 || col > 29 || row < 0 || row > 16) ||
            (col === 0 && row > 6 && row < 10) ||
            (col === 29 && row > 6 && row < 10) ||
            (row === 0 && col > 12 && col < 17) ||
            (row === 16 && col > 12 && col < 17) ||
            _grid.isTurret(row, col) ||
            _grid.testForBlocking(row, col)
        );
    }

    that.run = function () { requestAnimationFrame(gameLoop); }

    function reset() {
        _graphics.clear();
        _spriteManager.reset();
        _turretManager.reset();
        _score.reset();
        playingGame = true;
    }

    function drawBackAndBorder() {
        _graphics.drawImage({ image: image, x: 0, y: 0, w: 1280, h: 720 });
        _graphics.drawRectangle({ x: 0, y: 0 }, { width: 560, height: 20 }, 'grey');
        _graphics.drawRectangle({ x: 720, y: 0 }, { width: 560, height: 20 }, 'grey');
        _graphics.drawRectangle({ x: 0, y: 0 }, { width: 40, height: 300 }, 'grey');
        _graphics.drawRectangle({ x: 0, y: 700 }, { width: 560, height: 20 }, 'grey');
        _graphics.drawRectangle({ x: 720, y: 700 }, { width: 560, height: 20 }, 'grey');
        _graphics.drawRectangle({ x: 0, y: 420 }, { width: 40, height: 300 }, 'grey');
        _graphics.drawRectangle({ x: 1240, y: 0 }, { width: 40, height: 300 }, 'grey');
        _graphics.drawRectangle({ x: 1240, y: 420 }, { width: 40, height: 300 }, 'grey');
    }

    return that;

}(Master.input)); 