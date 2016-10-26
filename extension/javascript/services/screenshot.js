var ScreenshotService = function(){
  var H = HelperService();
  var fac = {};

  // ---------- Exposed Methods ------------

  fac.capture = function(coords) {
    var d = $.Deferred();

    var captureFromGoogle = function() {
      chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {
        cropData(data, coords).then(function(screenshotUriObj) {
          d.resolve(screenshotUriObj);
        });
      });
    }

    setTimeout(captureFromGoogle, 100);

    return d.promise();
  };

  // ---------- Private Methods ------------

  function cropData(str, coords) {
    var d = $.Deferred();

    var img = document.createElement('img');

    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = coords.w;
      canvas.height = coords.h;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);

      d.resolve(H.splitDataUrl(canvas.toDataURL()));
    };

    img.src = str;
    return d.promise();
  };

  return fac;
}