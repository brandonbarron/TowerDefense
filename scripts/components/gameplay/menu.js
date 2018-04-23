Game.menu = (function (graphics, grid){
    let that = {};

    let gridButton, gamePadding;

    that.initialize = function() {
        document.getElementById('id-toggle-grid').addEventListener(
			'click',
			function() { grid.invertRenderLines(); });

    }

    that.render = function(_upgradeKey, _sellKey, _nextKey, _gridKey, _distanceKey) {
        graphics.drawText(
            { x: 900, y: 750 },
            _upgradeKey + '    - Upgrade Key',
            '#CCCCCC',
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 900, y: 780 },
            _sellKey + '    - Sell Key',
            '#CCCCCC',
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 900, y: 810 },
            _nextKey + '    - Next Level',
            '#CCCCCC',
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 900, y: 840 },
             _gridKey + '    - Toggle Grid',
            '#CCCCCC',
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 900, y: 870 },
            _distanceKey + '    - Toggle Weapon Coverage',
            '#CCCCCC',
            '16px Arial'
        );    
        graphics.drawText(
            { x: 900, y: 900 },
            'esc - Menu',
            '#CCCCCC',
            '16px Arial'
        ); 
    }
    return that;
}(Game.graphics, Game.grid));