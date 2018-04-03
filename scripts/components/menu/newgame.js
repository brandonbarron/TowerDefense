Menu.screens['new-game'] = (function (menu, input) {

    let _game = Game.game;

    function initialize() { 
        _game.initialize(input);
     }

    function run() {
        _game.initialize(input);//we need to call this again if the user quits then returns later
        _game.run();
    }

    return {
        initialize: initialize,
        run: run
    };

}(Menu.menu, Master.input));