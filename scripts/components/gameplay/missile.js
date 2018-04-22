//------------------------------------------------------------------
//
// Model for each missile in the game.
//
//------------------------------------------------------------------
Master.components.Missile = function (spec, graphics) {
    'use strict';
    let that = {};

    Object.defineProperty(that, 'position', {
        get: () => spec.position
    });

    Object.defineProperty(that, 'radius', {
        get: () => spec.radius
    });

    Object.defineProperty(that, 'id', {
        get: () => spec.id
    });

    function findClosestSprite(x, y, allSprites) {
		let bestI = 0;
		let bestDist = 1000000000;
		for (let i = 0; i < allSprites.length; i++) {
			let spriteLoc = allSprites[i].getLoc();

			let dist = Math.sqrt(Math.pow(spriteLoc.x - x, 2) + Math.pow(spriteLoc.y - y, 2));
			if (bestDist > dist) {
				bestI = i;
				bestDist = dist;
			}
		}
		if (bestI === 0) {
			//console.log('no best found');
		}
		return {i: bestI, dist: bestDist};
    }
    
    that.update = function (elapsedTime, allSprites) {
        let vectorX = Math.cos(spec.direction);
        let vectorY = Math.sin(spec.direction);

        spec.position.x += (vectorX * elapsedTime * spec.speed);
        spec.position.y += (vectorY * elapsedTime * spec.speed);

        spec.timeRemaining -= elapsedTime;

        if (spec.timeRemaining <= 0) {
            return false;
        } 

        let closestSprite = findClosestSprite(spec.position.x, spec.position.y, allSprites)

        if(closestSprite.dist <= 20) {
            allSprites[closestSprite.i].reduceHealth(spec.shootDamage);
            return false;
        }
        return true;
    };

    that.render = function () {
        if(spec.position.y > 700) {
            return;
        }
        //console.log('render missle');
        //graphics.drawCircle(spec.position, spec.radius, '#FFFFFF');
        graphics.drawCircle(spec.position, spec.radius, { start: 0, end: 2 * Math.PI }, '#FFFFFF');
    };

    return that;
};
