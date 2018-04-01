// // ------------------------------------------------------------------
// //
// //
// // ------------------------------------------------------------------

Master.particles = (function (spec) {
	'use strict';

	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
    var that = {};
    let particles = [];


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

    that.draw = function () {
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
    };

    that.addParticle = function (theBlock) {
        let partSize = 1;
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 50; j++) {
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
                    fill: theBlock.color,
                    //stroke: 'rgb(0, 0, 0)'
                };
                particles.push(p);
            }
        }
    }

    return that;
}());
