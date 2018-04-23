Menu.screens['about'] = (function(menu) {
	
	let that = {};

	that.initialize = function() {
		document.getElementById('id-about-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
	}
	
	that.run = function() { }
	
	return that;
}(Menu.menu));
