(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  app.addEventListener('dom-change', function() {
    console.log('observing #resultat...');
    var _this = this;
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        //console.log('mutation', mutation.type, mutation.target.data);
        if (mutation.type == 'characterData') {
          _this.onResultChange(mutation.target.data);
        }
      });    
    });
    observer.observe(document.querySelector('#resultat'), {
      characterData: true,
      subtree: true
    });
  });

  // testing from console:
  // document.querySelector('#app').set('user', {id: 0});

  var DEFAULT_ANSWERS = {
    htmlCode: '',
    jsCode: ''
  };

  // initialize myAnswers using iron-localstorage (only if not found in localstorage)
  app.initDefaults = function(ev) {
    console.log("app.initDefaults");
    this.myAnswers = DEFAULT_ANSWERS;
  };

  // cf https://www.polymer-project.org/1.0/docs/devguide/properties.html#observing-path-changes
  app.observers = [
    'onAnswersUpdate(myAnswers.*)',
    'onAnswersUpdate(user)'
  ];

  function generateIframeContent(htmlCode, jsCode) {
    return [
      '<html>',
      '  <body>',
      htmlCode,
      '    <script type="text/javascript">', //'//<![CDATA[window.onload=function(){',
      jsCode,
      //'    }//]]>',
      '    </script>',
      '  </body>',
      '</html>'
    ].join('\n');
  }

  function writeToIframe(iframe, content) {
    var doc = null;
    if (iframe.contentDocument) doc = iframe.contentDocument;
    else if (iframe.contentWindow) doc = iframe.contentWindow.document;
    else doc = iframe.document;
    doc.open();
    doc.writeln(content);
    doc.close();
  }

  app.executer = function() {
    console.log('run!');
    var fn = Function(this.myAnswers.jsCode);
    fn();
  };

  app.onResultChange = function(innerHTML){
    console.log('onResultChange', innerHTML);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://httpbin.org/get');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        alert(xhr.responseText == innerHTML ? 'bravo!' : 'essaye encore');
      }
    };
    xhr.send(null);
  };

  app.onAnswersUpdate = function(update){
    //console.log('onAnswersUpdate', update);
    if (!this.myAnswers) return;
    Polymer.dom(document).querySelector('#testContainer').innerHTML = this.myAnswers.htmlCode;
    //Polymer.dom(document).querySelector('#testScriptContainer').innerHTML = this.myAnswers.jsCode; // does not re-run javascript code on update
    //eval(this.myAnswers.jsCode); // very unsafe
    //var iframe = document.getElementById('testIframe');
    //var iframeContent = generateIframeContent(this.myAnswers.htmlCode, this.myAnswers.jsCode);
    //writeToIframe(iframe, iframeContent)
    this.hashedAnswers = JSON.stringify([ this.user, this.myAnswers ]);
  }

})(document);
