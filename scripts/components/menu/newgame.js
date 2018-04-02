Menu.screens['new-game'] = (function (menu, input) {

    function initialize() { 
        Game.game.initialize(menu, input); 
     }

    function run() {
        Game.game.initialize(menu, input); //needs to be called when user crreates second game
        Game.game.run();
    }

    return {
        initialize: initialize,
        run: run
    };

}(Menu.menu, Master.input));