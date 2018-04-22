Menu.screens['new-game'] = (function (menu, input) {

    let _game;

    function initialize() { 
        _game = Game.game;
        _game.initialize(input);
     }

    function run() {
        _game.initialize(input);
        _game.run();
    }

    return {
        initialize: initialize,
        run: run
    };

}(Menu.menu, Master.input));