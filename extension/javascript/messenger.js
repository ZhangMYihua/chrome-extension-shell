var MessengerService = function(scriptSource) {
  if (!scriptSource) return;
    // check chrome version
  if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
  } else if(!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
  }

  var fac = {};

  fac.content = {
    "sendMessage" : function(message, data){
      var d = $.Deferred();
      data = data || {};
      data.sender = "content";

      chrome.runtime.sendMessage({
        message: message,
        data: data
      }, function(response){
        d.resolve(response);
      });
      return d.promise();
    }
  };

  fac.popup = {
    "sendMessage" : function(message, data){
      var d = $.Deferred();
      data = data || {};
      data.sender = "popup";

      chrome.runtime.sendMessage({
        message: message,
        data: data
      }, function(response){
        d.resolve(response);
      });
      return d.promise();
    }
  };

  fac.iframe = {
    "sendMessage" : function(message, data){
      var d = $.Deferred();
      data = data || {};
      data.sender = "iframe";

      window.parent.postMessage({
        message: message,
        data: data
      }, '*');
      return d.promise();
    }
  };

  fac.background = {
    "sendMessage" : function(message, data){
      var d = $.Deferred();
      data = data || {};
      data.sender = "background";

      var sendMessageToTab = function(tabId) {
        chrome.tabs.sendMessage(tabId, {
          message: message,
          data: data
        }, function(response){
          d.resolve(response);
        });
      };

      if (data.tabId) {
        sendMessageToTab(data.tabId);
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          if (!tabs || (tabs.length < 1)) {
            d.reject();
            return;
          }
          sendMessageToTab(tabs[0].id);
        });
      }

      return d.promise;
    }
  };

  return fac[scriptSource];
}

