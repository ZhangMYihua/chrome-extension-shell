$(document).ready(function(){
	// services
	var Messenger = MessengerService("content");
  var Screenshotty = ScreenshotService();
  console.log(Screenshotty)

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
    var t;
    if(!_templates[templateName]){
      $.get(chrome.extension.getURL('extension/templates/' + templateName + '.html')).then(function(template){
        var $template = $(template);
        _templates[templateName] = $template.filter(templateId).html();
        t = _templates[templateName] || "";
        d.resolve(t);
      });
    } else {
      t = _templates[templateName] || "";
      d.resolve(t);
    }

    return d.promise();
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

  function generateSelfMessageDiv(text){
    var $myMessage = $("<div/>", {class: "chrome-shell-message-container chrome-shell-self-message"});
    $myMessage.append(text);
    return $myMessage;
  };

  function generateOtherMessageDiv(array){
    var d = $.Deferred();
    getTemplate("chat-message").then(function(chatMessageTemplate){
      var compiled = _.template(chatMessageTemplate);
      var s = "";
      for(var i = 0; i < array.length; i++){
        var messageHtml = compiled({ "userObj" : array[i] });
        s = s + messageHtml;
      }
      d.resolve(s);
    });
    return d.promise();
  };

	function initializeChat(){
    getTemplate("chat-box").then(function(chatBoxTemplate){
      var compiled = _.template(chatBoxTemplate);
      var chatboxHtml = compiled({ "channelTitle" : "BoostHQ Team", "channelImageSrc" : chrome.extension.getURL("assets/images/default-channel-image.png") });

      $('html').append(chatboxHtml);

      $chatWindow = $(".chrome-shell-chat-popup-container");
      $chatWindow.hide();
    });

    var commentUsers = [
      {
        "comment" : "Check out the 2nd paragraph, this is exactly what we want",
        "avatarUrl" : chrome.extension.getURL("assets/images/default-user-image.png"),
        "commenter" : "Babak Barkhodaee"
      },
      {
        "comment" : "I agree, lets implement this",
        "avatarUrl" : chrome.extension.getURL("assets/images/default-user-image.png"),
        "commenter" : "Sepand Barkhodaee"
      },
      {
        "comment" : "But what about our existing providers? We're still signed with them for another quarter.",
        "avatarUrl" : chrome.extension.getURL("assets/images/default-user-image.png"),
        "commenter" : "Mike Zhang"
      },
      {
        "comment" : "Steve, what do you think about this?",
        "avatarUrl" : chrome.extension.getURL("assets/images/default-user-image.png"),
        "commenter" : "Arash Barkhodaee"
      },
      {
        "comment" : "We can pay off the rest of the contract immediately and exit.",
        "avatarUrl" : chrome.extension.getURL("assets/images/default-user-image.png"),
        "commenter" : "Kia Kiazand"
      }
    ];

    generateOtherMessageDiv(commentUsers).then(function(commentsHtml){
      $(".chrome-shell-chat-box-container").append(commentsHtml);
    });
	};

	initializeChat();

	function toggleChat(){
		fadeInToggle($chatWindow);
	};

	$messagesButton.click(toggleChat);

  $screenshotButton.click(Screenshotty.initialize);


});