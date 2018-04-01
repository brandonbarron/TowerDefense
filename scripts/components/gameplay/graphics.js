Game.graphics = (function () {
    let canvas, context, image;
    let that = { };

    that.initialize = function () {
        canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');
        
        image = new Image();
        image.onload = function () { ready = true; };
        image.src = "assets/grassBackground.jpg";
    }

    CanvasRenderingContext2D.prototype.clear = function () {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    that.drawRectangle = function (position, size, fill) {
        context.save();
        context.beginPath();
        context.fillStyle = fill;
        context.rect(position.x, position.y, size.width, size.height);
        context.fill();
        context.closePath();
        context.restore();
    }

    that.drawCircle = function (position, radius, angle, fill) {
        context.save();
        context.beginPath();
        context.arc(position.x, position.y, radius, angle.start, angle.end);
        context.fillStyle = fill;
        context.fill();
        context.closePath();
        context.restore();
    }

    that.drawText = function (position, string, fill, font) {
        context.save();
        context.beginPath();
        context.font = font;
        context.fillStyle = fill;
        context.fillText(string, position.x, position.y);
        context.closePath();
        context.restore();
    }

    that.drawBackground = function () {
        context.save();
        context.drawImage(image, 0, 0);
        context.restore();
    }

    that.clear = function() { context.clear(); }

    that.clearCountdown = function() {
        context.clearRect(400, 400, 100, 100);
    }

    return that;

    // return {
    //     clear: clear,
    //     drawBackground: drawBackground,
    //     drawRectangle: drawRectangle,
    //     drawCircle: drawCircle,
    //     drawText: drawText,
    //     clearCountdown: clearCountdown
    // };

}());