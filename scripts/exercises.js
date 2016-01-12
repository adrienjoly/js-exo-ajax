(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // initialize myAnswers using iron-localstorage (only if not found in localstorage)
  app.initDefaults = function(ev) {
    console.log("app.initDefaults");
    this.myAnswers = {
      qcm1: '',
      qcm2: '',
      qcm3: '',
      qcm4: '',
      //code: "function(){\n\n}",
      code1: [
        "document.getElementById('formulaire').onsubmit = function (evt) {",
        "  /* saisissez votre code entre les accolades */",
        "};"
      ].join('\n'),
      code2: [
        "var results = document.getElementsByClassName('res');",
        "for (var i=0; i<results.length; ++i) {",
        "  var element = results[i];",
        "}"
      ].join('\n')
    }
  };

  app.renderData = function(user, qcm1, qcm2, qcm3, qcm4, code1, code2) {
    // warning: if one of the parameters is not initialized, this function does not work
    return JSON.stringify([user, qcm1, qcm2, qcm3, qcm4, code1, code2]);
  };

})(document);
