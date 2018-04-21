Game.graphics = (function () {
    let canvas, context, that = {};

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

    that.drawRectangleBorder = function(position, size, color) {
        context.save();
        context.beginPath();
        context.rect(position.x, position.y, size.width, size.height);
        context.lineWdith = .75;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.restore();
    }

    that.drawRectangle = function(position, size, fill) {
        context.save();
        context.beginPath();
        context.fillStyle = fill;
        context.rect(position.x, position.y, size.width, size.height);
        context.fill();
        context.closePath();
        context.restore();
    }

    that.drawCircle = function(position, radius, angle, fill) {
        context.save();
        context.beginPath();
        context.arc(position.x, position.y, radius, angle.start, angle.end);
        context.fillStyle = fill;
        context.fill();
        context.closePath();
        context.restore();
    }

    that.drawText = function(position, string, fill, font) {
        context.save();
        context.beginPath();
        context.font = font;
        context.fillStyle = fill;
        context.fillText(string, position.x, position.y);
        context.closePath();
        context.restore();
    }

    that.drawImage = function(spec) {
        context.save();
        context.drawImage(spec.image, spec.x, spec.y, spec.w, spec.h);
        context.restore();
    }

    that.drawButton = function(spec) {
        context.save();
        context.beginPath();
        that.drawRectangle({x: spec.x, y: spec.y}, {width: spec.width, height: spec.height}, spec.color);
        that.drawText({x: spec.x, y: spec.y + (spec.height / 2)}, spec.text, spec.textColor, spec.font);
        context.closePath();
        context.restore();
    }
    that.clear = function() { context.clear(); }

    that.clearCountdown = function() { context.clearRect(400, 400, 100, 100); }

    that.drawImageSpriteSheet = function(spriteSheet, spriteSize, sprite, center, size) {
        let localCenter = {
            x: center.x * canvas.width,
            y: center.y * canvas.width
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.drawImage(spriteSheet,
            sprite * spriteSize.width, 0,                 // which sprite to render
            spriteSize.width, spriteSize.height,    // size in the spritesheet
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);
    }


    //------------------------------------------------------------------
    //
    // Provides rendering support for a sprite animated from a sprite sheet.
    //
    //------------------------------------------------------------------
    that.SpriteSheet = function(spec) {
        var that = {},
            image = new Image();

        //
        // Initialize the animation of the spritesheet
        spec.sprite = 0;		// Which sprite to start with
        spec.elapsedTime = 0;	// How much time has occured in the animation

        //
        // Load the image, set the ready flag once it is loaded so that
        // rendering can begin.
        image.onload = function () {
            //
            // Our clever trick, replace the draw function once the image is loaded...no if statements!
            that.draw = function () {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                //
                // Pick the selected sprite from the sprite sheet to render
                context.drawImage(
                    image,
                    spec.width * spec.sprite, 0,	// Which sprite to pick out
                    spec.width, spec.height,		// The size of the sprite
                    spec.center.x - spec.width / 2,	// Where to draw the sprite
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                    context.restore();
            };
            //
            // Once the image is loaded, we can compute the height and width based upon
            // what we know of the image and the number of sprites in the sheet.
            spec.height = image.height;
            spec.width = image.width / spec.spriteCount;
        };
        image.src = spec.spriteSheet;



        //------------------------------------------------------------------
        //
        // Update the animation of the sprite based upon elapsed time.
        //
        //------------------------------------------------------------------
        that.update = function (elapsedTime, forward) {
            spec.elapsedTime += elapsedTime;
            //
            // Check to see if we should update the animation frame
            if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
                //
                // When switching sprites, keep the leftover time because
                // it needs to be accounted for the next sprite animation frame.
                spec.elapsedTime -= spec.spriteTime[spec.sprite];
                //
                // Depending upon the direction of the animation...
                if (forward === true) {
                    spec.sprite += 1;
                    //
                    // This provides wrap around from the last back to the first sprite
                    spec.sprite = spec.sprite % spec.spriteCount;
                } else {
                    spec.sprite -= 1;
                    //
                    // This provides wrap around from the first to the last sprite
                    if (spec.sprite < 0) {
                        spec.sprite = spec.spriteCount - 1;
                    }
                }
            }
        };

        //------------------------------------------------------------------
        //
        // Render the correct sprint from the sprite sheet
        //
        //------------------------------------------------------------------
        that.draw = function () {
            //
            // Starts out empty, but gets replaced once the image is loaded!
        };

        that.rotateRight = function(angle) {
			spec.rotation += angle;
		};

		that.rotateLeft = function(angle) {
			spec.rotation -= angle;
        }
        that.getRot = function() {
            return spec.rotation;
        }

        return that;
    }

    that.TimedSpriteSheet = function(spec) {
        var image = new Image();

        //
        // Initialize the animation of the spritesheet
        spec.sprite = 0;		// Which sprite to start with
        spec.elapsedTime = 0;	// How much time has occured in the animation
        let frame = 0,
            that = {
                get spriteSheet() { return spec.spriteSheet; },
                get pixelWidth() { return spec.spriteSheet.width / spec.spriteCount; },
                get pixelHeight() { return spec.spriteSheet.height; },
                get width() { return spec.spriteSize.width; },
                get height() { return spec.spriteSize.height; },
                get center() { return spec.Center; },
                get sprite() { return spec.sprite; }
            };

        //
        // Initialize the animation of the spritesheet
        spec.sprite = 0;		// Which sprite to start with
        spec.elapsedTime = 0;	// How much time has occured in the animation for the current sprite
        spec.lifetime = 0;
        spec.spriteTime.forEach(item => {
            spec.lifetime += item;
        });
        //
        // Load the image, set the ready flag once it is loaded so that
        // rendering can begin.
        image.onload = function () {
            //
            // Our clever trick, replace the draw function once the image is loaded...no if statements!
            that.draw = function () {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                //
                // Pick the selected sprite from the sprite sheet to render
                context.drawImage(
                    image,
                    spec.width * spec.sprite, 0,	// Which sprite to pick out
                    spec.width, spec.height,		// The size of the sprite
                    spec.center.x - spec.width / 2,	// Where to draw the sprite
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                context.restore();
            };
            //
            // Once the image is loaded, we can compute the height and width based upon
            // what we know of the image and the number of sprites in the sheet.
            spec.height = image.height;
            spec.width = image.width / spec.spriteCount;
        };
        image.src = spec.spriteSheet;



        //------------------------------------------------------------------
        //
        // Update the animation of the sprite based upon elapsed time.
        //
        //------------------------------------------------------------------
        that.update = function (elapsedTime) {
            spec.elapsedTime += elapsedTime;
            spec.lifetime -= elapsedTime;
            //
            // Check to see if we should update the animation frame
            if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
                //
                // When switching sprites, keep the leftover time because
                // it needs to be accounted for the next sprite animation frame.
                spec.elapsedTime -= spec.spriteTime[spec.sprite];
                spec.sprite += 1;
                //
                // This provides wrap around from the last back to the first sprite
                spec.sprite = spec.sprite % spec.spriteCount;
            }

            return spec.lifetime > 0;
        };

        //------------------------------------------------------------------
        //
        // Render the correct sprint from the sprite sheet
        //
        //------------------------------------------------------------------
        that.draw = function () {
            //
            // Starts out empty, but gets replaced once the image is loaded!
        };

        return that;
    }

    return that;

}());