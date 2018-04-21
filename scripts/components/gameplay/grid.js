Game.grid = (function (graphics){
    let that = {}, spots, spotSize, cols, rows;

    that.initialize = function () {
        spots = [];
        spotSize = 40;
        cols = 30;
        rows = 17;

        generateGrid();
    }

    that.renderGrid = function() {
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++) {
                let x = spots[i].col[j].x;
                let y = spots[i].col[j].y;
                graphics.drawRectangleBorder({x: x, y: y}, {width: spotSize, height: spotSize}, 'lightgrey')
            }
    }

    return that;

    function generateGrid() {
        for (let i = 0; i < rows; i++) {
            spots[i] = { col: [] };
            for (let j = 0; j < cols; j++) {
                spots[i].col[j] = { turret: false, x: (j * spotSize) + 40, y: (i * spotSize) + 20};
            }
        }
    }


}(Game.graphics));