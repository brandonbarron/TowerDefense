Menu.screens['new-game'] = (function (menu, input) {

    let that = {}, _game;

    that.initialize = function() { 
        _game = Game.game;
        _game.initialize(input);
     }

    that.run = function() {
        _game.initialize(input);
        _game.run();
    }

    return that;

}(Menu.menu, Master.input));