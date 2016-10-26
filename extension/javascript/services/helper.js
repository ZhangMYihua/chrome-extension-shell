function HelperService(){
  var fac = {};

  fac.splitDataUrl = function(dataURI) {
    // May need Bytestring conversion?
    // var byteString = atob(dataURI.split(',')[1]);
    return {
      "dataUrl" : dataURI.split(',')[1],
      "mimetype" : dataURI.split(',')[0].split(':')[1].split(';')[0],
      "dataUri" : dataURI
    }
  };

  fac.caseFunction = function(value) {
    return function(values, callback) {
      if(!Array.isArray(values)){
        values = [values];
      }
      for(var i = 0; i < values.length; i++){
        if (value == values[i]) {
          callback();
        }
      }
    };
  };

  return fac;
}