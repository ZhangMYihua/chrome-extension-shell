$(document).ready(function(){
	// services
	var Messenger = MessengerService("content");

	// base container
	var containerStyle = "position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); z-index: 2147483646; display:flex; justify-content:center; align-items:center;";
	var $container = $('<div/>', {id: "chrome-shell-top-container", style: containerStyle});

	var $baseButton,
				$homeButton,
					$messagesButton,
						$uploadButton,
							$screenshotButton,
								$chatWindow;

	// iframes
	var iframes = {},
  // templates
      _templates = {};


  function getTemplate(templateName){
    var templateId = "#chrome-shell-" + templateName + "-template";

    var d = $.Deferred();
    if(!_templates[templateName]){
      $.get(chrome.extension.getURL('extension/templates/' + templateName + '.html')).then(function(template){
        var $template = $(template);
        _templates[templateName] = $template.filter(templateId).html();
        d.resolve();
      });
    } else {
      d.resolve();
    }

    d.then(function(){
      var t = _templates[templateName] || "";
      console.log(t)
      return t;
    });
  };


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

	// buttons

	function generateButtonTemplate(buttonId, assetUrl){
		var imageSrc = chrome.extension.getURL(assetUrl);
		var buttonStyle = "background-image: url(" + imageSrc + "); background-position: 50% 50%; background-repeat: no-repeat;";
		return $("<div/>", {id: buttonId, class: "chrome-shell-button", style: buttonStyle });
	};

	function initializeButtons(){
		$baseButton = generateButtonTemplate("chrome-shell-base-button", "assets/images/boost-chrome-icon-48.png");
		$homeButton = generateButtonTemplate("chrome-shell-home-button", "assets/images/home-btn.png");
		$messagesButton = generateButtonTemplate("chrome-shell-messages-button", "assets/images/messages-btn.png");
		$uploadButton = generateButtonTemplate("chrome-shell-upload-button", "assets/images/upload-btn.png");
		$screenshotButton = generateButtonTemplate("chrome-shell-screenshot-button", "assets/images/screenshot-btn.png");

		$('html').append($baseButton);
		$('html').append($homeButton);
		$homeButton.hide();
		$('html').append($uploadButton);
		$messagesButton.hide();
		$('html').append($messagesButton);
		$uploadButton.hide();
		$('html').append($screenshotButton);
		$screenshotButton.hide();
	};

	initializeButtons();

	function fadeInToggle(element){
		var $element = $(element);

		if($element.hasClass("fadeInRight")){
			$element.removeClass("fadeInRight").addClass("fadeOutRight");
			$element.one('oanimationend animationend', function(){
				$element.hide();
				$element.removeClass("fadeOutRight");
			});
		} else {
			$element.show();
			$element.addClass("animated fadeInRight");
		}
	}

	function toggleButton(button){
		fadeInToggle(button);
	};

	function boostButtonClicked(){
		toggleButton($homeButton);
		toggleButton($messagesButton);
		toggleButton($uploadButton);
		toggleButton($screenshotButton);
	};

	$baseButton.click(boostButtonClicked);

  function generateChatWindow(){
    var $popup = $("<div/>", {id: "chrome-shell-chat-popup"});

    var $messagesFlexContainer = $("<div/>", {id: "chrome-shell-chats-window-flex-container"});
    $popup.append($messagesFlexContainer);

    var $headerContainer = $("<div/>", {id: "chrome-shell-chat-window-header-container"});
    $messagesFlexContainer.append($headerContainer);

    var $header = $("<div/>", {id: "chrome-shell-chat-window-header"});
    $headerContainer.append($header);



    var $channelImage = $("<img/>", {class: "square-image", src: chrome.extension.getURL("assets/images/default-channel-image.png"), style: "margin-right: 5px;"});
    $header.append($channelImage);

    var $headerTitle = $("<div/>", {id: "chrome-shell-header-title"});
    $headerTitle.append("BoostHQ Team");

    $header.append($headerTitle);

    var $messagesBox = $("<div/>", {id: "chrome-shell-chat-box-container"});

    $messagesFlexContainer.append($messagesBox);

    return $popup;
  };

  function generateSelfMessageDiv(text){
    var $myMessage = $("<div/>", {class: "chrome-shell-message-container chrome-shell-self-message"});
    $myMessage.append(text);
    return $myMessage;
  };

  function generateOtherMessageDiv(text){
    var $otherMessage = $("<div/>", {class: "chrome-shell-message-container chrome-shell-others-message"});
    $otherMessage.append(text);
    return $otherMessage;
  };

	function initializeChat(){
    getTemplate("chat-box");


		$chatWindow = generateChatWindow();

    var $otherChat1 = generateOtherMessageDiv("Check out the 2nd paragraph, this is exactly what we want");
    var $otherChat2 = generateOtherMessageDiv("I agree, lets implement this");
    var $otherChat3 = generateOtherMessageDiv("But what about our existing providers? We're still signed with them for another quarter.");
    var $otherChat4 = generateOtherMessageDiv("Mark, what do you think about this?");
    var $selfChat1 = generateSelfMessageDiv("We can pay off the rest of the contract immediately and exit.");

    var $messages = $chatWindow.find("#chrome-shell-chat-box-container");

    $messages.append($otherChat1);
    $messages.append($otherChat2);
    $messages.append($otherChat3);
    $messages.append($selfChat1);
    $messages.append($otherChat4);

		$('html').append($chatWindow);
		$chatWindow.hide();
	};

	initializeChat();

	function toggleChat(){
		fadeInToggle($chatWindow);
	};

	$messagesButton.click(toggleChat);

});