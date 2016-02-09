/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  /*
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    app.baseUrl = '/js-exo-ajax/';
  }
  */

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.title = 'Javascript Exo - Ajax';
  app.loggedIn = false; // init default value, to be set by google-signin
  app.user = null;
  app.hashedAnswers = null;

  app.handleAjaxRequest = function() {
    console.log("Ajax Request:", arguments);
  };

  app.handleAjaxError = function() {
    console.log("Ajax Error:", arguments);
  };

  app.handleAjaxResponse = function() {
    console.log("Ajax Response:", arguments);
  };

  window.addEventListener('google-signin-success', function() {
    console.log('Loggedin');
    var user = gapi.auth2.getAuthInstance().currentUser.get();
    var profile = user.getBasicProfile();
    app.user = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      token: user.getAuthResponse().id_token
    };
    var hash = JSON.stringify([ app.user.id, app.user.name, app.user.email ]);
    try {
      app.$.studentCookie.value = hash;
      var cookie = app.$.studentCookie.createCookie();
      var cookieValue = app.$.studentCookie.readCookie();
      console.log(hash, app.$.studentCookie.value, cookieValue);
      if (decodeURIComponent(cookieValue) != hash) {
        throw new Error("incorrect cookie");
      }
      app.$.ajaxReq.generateRequest(); // => will call handleAjaxResponse() on successful server response
    } catch(e) {
      console.error(e);
      alert('Veuillez activer les cookies dans votre navigateur puis essayez à nouveau.');
    }
  });

  /*
  // TODO: FOR PUBLIC TESTING => disable the following lines to activate Google Login

  app.loggedIn = true;
  app.user = {
    id: 1,
    name: 'Demo User',
    email: 'demo-user@example.com',
    token: 'XXX'
  };
  */

})(document);
