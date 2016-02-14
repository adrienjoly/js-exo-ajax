// inspired from http://code.runnable.com/Umgo967vRZQMAABQ/a-simple-webserver-with-connect-for-node-js

var http = require('http');
var connect = require('connect');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var Spreadsheet = require('google-spreadsheet-append-es5');

var PORT = process.env.PORT || 8080;

var GDRIVE_AUTH = {
  email: "login-logger@eemi-own-exam.iam.gserviceaccount.com", // <= https://console.developers.google.com/permissions/serviceaccounts?project=eemi-own-exam&authuser=1
  keyFile: "google-drive-key.pem"
};

function logRequest(cookie, body) {
  var spreadsheet = Spreadsheet({
    auth: GDRIVE_AUTH,
    fileId: "1W6oU4uEQycH9O5UXSmwzRp4j9Wr7IHueoNBEM6porNA" // => https://docs.google.com/spreadsheets/d/1W6oU4uEQycH9O5UXSmwzRp4j9Wr7IHueoNBEM6porNA/edit#gid=0
  });
  // append new row
  spreadsheet.add({
    timestamp: new Date(),
    cookie: cookie,
    body: body
  }, function(err, res){
    if (err) {
      console.error('storeLogin error:', err);
    }
  });
}

function logSolution(cookie, body, cb) {
  var spreadsheet = Spreadsheet({
    auth: GDRIVE_AUTH,
    fileId: "1rNft7ZoT-8ie1dDm-eMJBX_28Knc4VpOXuSNCfw6nJw" // => https://docs.google.com/spreadsheets/d/1rNft7ZoT-8ie1dDm-eMJBX_28Knc4VpOXuSNCfw6nJw/edit#gid=0
  });
  // append new row
  spreadsheet.add({
    timestamp: new Date(),
    cookie: cookie,
    answer: body.ajaxResponse,
    js: body.jsCode
  }, cb);
}

var allowCrossDomain = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); // TODO: reduce
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// Configure the app
var app = connect();
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false })); // parse urlencoded request bodies into req.body
app.use(bodyParser.json({ type: '*/*', strict: false })); // parse json request bodies into req.body
app.use(serveStatic('./public', {'index': ['index.html']})); // Serve public files

// Prepare socket.io server for public/log.html
var httpServer = http.createServer(app)
var io = socketio(httpServer);

// POST API endpoint used to test connection with server before accessing the exercise
app.use('/test', function (req, response, next) {
  var cookie = (req.cookies || {}).studentid;
  console.log('POST /test from:', req.connection.remoteAddress, cookie, req.body);
  logRequest(cookie, typeof req.body == "object" ? JSON.stringify(req.body) : req.body);
  var result = {
    hasCookie: !!cookie,
    hasBody: req.body && req.body.test
  };
  response.end(JSON.stringify(result));
  // display message on log.html
  //io.emit('chat', { message: req.body.message, ip: req.connection.remoteAddress });
});

// POST API endpoint used to test connection with server before accessing the exercise
app.use('/submit', function (req, response, next) {
  var cookie = (req.cookies || {}).studentid;
  console.log(req.method, req.url, 'from:', req.connection.remoteAddress);
  try {
    if (req.method.toUpperCase() != 'POST') throw Error('invalid request');
    console.info('cookie:', cookie);
    console.info('body:', typeof req.body, req.body);
    logSolution(cookie, req.body, function(err) {
      if (err) {
        console.error('logSolution error:', err);
        response.statusCode = 500; // internal server error
        response.end(err.message);
      } else {
        response.end('Votre solution est bien reçue. Merci !\n');
      }
    });
  } catch (e) {
    console.error('error:', e.message, e.stack);
    response.statusCode = 400; // or 405 = method not allowed
    response.end(e.message);
  }
});

app.use(function (req, response, next) {
  console.log(req.method, req.url, '=> invalid request from:', req.connection.remoteAddress);
  response.statusCode = 404;
  response.end('invalid request...\n');
  //return next();
});

// Listen for HTTP/HTTPS conncections on port 3000
//app.listen(PORT);
httpServer.listen(PORT);

console.log('Server running on port', PORT, '...');
//console.log('Try http://' + os.hostname() + '.local:' + PORT + '/'); // note: hostname is not reachable on EEMI LAN

