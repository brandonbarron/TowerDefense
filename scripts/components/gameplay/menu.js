Game.menu = (function (graphics){
    let that = {}, 
        gridButton,
        gamePadding,
        textColor,
        lineColor,
        background;

    that.initialize = function() {
        textColor = 'black';
        lineColor = 'red';
        background = new Image();
        background.onload = function () { ready = true; };
        background.src = 'assets/bottom_menu.png';
    }

    that.render = function(_upgradeKey, _sellKey, _nextKey, _gridKey, _distanceKey) {
        graphics.drawImage({ image: background, x: 0, y: 720, w: 1280, h: 200 });//where'd it go?
        graphics.drawRectangle({x: 25, y: 825 }, { width: 975, height: 1 }, lineColor);
        graphics.drawRectangle({x: 1020, y: 730 }, { width: 1, height: 180 }, lineColor);
        graphics.drawRectangle({ x: 300, y: 730 }, { width: 1, height: 80 }, lineColor);
        graphics.drawRectangle({ x: 500, y: 730 }, { width: 1, height: 80 }, lineColor);
        graphics.drawRectangle({ x: 700, y: 730 }, { width: 1, height: 80 }, lineColor);
        graphics.drawText(
            { x: 1050, y: 750 },
            _upgradeKey + '    - Upgrade Key',
            textColor,
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 1050, y: 780 },
            _sellKey + '    - Sell Key',
            textColor,
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 1050, y: 810 },
            _nextKey + '    - Next Level',
            textColor,
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 1050, y: 840 },
             _gridKey + '    - Toggle Grid',
            textColor,
            '16px Arial'
        ); 
        graphics.drawText(
            { x: 1050, y: 870 },
            _distanceKey + '    - Toggle Weapon Coverage',
            textColor,
            '16px Arial'
        );    
        graphics.drawText(
            { x: 1050, y: 900 },
            'esc - Menu',
            textColor,
            '16px Arial'
        );
        graphics.drawText(
            { x: 75, y: 750 },
            'Selected Turret',
            textColor,
            '24px Arial'
        );
        
    }

    that.renderTurretInfo = function(level, cost, sell) {
        graphics.drawText(
            { x: 50, y: 790 },
            'Level: ' + level,
            textColor,
            '16px Arial'
        );
        graphics.drawText(
            { x: 150, y: 780 },
            'Upgrade Cost: $' + cost,
            textColor,
            '16px Arial'
        );
        graphics.drawText(
            { x: 150, y: 810 },
            'Sell Price: $' + sell,
            textColor,
            '16px Arial'
        );
    } 
    return that;
}(Game.graphics));