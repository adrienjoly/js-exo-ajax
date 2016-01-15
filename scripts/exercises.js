(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // returns 0, 1 or 2, depending on the value of number
  function variant3 (number) {
    return number % 3;
  }

  // returns 0, 1, 2 or 3, depending on the value of number
  function variant4 (number) {
    return number % 4;
  }

  app.genExercise = function(number, user) {
    //console.log('genExercise', number, user);
    if (!user || !user.id) return;
    if (number == 2) {
      return './ex2-' + variant3(user.id) + '.md';
    } else if (number == 3) {
      return './ex3-' + variant4(user.id) + '.md';
    }
  };

  // testing from console:
  // document.querySelector('#app').set('user', {id: 0});

  var DEFAULT_ANSWERS = {
    qcm1: '',
    qcm2: '',
    qcm3: '',
    qcm4: '',
    //code: "function(){\n\n}",
    code1: '',
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
