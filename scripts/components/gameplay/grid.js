Game.grid = (function (graphics){
    let that = {}, spots, spotSize, cols, rows, renderGridLines;

    that.initialize = function () {
        renderGridLines = false;
        spots = [];
        spotSize = 40;
        cols = 30;
        rows = 17;
        generateGrid();
    }

    that.render = function() {
        if (renderGridLines) drawLines();
    }

    function drawLines() {
        for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
            let x = spots[i].col[j].x;
            let y = spots[i].col[j].y;
            graphics.drawRectangleBorder({x: x, y: y}, {width: spotSize, height: spotSize}, 'lightgrey')
        }
    }
    
    function generateGrid() {
        for (let i = 0; i < rows; i++) {
            spots[i] = { col: [] };
            for (let j = 0; j < cols; j++) {
                spots[i].col[j] = { turret: false, x: (j * spotSize) + 40, y: (i * spotSize) + 20};
            }
        }
    }
    
    that.invertRenderLines = function() {renderGridLines = !renderGridLines; }

    return that;

}(Game.graphics));