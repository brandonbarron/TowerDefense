Menu.screens['main-menu'] = (function(menu) {

	let that = {};

	that.initialize = function() {

		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {menu.showScreen('new-game'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { menu.showScreen('high-scores'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { menu.showScreen('about'); });
	}
	
	that.run = function() { }
	
	return that;
}(Menu.menu));
