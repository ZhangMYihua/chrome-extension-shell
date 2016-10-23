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

	function generateButtonTemplate(buttonId, assetUrl){
		var imageSrc = chrome.extension.getURL(assetUrl);
		var buttonStyle = "background-image: url(" + imageSrc + "); background-position: 50% 50%; background-repeat: no-repeat;";
		return $("<div/>", {id: buttonId, class: "chrome-shell-button", style: buttonStyle });
	};

	function initializeButtons(){
		setTimeout(function(){
			var $baseButton = generateButtonTemplate("chrome-shell-base-button", "assets/images/boost-chrome-icon-48.png");
			var $homeButton = generateButtonTemplate("chrome-shell-home-button", "assets/images/home-btn.png");
			var $messagesButton = generateButtonTemplate("chrome-shell-messages-button", "assets/images/messages-btn.png");
			var $uploadButton = generateButtonTemplate("chrome-shell-upload-button", "assets/images/upload-btn.png");
			var $screenshotButton = generateButtonTemplate("chrome-shell-screenshot-button", "assets/images/screenshot-btn.png");

			$('html').append($baseButton);
			$('html').append($homeButton);
			$('html').append($uploadButton);
			$('html').append($messagesButton);
			$('html').append($screenshotButton);
		}, 1);
	};

	initializeButtons();




});