$(document).ready(function(){
	// services
	var Messenger = MessengerService("content");

	// base container
	var containerStyle = "position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); z-index: 2147483646; display:flex; justify-content:center; align-items:center;";
	var $container = $('<div/>', {id: "chrome-shell-top-container", style: containerStyle});

	// iframes
	var iframes = {};

	function setIframe(id, styleString, target){
		target = target || $container;

		if(iframes[id]) {
			return iframes[id];
		} else {
			// initialize new iframe
			var src = chrome.extension.getURL("extension/iframes/html/" + id + ".html");
			var iframe = $("<iframe/>", {id: "chrome-shell-iframe-" + id, src: src, scrolling: false, style: styleString});

			// store iframe
			iframes[id] = {
				"id" : id,
				"iframe" : iframe,
				"isLoaded" : false
			};

			// append iframe
			target.append(iframe);

			return iframes[id];
		}
	};

	// initialize
	function initializeIframes(){
		setTimeout(function(){
			$('html').append($container);
			$container.hide();
		}, 1);
	};

	initializeIframes();

	function initializeButtons(){
		setTimeout(function(){
			var baseButtonImageSrc = chrome.extension.getURL('assets/images/boost-chrome-icon-48.png');
			var baseButtonStyle = "position: fixed; float: right; z-index: 2147483647; bottom: 7px; right: 5px; background-image: url(" + baseButtonImageSrc + "); background-position: 50% 50%; background-repeat: no-repeat;";
			var $baseButton = $("<div/>", {id: "chrome-shell-base-button", class: "chrome-shell-button", style: baseButtonStyle});

			$('html').append($baseButton);			
		}, 1);
	};

	initializeButtons();


});