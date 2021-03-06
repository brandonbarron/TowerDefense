Game.grid = (function (graphics) {
    let that = {},
        spots,
        spotSize,
        cols,
        rows,
        renderGridLines;

    /*
        path 0 == turret / wall / blocked
        path 1 == not part of path
        path 2 == left to right
        path 3 == top to bottom
        path 4 == right to left
        path 5 == bottom to top
    */
    that.initialize = function () {
        renderGridLines = false;
        spots = [];
        spotSize = 40;
        cols = 30;
        rows = 17;
        generateGrid();
        for (let i = 2; i < 6; i++) findPath(i);
    }

    that.render = function () { if (renderGridLines) drawLines(); }

    that.update = function () { for (let i = 2; i < 6; i++) findPath(i); }

    function drawLines() {
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++) {
                let x = spots[i].col[j].x;
                let y = spots[i].col[j].y;
                (i < 10 && i > 6 && j === 0) || (i < 10 && i > 6 && j === cols - 1) || (j > 12 && j < 17 && i === 0) || (j > 12 && j < 17 && i === rows - 1) ? {} :
                    graphics.drawRectangleBorder({ x: x, y: y }, { width: spotSize, height: spotSize }, 'lightgrey');
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
            }
        }
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

    that.findAndSetTurretLoc = function (row, col) {
        spots[row].col[col].path[0].value = true;
        return loc = {
            x: spots[row].col[col].x + (spotSize / 2),
            y: spots[row].col[col].y + (spotSize / 2),
        };
    }

    that.turretPlaced = function (row, col) {
        spots[row].col[col].path[0].value = true;
        spots[row].col[col].path[1].value = false;
        spots[row].col[col].path[2].value = false;
        spots[row].col[col].path[3].value = false;
        spots[row].col[col].path[4].value = false;
        spots[row].col[col].path[5].value = false;
        resetGrid();
    }

    that.turretRemoved = function (row, col) {
        spots[row].col[col].path[0].value = false;
        spots[row].col[col].path[1].value = true;
        spots[row].col[col].path[2].value = true;
        spots[row].col[col].path[3].value = true;
        spots[row].col[col].path[4].value = true;
        spots[row].col[col].path[5].value = true;
        resetGrid();
    }

    that.isTurret = function (row, col) { return spots[row].col[col].path[0].value; }

    function isPath(pathNum) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (spots[i].col[j].path[pathNum].value) {
                    return true;
                }
            }
        }
        return false;
    }

    that.testForBlocking = function (row, col) {
        that.turretPlaced(row, col);

        for (let i = 2; i < 6; i++) findPath(i);//manually do this, normally update function does it

        let allHasPath = true;

        for (let i = 2; i < 6; i++) {
            if (!isPath(i)) {
                allHasPath = false;
            }
        }

        that.turretRemoved(row, col);
        for (let i = 2; i < 6; i++) findPath(i);//manually do this, normally update function does it

        return !allHasPath;
    }

    that.getStartforPath = function (direction) {
        switch (direction) {
            case 2:
                //pathing(7, 0, direction, 8, 29);
                return { x: spots[7].col[0].x, y: spots[7].col[0].y };
                break;
            case 3:
                //pathing(0, 13, direction, 16, 14);
                return { x: spots[0].col[13].x, y: spots[0].col[13].y };
                break;
            case 4:
                //pathing(9, 29, direction, 8, 0);
                return { x: spots[9].col[29].x, y: spots[9].col[29].y };
                break;
            case 5:
                //pathing(16, 16, direction, 0, 15);
                return { x: spots[16].col[16].x, y: spots[16].col[16].y };
                break;
        }
        return null;
    }

    function getDistToEnd(direction, row, col) {
        switch (direction) {
            case 2:
                //pathing(7, 0, direction, 8, 29);
                return Math.sqrt(Math.pow(29 - col, 2) + Math.pow(8 - row, 2))
                break;
            case 3:
                //pathing(0, 13, direction, 16, 14);
                return Math.sqrt(Math.pow(14 - col, 2) + Math.pow(16 - row, 2))
                break;
            case 4:
                //pathing(9, 29, direction, 8, 0);
                return Math.sqrt(Math.pow(0 - col, 2) + Math.pow(8 - row, 2))
                break;
            case 5:
                //pathing(16, 16, direction, 0, 15);
                return Math.sqrt(Math.pow(15 - col, 2) + Math.pow(0 - row, 2))
                break;
        }
        return 1000000000;
    }

    function getEndingCoord(direction) {
        switch (direction) {
            case 2:
                //pathing(7, 0, direction, 8, 29);
                return { x: spots[8].col[29].x + (spotSize / 2), y: spots[8].col[29].y + (spotSize / 2) };
                break;
            case 3:
                //pathing(0, 13, direction, 16, 14);
                return { x: spots[16].col[14].x + (spotSize / 2), y: spots[16].col[14].y + (spotSize / 2) };
                break;
            case 4:
                //pathing(9, 29, direction, 8, 0);
                return { x: spots[8].col[0].x + (spotSize / 2), y: spots[8].col[0].y + (spotSize / 2) };
                break;
            case 5:
                //pathing(16, 16, direction, 0, 15);
                return { x: spots[0].col[15].x + (spotSize / 2), y: spots[0].col[15].y + (spotSize / 2) };
                break;
        }
        return null;
    }


    that.getNearestPath = function (x, y, pathNum, isFlying) {
        if (isFlying) {
            return getEndingCoord(pathNum);
        }

        let bestDist = 10000000000;
        let bestSpot = {};
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (spots[i].col[j].path[pathNum].value) {
                    let pathX = spots[i].col[j].x + (spotSize / 2);
                    let pathY = spots[i].col[j].y + (spotSize / 2);
                    let dist = Math.sqrt(Math.pow(x - pathX, 2) + Math.pow(y - pathY, 2));
                    if (bestDist > dist) {
                        bestSpot = { i: i, j: j };
                        bestDist = dist;
                    }
                }
            }
        }

        if (bestSpot.i != null) {
            let pathX = spots[bestSpot.i].col[bestSpot.j].x + (spotSize / 2);
            let pathY = spots[bestSpot.i].col[bestSpot.j].y + (spotSize / 2);
            let dist = Math.sqrt(Math.pow(x - pathX, 2) + Math.pow(y - pathY, 2))

            if (dist < 30) {
                let startI = Math.max(bestSpot.i - 1, 0);
                let startJ = Math.max(bestSpot.j - 1, 0);
                let endI = Math.min(bestSpot.i + 1, 16);
                let endJ = Math.min(bestSpot.j + 1, 29);

                let nextSpot = {};
                bestDist = 10000000000;
                for (let i = startI; i <= endI; i++) {
                    for (let j = startJ; j <= endJ; j++) {
                        if (!(i === bestSpot.i && j === bestSpot.j)) {//wtf, javascript..
                            if (spots[i].col[j].path[pathNum].value === true) {
                                let dist = getDistToEnd(pathNum, i, j);
                                if (bestDist > dist) {
                                    nextSpot = { i: i, j: j };
                                    bestDist = dist;
                                }
                            }
                        }
                    }
                }

                if (nextSpot.i != null) {
                    return {
                        x: spots[nextSpot.i].col[nextSpot.j].x + (spotSize / 2),
                        y: spots[nextSpot.i].col[nextSpot.j].y + (spotSize / 2),
                    }
                }
            }

            return {
                x: spots[bestSpot.i].col[bestSpot.j].x + (spotSize / 2),
                y: spots[bestSpot.i].col[bestSpot.j].y + (spotSize / 2),
            }
        }
        return null;
    }

    that.getDistFromFinish = function (x, y, pathNum) {
        let col = Math.floor((x - 40) / 40),
            row = Math.floor((y - 20) / 40);
        return getDistToEnd(pathNum, row, col);
    }

    return that;

}(Game.graphics));