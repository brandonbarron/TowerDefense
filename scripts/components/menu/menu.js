Menu.menu = (function() {

	let that = {}, _screens, screen, active;
	
	that.showScreen = function(id) {
		screen = 0;
        active = null;

		active = document.getElementsByClassName('active');
		for (screen = 0; screen < active.length; screen++)
			active[screen].classList.remove('active');

		_screens[id].run();
		document.getElementById(id).classList.add('active');
	}

	that.initialize = function(socket) {
		_screens = Menu.screens;
        screen = null;
		for (screen in _screens)
			if (_screens.hasOwnProperty(screen))
				_screens[screen].initialize();

		that.showScreen('main-menu');
	}
	
	return that;
}());