(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  app.genExercise = function(number) {
    return './ex' + number + '.md';
  };

  var DEFAULT_ANSWERS = {
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

  app.onAnswersUpdate = function(update){
    //console.log('onAnswersUpdate', update);
    this.hashedAnswers = JSON.stringify([ this.user, this.myAnswers ]);
  }

})(document);
