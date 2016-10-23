$(document).ready(function(){
	var Messenger = MessengerService("content");

	function initializeIframes(){
		var containerStyle = "position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); z-index: 2147483646; display:flex; justify-content:center; align-items:center;";
		$container = $('<div/>', {id: "chrome-shell-top-container", style: containerStyle});

		setTimeout(function(){
			$('html').append($container);
			$container.hide();
		}, 1);
	};

	initializeIframes();


});