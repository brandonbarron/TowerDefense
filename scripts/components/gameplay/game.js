// let Game = {

// }

Master.game = ( function (menu, input) {
    
    let that = {};
    
    that.initialize = function() {
        console.log('game initialized');
    }

    that.run = function() {
        console.log('game running');
    }

    return that;
}(Master.menu, Master.input)); 