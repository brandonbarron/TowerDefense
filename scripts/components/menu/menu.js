Menu.menu = (function() {
	'use strict';

	let _screens = Menu.screens;
	
	function showScreen(id) {
		let screen = 0;
        let active = null;

		active = document.getElementsByClassName('active');
		for (screen = 0; screen < active.length; screen++)
			active[screen].classList.remove('active');

		_screens[id].run();
		document.getElementById(id).classList.add('active');
	}

	function initialize(socket) {
        let screen = null;
		for (screen in _screens)
			if (_screens.hasOwnProperty(screen))
				_screens[screen].initialize();

		showScreen('main-menu');
	}
	
	return {
		initialize : initialize,
		showScreen : showScreen
	};
}());