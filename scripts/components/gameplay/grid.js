Game.grid = (function (graphics){
    let that = {}, spots, spotSize, cols, rows, renderGridLines;
    let canvas, context;

    that.initialize = function () {
        canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');
        renderGridLines = false;
        spots = [];
        spotSize = 40;
        cols = 30;
        rows = 17;
        generateGrid();
    }

    function drawRectangleBorder(position, size, color) {
        context.save();
        context.beginPath();
        context.rect(position.x, position.y, size.width, size.height);
        context.lineWdith = .75;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawLines() {
        for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
            let x = spots[i].col[j].x;
            let y = spots[i].col[j].y;
            drawRectangleBorder({x: x, y: y}, {width: spotSize, height: spotSize}, 'lightgrey')
        }
    }

    that.render = function() {
        if (renderGridLines) drawLines();
    }

    function generateGrid() {
        for (let i = 0; i < rows; i++) {
            spots[i] = { col: [] };
            for (let j = 0; j < cols; j++) {
                spots[i].col[j] = { turret: false, x: (j * spotSize) + 40, y: (i * spotSize) + 20};
            }
        }
    }

    that.findAndSetTurretLoc = function(x, y) {
        if(y > 685) {
			return null; //short curcuit!!!!!!!!!!!!!
		}
        x -= 40;
        y -= 20;
        let j = Math.floor(x / spotSize);
        let i = Math.floor(y / spotSize) + 1;
        console.log(i, j, spots);
        spots[i].col[j].turret = true;
        let loc = {
            x: spots[i].col[j].x + (spotSize/2),
            y: spots[i].col[j].y + (spotSize/2),
        };
        return loc;
    }
    
    that.invertRenderLines = function() {renderGridLines = !renderGridLines; }

    return that;

}(Game.graphics));