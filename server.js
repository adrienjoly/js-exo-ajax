// inspired from http://code.runnable.com/Umgo967vRZQMAABQ/a-simple-webserver-with-connect-for-node-js

var http = require('http');
var connect = require('connect');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');

var PORT = process.env.PORT || 8080;

function logRequest(cookie, body) {
  var Spreadsheet = require('google-spreadsheet-append-es5');
  var spreadsheet = Spreadsheet({
    auth: {
      email: "login-logger@eemi-own-exam.iam.gserviceaccount.com", // <= https://console.developers.google.com/permissions/serviceaccounts?project=eemi-own-exam&authuser=1
      keyFile: "google-drive-key.pem"
    },
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

// /tweet is a POST API endpoint for users to connect and send messages
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

app.use(function (req, response, next) {
  console.log('invalid request from:', req.connection.remoteAddress);
  response.end('invalid request...\n');
  //return next();
});

// Listen for HTTP/HTTPS conncections on port 3000
//app.listen(PORT);
httpServer.listen(PORT);

console.log('Server running on port', PORT, '...');
//console.log('Try http://' + os.hostname() + '.local:' + PORT + '/'); // note: hostname is not reachable on EEMI LAN

