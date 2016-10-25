function TemplateHelper(){
  var fac = {};
  var _templates = {};

  fac.getTemplate(templateName){
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

  return fac;
};