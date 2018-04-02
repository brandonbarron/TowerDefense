Game.graphics = (function () {
    let canvas, context;
    let that = { };

    that.initialize = function () {
        canvas = document.getElementById('canvas-main');
        context = canvas.getContext('2d');
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

    that.drawImage = function (spec) {
        context.save();
        context.drawImage(spec.image, spec.x, spec.y, spec.w, spec.h);
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