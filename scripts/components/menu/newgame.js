Menu.screens['new-game'] = (function (menu, input) {

    function initialize() { 
        Game.game.initialize(menu, input); 
     }

    function run() {
        Game.game.run();
    }

    return {
        initialize: initialize,
        run: run
    };

}(Master.menu, Master.input));