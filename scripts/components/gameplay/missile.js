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

    //------------------------------------------------------------------
    //
    // Update the position of the missle.  We don't receive updates from
    // the server, because the missile moves in a straight line until it
    // explodes.
    //
    //------------------------------------------------------------------
    that.update = function (elapsedTime) {
        let vectorX = Math.cos(spec.direction);
        let vectorY = Math.sin(spec.direction);

        spec.position.x += (vectorX * elapsedTime * spec.speed);
        spec.position.y += (vectorY * elapsedTime * spec.speed);

        spec.timeRemaining -= elapsedTime;

        if (spec.timeRemaining <= 0) {
            return false;
        } else {
            return true;
        }
    };

    that.render = function () {
        //console.log('render missle');
        //graphics.drawCircle(spec.position, spec.radius, '#FFFFFF');
        graphics.drawCircle(spec.position, spec.radius, { start: 0, end: 2 * Math.PI }, '#FFFFFF');
    };

    return that;
};
