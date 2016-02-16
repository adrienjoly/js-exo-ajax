var basicCSV = require('basic-csv');
var csvOptions = { dropHeader: true };

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

function makeStudentEvaluator(expectedOkValue, defaultAnswer) {
  return function scoreStudent(sol, req) {
    var hasReq = !!req;
    return [
      hasReq, // 1 point for having succeeded a HTTP request on the right URL
      hasReq && req.method == 'POST',
      hasReq && req.okValue == expectedOkValue,
      hasReq && req.emailValue == req.cookie[EMAIL_IN_COOKIE],
      sol.answer == defaultAnswer || (hasReq && sol.answer == req.expectedNumber),
    ];
  }
}

function indexLastByEmail(requests) {
  var studentReq = {};
  requests.forEach(function(req) {
    if (req.studentEmail)
      studentReq[req.studentEmail] = req;
  });
  return studentReq;
}

function indexRequests(filename, cb) {
  basicCSV.readCSV(filename, csvOptions, function(err, rows) {
    if (err) return cb(err);
    cb(null, indexLastByEmail(rows.map(parseRequest)));
  });  
}

function indexSolutions(filename, cb) {
  basicCSV.readCSV(filename, csvOptions, function(err, rows) {
    if (err) return cb(err);
    cb(null, indexLastByEmail(rows.map(parseSolution)));
  });  
}

function toBinary(v) {
  return v ? 1 : 0;
}

function sum(a, b) {
  return a + b;
}

function GroupEvaluator(initialSumArray) {
  var nbStudents = 0;
  var pointsSum = initialSumArray;
  return {
    feedStudentPoints: function(array) {
      pointsSum = pointsSum.map(function(pointSum, i) {
        return pointSum + array[i];
      });
      ++nbStudents;
    },
    getMeanArray: function() {
      return pointsSum.map(function(pointSum) {
        return pointSum / nbStudents;
      });
    }
  }
}

function displayStudentsWithRequest(group, scoreStudent) {
  var groupEval = GroupEvaluator([0,0,0,0,0]);
  var path = './solutions/';
  indexRequests(path + 'requests-group' + group + '.csv', function(err, studentReq) {
    if (err) throw err;
    indexSolutions(path + 'solutions-group' + group + '.csv', function(err, studentSol) {
      if (err) throw err;
      console.log('group', group, 'student requests:', Object.keys(studentReq).length);
      console.log('group', group, 'student solutions:', Object.keys(studentSol).length);
      for (var email in studentSol) {
        var points = scoreStudent(studentSol[email], studentReq[email]).map(toBinary);
        groupEval.feedStudentPoints(points);
        //console.log(points, points.reduce(sum), email);
      }
      var meanArray = groupEval.getMeanArray()
      console.log('group', group, 'average:', meanArray, meanArray.reduce(sum));
    });
  });
}

displayStudentsWithRequest(1, makeStudentEvaluator(1, 777)); // => 8 requests / 20 solutions => avg: 0.85 => 0.95
displayStudentsWithRequest(2, makeStudentEvaluator(5, 444)); // => 14 requests / 20 solutions => avg: 0.75 => 0.95
displayStudentsWithRequest(3, makeStudentEvaluator(9, 111)); // => 15 students / 18 solutions => avg: 0.94 => 1.27

// WARNING: per-group student evaluators don't change the marks! => check ok and answer values
