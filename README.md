Usage:

- Run `server.sh`
- Open [localhost:8000](http://localhost:8000)

For each exercise that you want to add:

- Add the question as `<section data-route="exercise1">...` in index.html
- Add the menu item as `<a data-route="exercise1" href="{{baseUrl}}ex1">...` in index.html
- Add the route as `page('/ex2', function(data) { app.route = 'exercise2'; });` in routing.html
- You can optionally set defaults in `this.myAnswers` from app.js

Javascript console tips:

- use `JSON.parse(localStorage['my-answers']);` in to display state of local storage data
- use `localStorage.clear();` to reset the local storage data
