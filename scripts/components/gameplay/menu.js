Game.menu = (function (graphics, grid){
    let that = {};

    let gridButton, gamePadding;

    that.initialize = function() {
        document.getElementById('id-toggle-grid').addEventListener(
			'click',
			function() { grid.invertRenderLines(); });

    }

    that.render = function() {

    }
    return that;
}(Game.graphics, Game.grid));