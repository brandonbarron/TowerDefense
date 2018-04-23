Game.game = (function (input) {

    //variables
    let that = {},
        playingGame,
        image,
        lastTimeStamp = performance.now(),
        chooseTurretType,
        aTurretChanged,
        isNewTurretMode,
        _upgradeKey, _sellKey, _nextKey, _gridKey, _distanceKey;
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
        let roundFinished = _spriteManager.update(elapsedTime, gameRunning, _grid, _score);
        if(roundFinished) {
            _score.roundFinished();
        }
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
        _menu.render( _upgradeKey, _sellKey, _nextKey, _gridKey, _distanceKey);
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
        _keyboard.registerCommand(KeyEvent.DOM_VK_1, function () { turret1(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_2, function () { turret2(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_3, function () { turret3(); });
        _keyboard.registerCommand(KeyEvent.DOM_VK_4, function () { turret4(); });
        _upgradeKey = localStorage.getItem('TD.upgradeKey');
        _sellKey = localStorage.getItem('TD.sellKey');
        _nextKey = localStorage.getItem('TD.nextKey');
        _gridKey = localStorage.getItem('TD.gridKey');
        _distanceKey = localStorage.getItem('TD.distanceKey');

        registerKeyboardStuff(_gridKey, _grid.invertRenderLines);
        registerKeyboardStuff(_distanceKey, _turretManager.toggleShowFireDistance);
        registerKeyboardStuff(_upgradeKey, _turretManager.upgradeTurret, _score);
        registerKeyboardStuff(_sellKey, _turretManager.sellSelectedTurret, _score);
        registerKeyboardStuff(_nextKey, _score.startNextRound);

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
                    _turretManager.placeNewTurret(row, col, _score);
                    isNewTurretMode = false;
                    aTurretChanged = true;
                }
            } else {
                let oneSelected = _turretManager.selectTurret(x, y);
                let canUpgrade = false;
                if (oneSelected) {
                    canUpgrade = _turretManager.canUpgrade();
                    let upgradeCost = _turretManager.getSelectedUpgradeCost();

                    canUpgrade = _score.getMoney() >= upgradeCost;

                    document.getElementById('id-tower-level').innerHTML = 'Level: ' + _turretManager.getSelectedLevel();
                    document.getElementById('id-tower-upgrade-cost').innerHTML = 'Upgrade cost: ' + upgradeCost;
                    document.getElementById('id-tower-sell-amount').innerHTML = 'Sell price: ' + _turretManager.getSelectedSellPrice();
                } else {
                    document.getElementById('id-tower-level').innerHTML = '';
                    document.getElementById('id-tower-upgrade-cost').innerHTML = '';
                    document.getElementById('id-tower-sell-amount').innerHTML = '';
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

        document.getElementById('id-new-turret-type1').addEventListener('click',
            function () {
                turret1();
            });

        document.getElementById('id-new-turret-type2').addEventListener('click',
            function () {
                turret2();
            });

        document.getElementById('id-new-turret-type3').addEventListener('click',
            function () {
                turret3();
            });

        document.getElementById('id-new-turret-type4').addEventListener('click',
            function () {
                turret4();
            });

        //make sure the button and 'u' are the same
        document.getElementById('id-upgrade-turret').addEventListener(
            'click',
            function () { _turretManager.upgradeTurret(_score); }
        );

        //make sure the button and 'u' are the same
        document.getElementById('id-sell-turret').addEventListener(
            'click',
            function () {
                _turretManager.sellSelectedTurret(_score);
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

    function registerKeyboardStuff(key, passedFunction, parameter) {
        switch(key) {
            case 'a': _keyboard.registerCommand(KeyEvent.DOM_VK_A, function () { passedFunction(parameter); }); break;
            case 'b': _keyboard.registerCommand(KeyEvent.DOM_VK_B, function () { passedFunction(parameter); }); break;
            case 'c': _keyboard.registerCommand(KeyEvent.DOM_VK_C, function () { passedFunction(parameter); }); break;
            case 'd': _keyboard.registerCommand(KeyEvent.DOM_VK_D, function () { passedFunction(parameter); }); break;
            case 'e': _keyboard.registerCommand(KeyEvent.DOM_VK_E, function () { passedFunction(parameter); }); break;
            case 'f': _keyboard.registerCommand(KeyEvent.DOM_VK_F, function () { passedFunction(parameter); }); break;
            case 'g': _keyboard.registerCommand(KeyEvent.DOM_VK_G, function () { passedFunction(parameter); }); break;
            case 'h': _keyboard.registerCommand(KeyEvent.DOM_VK_H, function () { passedFunction(parameter); }); break;
            case 'i': _keyboard.registerCommand(KeyEvent.DOM_VK_I, function () { passedFunction(parameter); }); break;
            case 'j': _keyboard.registerCommand(KeyEvent.DOM_VK_J, function () { passedFunction(parameter); }); break;
            case 'k': _keyboard.registerCommand(KeyEvent.DOM_VK_K, function () { passedFunction(parameter); }); break;
            case 'l': _keyboard.registerCommand(KeyEvent.DOM_VK_L, function () { passedFunction(parameter); }); break;
            case 'm': _keyboard.registerCommand(KeyEvent.DOM_VK_M, function () { passedFunction(parameter); }); break;
            case 'n': _keyboard.registerCommand(KeyEvent.DOM_VK_N, function () { passedFunction(parameter); }); break;
            case 'o': _keyboard.registerCommand(KeyEvent.DOM_VK_O, function () { passedFunction(parameter); }); break;
            case 'p': _keyboard.registerCommand(KeyEvent.DOM_VK_P, function () { passedFunction(parameter); }); break;
            case 'q': _keyboard.registerCommand(KeyEvent.DOM_VK_Q, function () { passedFunction(parameter); }); break;
            case 'r': _keyboard.registerCommand(KeyEvent.DOM_VK_R, function () { passedFunction(parameter); }); break;
            case 's': _keyboard.registerCommand(KeyEvent.DOM_VK_S, function () { passedFunction(parameter); }); break;
            case 't': _keyboard.registerCommand(KeyEvent.DOM_VK_T, function () { passedFunction(parameter); }); break;
            case 'u': _keyboard.registerCommand(KeyEvent.DOM_VK_U, function () { passedFunction(parameter); }); break;
            case 'v': _keyboard.registerCommand(KeyEvent.DOM_VK_V, function () { passedFunction(parameter); }); break;
            case 'w': _keyboard.registerCommand(KeyEvent.DOM_VK_W, function () { passedFunction(parameter); }); break;
            case 'x': _keyboard.registerCommand(KeyEvent.DOM_VK_X, function () { passedFunction(parameter); }); break;
            case 'y': _keyboard.registerCommand(KeyEvent.DOM_VK_Y, function () { passedFunction(parameter); }); break;
            case 'z': _keyboard.registerCommand(KeyEvent.DOM_VK_Z, function () { passedFunction(parameter); }); break;
        }
        // _keyboard.registerCommand(KeyEvent.DOM_VK_C, function () { _turretManager.toggleShowFireDistance(); });
        // _keyboard.registerCommand(KeyEvent.DOM_VK_U, function () { _turretManager.upgradeTurret(_score); });
        // _keyboard.registerCommand(KeyEvent.DOM_VK_S, function () { _turretManager.sellSelectedTurret(_score); });
    }

    return that;

}(Master.input)); 