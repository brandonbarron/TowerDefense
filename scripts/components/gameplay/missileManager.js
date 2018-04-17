Game.missileManager = function (graphics) {
	'use strict';
    let that = {};
    let missiles = {};
    let explosions = {};
    let nextExplosionId = 1;

    function collided(obj1, obj2) {
        let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2));
        let radii = obj1.radius + obj2.radius;
    
        return distance <= radii;
    }

    that.update = function(elapsedTime, gameRunning) {
        if(!gameRunning) {
            //return;
        }
        let removeMissiles = [];
        for (let missile in missiles) {
            if (!missiles[missile].update(elapsedTime)) {
                removeMissiles.push(missiles[missile]);
            }
        }

        for (let missile = 0; missile < removeMissiles.length; missile++) {
            missileHit(removeMissiles[missile]);
            delete missiles[removeMissiles[missile].id];

        }

        for (let id in explosions) {
            if (!explosions[id].update(elapsedTime)) {
                delete explosions[id];
            }
        }
        
    };

    that.render = function() {
        for (let missile in missiles) {
            //renderer.Missile.render(missiles[missile]);
            missiles[missile].render();
        }

        for (let id in explosions) {
            //renderer.AnimatedSprite.render(explosions[id]);
            explosions[id].draw();
        }
    }

    function missileHit(data) {
        explosions[nextExplosionId] = graphics.TimedSpriteSheet({
            id: nextExplosionId++,
            //spriteSheet: Master.assets['explosion'],
            spriteSheet: 'assets/explosion.png',
            spriteSize: { width: 0.07, height: 0.07 },
            center: data.position,
            spriteCount: 16,
            spriteTime: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
        }, graphics);

        //
        // When we receive a hit notification, go ahead and remove the
        // associated missle from the client model.
        delete missiles[data.missileId];
    }

    function missileNew(data) {
        missiles[data.id] = Master.components.Missile({
            id: data.id,
            radius: data.radius,
            speed: data.speed,
            direction: data.direction,
            position: {
                x: data.position.x,
                y: data.position.y
            },
            timeRemaining: data.timeRemaining
        }, graphics);
    }

    that.addMissile = function(data) {
        missileNew(data);
    }

    return that;
}(Game.graphics);
