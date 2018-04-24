// // ------------------------------------------------------------------
// //
// //
// // ------------------------------------------------------------------

Game.particles = (function () {
    'use strict';

    var canvas = document.getElementById('canvas-main'),
        context = canvas.getContext('2d');

    var that = {};
    let particles = [];
    let spec = {};
    let floatingTexts = [];

    that.initialize = function (specValues) {
        spec = specValues;
    }

    function updateText(elapsedTime) {
        let keepMe = [];

        for (let particle = 0; particle < floatingTexts.length; particle++) {
            floatingTexts[particle].alive += elapsedTime;
            //floatingTexts[particle].position.x += (elapsedTime * floatingTexts[particle].speed * floatingTexts[particle].direction.x);
            floatingTexts[particle].position.y -= (elapsedTime * floatingTexts[particle].speed);// * floatingTexts[particle].direction.y);
            //floatingTexts[particle].rotation += floatingTexts[particle].speed / .5;

            if (floatingTexts[particle].alive <= floatingTexts[particle].lifetime) {
                keepMe.push(floatingTexts[particle]);
            }
        }

        floatingTexts = keepMe;
    }

    that.update = function (elapsedTime) {
        let keepMe = [];

        for (let particle = 0; particle < particles.length; particle++) {
            particles[particle].alive += elapsedTime;
            particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
            particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
            particles[particle].rotation += particles[particle].speed / .5;

            if (particles[particle].alive <= particles[particle].lifetime) {
                keepMe.push(particles[particle]);
            }
        }

        particles = keepMe;
        updateText(elapsedTime);
    }

    function drawRectangle(position, size, rotation, fill, stroke) {
        context.save();
        context.translate(position.x + size / 2, position.y + size / 2);
        context.rotate(rotation);
        context.translate(-(position.x + size / 2), -(position.y + size / 2));

        context.fillStyle = fill;
        //context.strokeStyle = stroke;
        context.fillRect(position.x, position.y, size, size);
        //context.strokeRect(position.x, position.y, size, size);

        context.restore();
    }

    function drawText(position, string, fill, font) {
        context.save();
        context.beginPath();
        context.font = font;
        context.fillStyle = fill;
        context.fillText(string, position.x, position.y);
        context.closePath();
        context.restore();
    }

    that.render = function () {
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].alive >= 100) {
                drawRectangle(
                    particles[particle].position,
                    particles[particle].size,
                    particles[particle].rotation,
                    particles[particle].fill,
                    particles[particle].stroke);

            }
        }

        for (let particle = 0; particle < floatingTexts.length; particle++) {
            if (floatingTexts[particle].alive >= 100) {
                drawText(
                    floatingTexts[particle].position,
                    floatingTexts[particle].string,
                    floatingTexts[particle].fill,
                    floatingTexts[particle].font);

            }
        }
    };

    that.addParticle = function (theBlock, color) {
        theBlock.x -= 20;
        theBlock.y -= 20;
        let partSize = 1;
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                let p = {
                    position: {
                        x: theBlock.x + (j * partSize),
                        y: theBlock.y + (i * partSize)
                    },
                    direction: Random.nextCircleVector(),
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),	// pixels per millisecond
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
                    alive: 0,
                    size: partSize,//Random.nextGaussian(spec.size.mean, spec.size.stdev),
                    fill: color,
                    //stroke: 'rgb(0, 0, 0)'
                };
                particles.push(p);
            }
        }
    }

    that.addText = function (theBlock, text) {
        let p = {
            position: {
                x: theBlock.x,
                y: theBlock.y
            },
            direction: 0,//Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),	// pixels per millisecond
            rotation: 0,
            lifetime: 2000,//Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
            alive: 0,
            fill: 'black',
            string: text,
            font: '24px Arial'
            //stroke: 'rgb(0, 0, 0)'
        };
        floatingTexts.push(p);
    }

    return that;
}());
