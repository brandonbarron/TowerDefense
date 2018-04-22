Game.grid = (function (graphics) {
    let that = {}, spots, spotSize, cols, rows, renderGridLines;
    let canvas, context;


    /*
        path 0 == turret / wall / blocked
        path 1 == not part of path
        path 2 == left to right
        path 3 == top to bottom
        path 4 == right to left
        path 5 == bottom to top
    */


    that.initialize = function () {
        canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');
        renderGridLines = false;
        spots = [];
        spotSize = 40;
        cols = 30;
        rows = 17;
        generateGrid();
        // for (let i = 2; i < 6; i++) findPath(i);
    }

    that.render = function () {
        if (renderGridLines) drawLines();
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
                if (spots[i].col[j].path[2].value) graphics.drawRectangle({ x: x, y: y }, { width: spotSize, height: spotSize }, 'black');
                if (spots[i].col[j].path[3].value) graphics.drawRectangle({ x: x, y: y }, { width: spotSize, height: spotSize }, 'black');
                if (spots[i].col[j].path[4].value) graphics.drawRectangle({ x: x, y: y }, { width: spotSize, height: spotSize }, 'black');
                if (spots[i].col[j].path[5].value) graphics.drawRectangle({ x: x, y: y }, { width: spotSize, height: spotSize }, 'black');
                drawRectangleBorder({ x: x, y: y }, { width: spotSize, height: spotSize }, 'lightgrey');
            }
    }

    function generateGrid() {
        for (let i = 0; i < rows; i++) {
            spots[i] = { col: [] };
            for (let j = 0; j < cols; j++) {
                spots[i].col[j] = {
                    path: [{ value: false, next: null }, // turret / wall / blocked
                    { value: true, next: null, visited: false }, // not part of path
                    { value: false, next: null, visited: false }, // left to right
                    { value: false, next: null, visited: false }, // top to bottom
                    { value: false, next: null, visited: false }, // right to left
                    { value: false, next: null, visited: false }, // bottom to top
                    ],
                    x: (j * spotSize) + 40,
                    y: (i * spotSize) + 20
                };
                if (i == 8 && j == 1) spots[i].col[j].path[0].value = true;
            }
        }
    }

    that.update = function () {
        for (let i = 2; i < 6; i++) findPath(i);
    }

    function findPath(direction) {
        let answer = [], r, c;

        switch (direction) {
            case 2:
                pathing(7, 0, direction, 8, 29);
                break;
            case 3:
                pathing(0, 13, direction, 16, 14);
                break;
            case 4:
                pathing(9, 29, direction, 8, 0);
                break;
            case 5:
                pathing(16, 16, direction, 0, 15);
                break;
        }
    }

    function nextMoveValid(row, col, selectPath) {
        if (spots[row].col[col].path[0].value) return false;
        if (spots[row].col[col].path[selectPath].visited) return false;
        return true;
    }

    function copyArray(path) {
        let temp = [];
        path.forEach(i => {
            let y = i.row,
                x = i.col,
                n = i.nDir;
            temp.push({ row: y, col: x, nDir: n });
        });
        return temp;
    }

    function pathing(rStart, cStart, direction, rEnd, cEnd) {
        let queue = [], temp = [];
        queue.push([{ row: rStart, col: cStart, nDir: null }]);

        while (queue.length !== 0) {
            let head = queue.shift(),
                curRow = head[head.length - 1].row,
                curCol = head[head.length - 1].col,
                nextRow = curRow + 1,
                nextCol = curCol + 1,
                prevRow = curRow - 1,
                prevCol = curCol - 1;

            if (curRow === rEnd && curCol === cEnd)
                head.forEach(i => {
                    spots[i.row].col[i.col].path[direction].next = i.nDir;
                    spots[i.row].col[i.col].path[direction].value = true;
                });
            if (nextCol < cols && nextMoveValid(curRow, nextCol, direction)) {
                head[head.length - 1].nDir = 'right';
                temp = copyArray(head);
                spots[curRow].col[nextCol].path[direction].visited = true;
                temp.push({ row: curRow, col: nextCol, nDir: null });
                queue.push(temp);
            }
            if (prevCol >= 0 && nextMoveValid(curRow, prevCol, direction)) {
                head[head.length - 1].nDir = 'left';
                temp = copyArray(head);
                spots[curRow].col[prevCol].path[direction].visited = true;
                temp.push({ row: curRow, col: prevCol, nDir: null });
                queue.push(temp);
            }
            if (nextRow < rows && nextMoveValid(nextRow, curCol, direction)) {
                head[head.length - 1].nDir = 'down';
                temp = copyArray(head);
                spots[nextRow].col[curCol].path[direction].visited = true;
                temp.push({ row: nextRow, col: curCol, nDir: null });
                queue.push(temp);
            }
            if (prevRow >= 0 && nextMoveValid(prevRow, curCol, direction)) {
                head[head.length - 1].nDir = 'up';
                temp = copyArray(head);
                spots[prevRow].col[curCol].path[direction].visited = true;
                temp.push({ row: prevRow, col: curCol, nDir: null });
                queue.push(temp);
            }
        }
    }

    function pathDown(r, c, path) {
        let queue = [], temp = [];
        queue.push([{ row: r, col: c, nDir: null }]);

        while (queue.length !== 0) {
            let head = queue.shift(),
                curRow = head[head.length - 1].row,
                curCol = head[head.length - 1].col,
                nextRow = curRow + 1,
                nextCol = curCol + 1,
                prevRow = curRow - 1,
                prevCol = curCol - 1;

            if (curRow === 8 && curCol === 29)
                return head;
            if (nextRow < rows && nextMoveValid(nextRow, curCol, direction)) {
                head[head.length - 1].nDir = 'down';
                temp = copyArray(head);
                spots[nextRow].col[curCol].path[direction].visited = true;
                temp.push({ row: nextRow, col: curCol, nDir: null });
                queue.push(temp);
            }
            if (nextCol < cols && nextMoveValid(curRow, nextCol, direction)) {
                head[head.length - 1].nDir = 'right';
                temp = copyArray(head);
                spots[curRow].col[nextCol].path[direction].visited = true;
                temp.push({ row: curRow, col: nextCol, nDir: null });
                queue.push(temp);
            }
            if (prevRow >= 0 && nextMoveValid(prevRow, curCol, direction)) {
                head[head.length - 1].nDir = 'up';
                temp = copyArray(head);
                spots[prevRow].col[curCol].path[direction].visited = true;
                temp.push({ row: prevRow, col: curCol, nDir: null });
                queue.push(temp);
            }
            if (prevCol >= 0 && nextMoveValid(curRow, prevCol, direction)) {
                head[head.length - 1].nDir = 'left';
                temp = copyArray(head);
                spots[curRow].col[prevCol].path[direction].visited = true;
                temp.push({ row: curRow, col: curCol, nDir: null });
                queue.push(temp);
            }
        }
    }

    function updateGrid(dir, answer) {
        if (answer === undefined) return;
        answer.forEach(i => {
            if (i.nDir !== null) spots[i.row].col[i.col].path[dir].next = i.nDir;
            spots[i.row].col[i.col].path[dir].value = true;
        });
    }

    function resetGrid() {
        for (let i = 0; i < rows; i++) 
            for (let j = 0; j < cols; j++) {
                spots[i].col[j].path[2].visited = false;
                spots[i].col[j].path[3].visited = false;
                spots[i].col[j].path[4].visited = false;
                spots[i].col[j].path[5].visited = false;
                spots[i].col[j].path[2].value = false;
                spots[i].col[j].path[3].value = false;
                spots[i].col[j].path[4].value = false;
                spots[i].col[j].path[5].value = false;
            }
    }

    that.invertRenderLines = function () { renderGridLines = !renderGridLines; }
    that.findAndSetTurretLoc = function(x, y) {
        if(y > 685) {
			return null; //short curcuit!!!!!!!!!!!!!
		}
        //x -= 40;
        //y -= 20;
        let row = Math.floor((y - 20) / spotSize) + 1;
        let col = Math.floor((x - 40) / spotSize);
        //spots[i].col[j].turret = true;
        let loc = {
            x: spots[row].col[col].x + (spotSize/2),
            y: spots[row].col[col].y + (spotSize/2),
        };
        return loc;
    }

    that.turretPlaced = function(row, col) {
        row = Math.floor((row - 20) / spotSize);
        col = Math.floor((col - 40) / spotSize);
        spots[row].col[col].path[0].value = true;
        spots[row].col[col].path[1].value = false;
        spots[row].col[col].path[2].value = false;
        spots[row].col[col].path[3].value = false;
        spots[row].col[col].path[4].value = false;
        spots[row].col[col].path[5].value = false;
        resetGrid();
    }
    
    that.invertRenderLines = function() {renderGridLines = !renderGridLines; }

    return that;

}(Game.graphics));