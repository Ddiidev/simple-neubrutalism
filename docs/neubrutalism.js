(function () {
  var currentScript = document.currentScript;
  var head = document.head || document.getElementsByTagName('head')[0];

  if (!currentScript || !currentScript.src || !head) {
    return;
  }

  var baseUrl = new URL('.', currentScript.src);
  var styleUrl = new URL('neubrutalism.css', baseUrl).href;
  var scriptPaths = [
    'tags/modal.js',
    'tags/tabs.js',
    'tags/select.js',
    'tags/datetime.js'
  ];

  function hasStyle(url) {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(function (link) {
      return link.href === url;
    });
  }

  function hasScript(url) {
    return Array.from(document.scripts).some(function (script) {
      return script.src === url;
    });
  }

  if (!hasStyle(styleUrl)) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styleUrl;
    link.setAttribute('data-nbtl-loader', 'style');
    head.appendChild(link);
  }

  scriptPaths.forEach(function (path) {
    var url = new URL(path, baseUrl).href;

    if (hasScript(url)) {
      return;
    }

    var script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.setAttribute('data-nbtl-loader', path);
    head.appendChild(script);
  });
})();
