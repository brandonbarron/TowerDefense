MyMenu.screens['new-game'] = (function (menu, input) {

    function initialize() { 
        Master.game.initialize(menu, input); 
     }

    function run() {
        Master.game.run();
    }

    return {
        initialize: initialize,
        run: run
    };

}(Master.menu, Master.input));