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

var GSHEET_LOGINS = '1W6oU4uEQycH9O5UXSmwzRp4j9Wr7IHueoNBEM6porNA'; // => https://docs.google.com/spreadsheets/d/1W6oU4uEQycH9O5UXSmwzRp4j9Wr7IHueoNBEM6porNA/edit#gid=0
var GSHEET_REQUESTS = '1IGwxMLqlKmpjVPkuB8dPAzWMhEuRSb7cK1J6nnbbjIM';
var GSHEET_SOLUTIONS = '1rNft7ZoT-8ie1dDm-eMJBX_28Knc4VpOXuSNCfw6nJw'; // => https://docs.google.com/spreadsheets/d/1rNft7ZoT-8ie1dDm-eMJBX_28Knc4VpOXuSNCfw6nJw/edit#gid=0

function logToSheet(fileId, rowObj, cb) {
  var spreadsheet = Spreadsheet({
    auth: GDRIVE_AUTH,
    fileId: fileId // => https://docs.google.com/spreadsheets/d/<<fileId>>/edit#gid=0
  });
  rowObj.timestamp = new Date();
  // append new row
  spreadsheet.add(rowObj, cb || function(err, res){
    if (err) {
      console.error('logToSheet error:', err);
    }
  });
}

function logLoginTest(cookie, body, cb) {
  logToSheet(GSHEET_LOGINS, {
    cookie: cookie,
    body: body
  }, cb);
}

function logApiRequest(rowObj, cb) {
  logToSheet(GSHEET_REQUESTS, rowObj, cb);
}

function logSolution(cookie, body, cb) {
  logToSheet(GSHEET_SOLUTIONS, {
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
  console.log('POST /test from:', req.connection.remoteAddress /*, cookie, req.body*/);
  logLoginTest(cookie, typeof req.body == "object" ? JSON.stringify(req.body) : req.body);
  var result = {
    hasCookie: !!cookie,
    hasBody: req.body && req.body.test
  };
  response.end(JSON.stringify(result));
  // display message on log.html
  //io.emit('chat', { message: req.body.message, ip: req.connection.remoteAddress });
});

// http://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function hashCode(str){
  var hash = 0;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/*
function HttpError(message, code) {
  this.name = 'HttpError';
  this.message = message;
  this.code = code;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
*/

// POST API endpoint used by student, according to exercise
app.use('/api', function (req, response, next) {
  var cookie = (req.cookies || {}).studentid;
  console.log(req.method, req.url, 'from:', req.connection.remoteAddress);
  var nombre = hashCode((req.body || {}).email || '') || 777;
  logApiRequest({
    addr: req.connection.remoteAddress,
    method: req.method,
    ok: (req.body || {}).ok,
    email: (req.body || {}).email,
    cookie: cookie,
    expectednumber: nombre
  });
  //cookie = cookie ? JSON.parse(cookie) : [];
  try {
    console.info('cookie:', cookie);
    console.info('body:', typeof req.body, req.body);
    if (req.method.toUpperCase() != 'POST') throw Error('méthode non acceptée'); //, 405);
    if (typeof req.body != 'object') throw Error('le contenu n\'est pas en JSON');
    if (req.body.ok != 1) throw Error('la propriété ok du contenu doit valoir 1');
    if (!req.body.email) throw Error('propriété email non trouvée');
    //if (req.body.email.toLowerCase() != cookie[2]) throw Error('la propriété email doit contenir votre adresse email'); // fonctionne seulement si executé depuis le site d'examen
    response.end(JSON.stringify({
      nombre: nombre,
      message: 'bravo! votre requête fonctionne bien!'
    }));
  } catch (e) {
    console.error('error:', e.message/*, e.stack*/);
    response.statusCode = /*e.code ||*/ 400;
    response.end(JSON.stringify({
      nombre: nombre,
      message: e.message
    }));
  }
});

// POST API endpoint used to submit student's solutions
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

