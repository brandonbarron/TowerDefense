Game.game = (function (input) {

    //variables
    let that = {},
        playingGame,
        image,
        lastTimeStamp = performance.now();


    //game components
    let _graphics = Game.graphics,
        _spriteManager = Game.spriteManager,
        _turretManager = Game.turretManager,
        _missileManager = Game.missileManager,
        _score = Game.score,
        _grid = Game.grid,
        _menu = Game.menu,
        _keyboard,
        _mouse;

    let isNewTurretMode = false;

    function update(elapsedTime) {
        let gameRunning = _score.update(elapsedTime);
        _keyboard.update(elapsedTime);
        _mouse.update(elapsedTime);
        if (addedNewTurret) {
            _grid.update();
            addedNewTurret = false;
        }
        _spriteManager.update(elapsedTime, gameRunning);
        _turretManager.update(elapsedTime, gameRunning, _spriteManager.getAllSprites());
        _missileManager.update(elapsedTime, gameRunning);
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

    that.initialize = function () {
        playingGame = true;
        showGrid = false;
        _keyboard = Master.input.Keyboard();
        _mouse = Master.input.Mouse();

        _graphics.initialize();
        _spriteManager = Game.spriteManager;//TODO: why is it always undefined unless I assign it here?
        _spriteManager.addTestSprite();

        _turretManager = Game.turretManager;
        //_turretManager.addTestTurret();

        _missileManager = Game.missileManager;

        _grid.initialize();
        _menu.initialize();

        _score = Game.score
        registerKeyCommands();
        image = new Image();
        image.onload = function () { ready = true; };
        image.src = "assets/grassBackground.jpg";


    }

    let chooseTurretType = 0;
    let addedNewTurret = false;

    function registerKeyCommands() {
        _keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            playingGame = false;
            Menu.menu.showScreen('main-menu');
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_G, function () {
            _grid.invertRenderLines();
        });
        _keyboard.registerCommand(KeyEvent.DOM_VK_C, function () {
            _turretManager.toggleShowFireDistance();
        });

        document.getElementById('id-upgrade-turret').disabled = true;
        document.getElementById('id-sell-turret').disabled = true;

        _mouse.registerCommand('mouseup', function (event) {
            let x = event.clientX;
            let y = event.clientY;
            if (isNewTurretMode) {
                let turLoc = _grid.findAndSetTurretLoc(x, y);
                if (turLoc) {
                    _turretManager.placeNewTurret(turLoc.x, turLoc.y);
                    isNewTurretMode = false;
                    addedNewTurret = true;
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
            let x = event.clientX;
            let y = event.clientY;
            if (isNewTurretMode) {
                _turretManager.chooseTurretLoc(x, y);
            }
        });

        document.getElementById('id-new-turret-type1').addEventListener(
            'click',
            function () {
                chooseTurretType = 1;
                _turretManager.chooseTurretTypes(chooseTurretType)
                setTimeout(function () {
                    isNewTurretMode = true;
                }, 100);
            }
        );
        document.getElementById('id-new-turret-type2').addEventListener(
            'click',
            function () {
                chooseTurretType = 2;
                _turretManager.chooseTurretTypes(chooseTurretType)
                setTimeout(function () {
                    isNewTurretMode = true;
                }, 100);
            }
        );
        document.getElementById('id-new-turret-type3').addEventListener(
            'click',
            function () {
                chooseTurretType = 3;
                _turretManager.chooseTurretTypes(chooseTurretType)
                setTimeout(function () {
                    isNewTurretMode = true;
                }, 100);
            }
        );
        document.getElementById('id-new-turret-type4').addEventListener(
            'click',
            function () {
                chooseTurretType = 4;
                _turretManager.chooseTurretTypes(chooseTurretType)
                setTimeout(function () {
                    isNewTurretMode = true;
                }, 100);
            }
        );


        //make sure the button and 'u' are the same
        document.getElementById('id-upgrade-turret').addEventListener(
            'click',
            function () {
                _turretManager.upgradeTurret();
            }
        );
        _keyboard.registerCommand(KeyEvent.DOM_VK_U, function () {
            _turretManager.upgradeTurret();
        });

        //make sure the button and 'u' are the same
        document.getElementById('id-sell-turret').addEventListener(
            'click',
            function () {
                _turretManager.sellSelectedTurret();
            }
        );
        _keyboard.registerCommand(KeyEvent.DOM_VK_S, function () {
            _turretManager.sellSelectedTurret();
        });



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