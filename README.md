Running in production at: [js-partiel-1.herokuapp.com](https://js-partiel-1.herokuapp.com)

**(Only people who have a Google Account registered at EEMI.com can log in)**

Features:

- 100% paperless examination software, 100% online;
- designed for automated testing and evaluation of students' answers;
- students are identified using their Google Apps account;
- different variants of exercises for each student, to reduce and detect fraud;
- multiple choice questions;
- two exercises in which students have to submit javascript code;
- answers and user data are hashed into a JSON object that can be submitted by email;
- student's answers are kept at all times in browser's local storage, to prevent data loss;
- beautiful UI thanks to Google Polymer and Material Design.

TODO:

- Make it possible to use without login, for demonstration purposes
- Define tests
- Fix the app.genExercise() so that the USER ID (used to decide the variant of each exercise) fits into an integer

Usage:

- Run `server.sh`
- Open [localhost:8000](http://localhost:8000)

For each exercise that you want to add:

- Add the question as `<section data-route="exercise1">...` in index.html
- Add QCM options as a stringified JSON without whitespace, and using `"` around keys and values
- Add the menu item as `<a data-route="exercise1" href="{{baseUrl}}ex1">...` in index.html
- Add the route as `page('/ex2', function(data) { app.route = 'exercise2'; });` in routing.html
- You can optionally set defaults in `this.myAnswers` from app.js

Javascript console tips:

- use `JSON.parse(localStorage['my-answers']);` in to display state of local storage data
- use `localStorage.clear();` to reset the local storage data
