'use strict';

var mongoose = require('mongoose');
var User = require('./models/User');
var Issue = require('./models/Issue');

//Create users sync
var testUser1;
var testUser2;
var testUser3;

var testIssue1 = {
  title: "issue001",
  content: "imply dummy text of the printing",
  votes: {
	  up: 3,
	  down: 8
  },
  date_created: "01/01/2015"
}
var testIssue2 = {
  title: "issue002",
  content: "ut also the leap into electronic t",
  votes: {
	  up: 45,
	  down: 21
  },
  date_created: "02/01/2015"
}
var testIssue3 = {
  title: "issue003",
  content: "Latin words, consectetur, from a Lore",
  votes: {
    up: 32,
    down: 811
  },
  date_created: "03/01/2015"
}
var testIssue4 = {
	title: 'issue004', 
	content: 'I approve of testing. Let us do more!', 
	votes: {
		up: 1,
		down: 0
	},
	date_created: '05/11/2015'
};
	
function createUsers(callback) {
	var total = 3;
	var count = 0;
	createUser('testuser1', 'testuser1@example.com', 'password', function(user) {
		testUser1 = user;
		console.log('user1 created');
		checkCount();
	});
	createUser('testuser2', 'testuser2@example.com', 'password', function(user) {
		testUser2 = user;
		console.log('user2 created');
		checkCount();
	});
	createUser('testuser3', 'testuser3@example.com', 'password', function(user) {
		testUser3 = user;
		console.log('user3 created');
		checkCount();
	});

	function checkCount() {
		count++;
		if (count === total) {
			console.log('calling createIssues');
			callback();
		}
	}
}

function createIssues(callback) {
	var total = 4;
	var count = 0;

	saveIssue(testIssue1, testUser1, function() {
		console.log('issue1 created');
		checkCount();
	});
	saveIssue(testIssue2, testUser2, function() {
		console.log('issue2 created');
		checkCount();
	});
	saveIssue(testIssue3, testUser3, function() {
		console.log('issue3 created');
		checkCount();
	});
	saveIssue(testIssue4, testUser1, function() {
		console.log('issue4 created');
		checkCount();
	});

	function checkCount() {
		count++;
		if (count === total) {
			callback();
		}
	}
}

function createUser(username, email, password, callback) {
	var newUser = new User({
		username: username,
		basic: {
			email: email
		}
	});

	newUser.generateHash(password, function(err, hash) {
		if(err) {	return console.log('Could not create hash: ' + err); }
		newUser.basic.password = hash;
		newUser.save(function(err, data) {
			if(err) { console.log('Could not save user: ' + err); }
			callback(data);
		});
	});
}

function saveIssue(issue, user, callback) {
	issue.author_id = user._id;
	var newIssue = new Issue(issue);
	newIssue.save(function(err, data) {
		if (err) { console.log('Could not save issue: ' + err); }
		callback(data);
	})
}

mongoose.connect('mongodb://localhost/irepresent_dev', function() {
	console.log('Opened connection to MongoDB');
	createUsers(function() {
		createIssues(function() {
			mongoose.connection.close(function() {
				console.log('Closed connection to MongoDB');
			});
		});
	});
});