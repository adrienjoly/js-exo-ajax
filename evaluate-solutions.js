var basicCSV = require('basic-csv');

// fields
var DATE = 0,
    IP = 1,
    METHOD = 2,
    OK_VALUE = 3,
    EMAIL_VALUE = 4,
    COOKIE = 5,
    EXPECTED_NUMBER = 6;

var NAME_IN_COOKIE = 1,
    EMAIL_IN_COOKIE = 2;

function parseRequest(row) {
  var cookie = row[COOKIE] ? JSON.parse(row[COOKIE]) : [];
  return {
    date: new Date(row[DATE]),
    ip: row[IP],
    method: row[METHOD],
    okValue: row[OK_VALUE],
    emailValue: row[EMAIL_VALUE],
    cookie: cookie,
    studentName: cookie[NAME_IN_COOKIE],
    studentEmail: cookie[EMAIL_IN_COOKIE],
    expectedNumber: row[EXPECTED_NUMBER] // will be re-evaluated and while parsing solutions file
  };
}

function parseSolution(row) {
  var cookie = row[1] ? JSON.parse(row[1]) : [];
  return {
    date: new Date(row[0]),
    cookie: cookie,
    answer: row[2],
    js: row[3],
    studentName: cookie[NAME_IN_COOKIE],
    studentEmail: cookie[EMAIL_IN_COOKIE],
  };
}

/*
var EXPECTED_OK_VALUE = 1; // for group 1 only

function scoreRequest(req) {
  return [
    1, // 1 point for having succeeded a HTTP request on the right URL
    req.method == 'POST',
    req.okValue == EXPECTED_OK_VALUE,
    req.emailValue == req.cookie[EMAIL_IN_COOKIE],
    // req. // TODO
  ]
}
*/

function indexLastByEmail(requests) {
  var studentReq = {};
  requests.forEach(function(req) {
    if (req.studentEmail)
      studentReq[req.studentEmail] = req;
  });
  return studentReq;
}

function displayStudentsWithRequest(group) {
  var path = './solutions/';
  var csvOptions = { dropHeader: true }
  basicCSV.readCSV(path + 'requests-group' + group + '.csv', csvOptions, function(err, rows) {
    if (err) throw err;
    var studentReq = indexLastByEmail(rows.map(parseRequest));
    console.log('group', group, 'student requests:', Object.keys(studentReq).length);
    basicCSV.readCSV(path + 'solutions-group' + group + '.csv', csvOptions, function(err, rows) {
      if (err) throw err;
      var studentSol = indexLastByEmail(rows.map(parseSolution));
      console.log('group', group, 'student solutions:', Object.keys(studentSol).length);
    });
  });
}

displayStudentsWithRequest(1); // => 8 students (2 could not participate)
displayStudentsWithRequest(2); // => 14 students
displayStudentsWithRequest(3); // => 15 students
