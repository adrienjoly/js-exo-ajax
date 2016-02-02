(function(document) {
  'use strict';

  var app = document.querySelector('#app');


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
