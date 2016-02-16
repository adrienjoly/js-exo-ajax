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

var EXPECTED_OK_VALUE = 1; // for group 1 only

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
/*
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

function displayStudentsWithRequest(filename) {
  basicCSV.readCSV(filename, {
    dropHeader: true
  }, function (error, rows) {
    var studentReq = {};
    rows.forEach(function(row) {
      var req = parseRequest(row);
      if (req.studentEmail)
        studentReq[req.studentEmail] = req;
    });
    console.log(Object.keys(studentReq), Object.keys(studentReq).length);
  });
}

//displayStudentsWithRequest("./solutions/requests-group1.csv"); // => 8 students (2 could not participate)
//displayStudentsWithRequest("./solutions/requests-group2.csv"); // => 14 students
//displayStudentsWithRequest("./solutions/requests-group3.csv"); // => 15 students
