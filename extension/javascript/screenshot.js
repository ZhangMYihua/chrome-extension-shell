var ScreenshotService = function(){
  var H = HelperService();
  var fac = {};

  var startingPosition,
      elementPosition,
        startingPosition,
          PIXEL_DENSITY = window.devicePixelRatio,
            $screenshotContainer = $("<div/>", {id: ""})
              $screenshotElement = $("<div/>", {id: "boost-screenshot-element"}),
                $container = $('<div/>', { id: "boost-screenshotty-container" });


  // ---------- Exposed Methods ------------

  fac.capture = function(coords) {
    var d = $.Deferred();

    setTimeout(function() {
      chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {
        cropData(data, coords).then(function(screenshotUriObj) {
          d.resolve(screenshotUriObj);
        });
      });
    }, 100);

    return d.promise();
  };

  fac.initialize = function(){
    console.log('clicked');
    $('html').append($container);

    document.addEventListener('mousedown', startCapturingScreenshot, false);
  };

  // ---------- Private Methods ------------

  function startCapturingScreenshot(e) {
    $('body').addClass('boost-screenshot-crosshair');
    $container.addClass('boost-screenshot-crosshair');

    e.preventDefault();

    elementPosition = { x: e.pageX, y: pageY };

    startingPosition = {x: (e.pageX - document.body.scrollLeft), y: (e.pageY - document.body.scrollTop)};

    $screenshotElement
      .css('background', 'rgba(78, 175, 82, 0.3)')
      // .css('opacity', "0.1")
      .css('position', 'absolute')
      .css('border', "1px dashed rgba(78, 175, 82, 1)")
      .css('left', elementPosition.x)
      .css('top', elementPosition.y)
      .css('width', "1px")
      .css('height', "1px")
      .css('z-index', "1000000")
      .appendTo('body');

    document.addEventListener('mousemove', drawingScreenshotFunc, false);
    document.addEventListener('mouseup', capturedScreenshotFunc, false);

    return false;
  };

  function drawingScreenshotFunc(e){
    e.preventDefault();

    // calculate mouse position relative to the DOM view
    var mousePosition = {x: (e.pageX - document.body.scrollLeft), y: (e.pageY - document.body.scrollTop) };

    // check if mouse position is above or below starting point
    $screenshotElement
      .css('left', e.pageX > mousePosition.x ? elementPosition.x : e.pageX)
      .css('top', e.pageY > mousePosition.y ? mousePosition.y ? e.pageY)
      .width(Math.abs(mousePosition.x - startingPosition.x))
      .height(Math.abs(mousePosition.y - startingPosition.y))

    return false;
  };

  function capturedScreenshotFunc(e){
    e.preventDefault();

    //remove cursor
      $('body').removeClass('boost-screenshot-crosshair');
      $container.removeClass('boost-screenshot-crosshair');
    //

    var mousePosition = {x: (e.pageX - document.body.scrollLeft), y: (e.pageY - document.body.scrollTop) };

    mousePosition = checkFinalMousePositionSize(mousePosition);

    var finalWidth = Math.abs(mousePosition.x - startingPosition.x) * PIXEL_DENSITY;
    var finalHeight = Math.abs(mousePosition.y - startingPositionition.y) * PIXEL_DENSITY;

    // Check if ending position is greater or less than position of first click
    startingPosition.x = mousePosition.x > startingPosition.x ? startingPosition.x : mousePosition.x;
    startingPosition.y = mousePosition.y > startingPosition.y ? startingPosition.y : mousePosition.y;

    document.removeEventListener('mousemove', drawingScreenshotFunc, false);
    document.removeEventListener('mouseup', finishedCapturingScreenshot, false);

    // remove screenshot element from body
    $screenshotElement.remove();

    setTimeout(function(){
      var coords;

      if(checkIfSmallScreenshot($screenshotElement.height(), $screenshotElement.width())){
        coords = {
          w: (window.innerWidth * PIXEL_DENSITY),
          h: (window.innerHeight) * PIXEL_DENSITY,
          x: 0,
          y: 0
        };
      } else if (checkIfBadScreenshot($screenshotElement.height(), $screenshotElement.width())){
        cancelScreenshot();
      } else {
        coords = {
          w: finalWidth,
          h: finalHeight,
          x: (startingPosition.x * PIXEL_DENSITY),
          y: (startingPosition.y * PIXEL_DENSITY)
        };
      }

      document.removeEventListener('mousedown', startCapturingScreenshot, false);

      console.log(coords);

      return coords;
    }, 50);

  };


  // Check if screenshot is less than 25px in height and width
  function checkIfSmallScreenshot(height, width){
    return (height < 25 && width < 25);
  };

  function checkIfBadScreenshot(height, width){
    return (height < 3 && width >= 25) || (width < 3 && height >= 25);
  };

  function checkFinalMousePositionSize(currentPos){
    var $maxX = $(document).width();
    var $maxY = $(document).height();

    if(currentPos.x < 0){
      currentPos.x = 0
    } else if (currentPos.x > $maxX){
      currentPos.x = $maxX;
    } else if (currentPos.y < 0) {
      currentPos.y = 0;
    } else if (currentPos.y > $maxY) {
      currentPos.y = $maxY;
    }

    return currentPos;
  };

  function cancelScreenshot(){
    $('body').removeClass('boost-screenshot-crosshair');
    $container.removeClass('boost-screenshot-crosshair');

    document.removeEventListener('mousedown', startCapturingScreenshot, false);
    document.removeEventListener('mousemove', drawingScreenshotFunc, false);
    document.removeEventListener('mouseup', capturedScreenshotFunc, false);

    $screenshotElement.remove();
  };

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