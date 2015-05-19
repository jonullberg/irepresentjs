//Run with 'node populateDB.js' call
'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_dev';

var mongoose = require('mongoose');
var User = require('./models/User');
var Issue = require('./models/Issue');
var testUser;

var usersArray = [
	{
		username: 'testuser1',
		email: 'testuser1@example.com',
		password: 'password'
	}, {
		username: 'testuser2',
		email: 'testuser2@example.com',
		password: 'password'
	}, {
		username: 'testuser3',
		email: 'testuser3@example.com',
		password: 'password'
	}, 
];

var issuesArray = [
	{
	  title: "issue001",
	  content: "imply dummy text of the printing",
	  votes: {
		  up: 3,
		  down: 8
	  },
	  date_created: "20150101"
	}, {
	  title: "issue002",
	  content: "ut also the leap into electronic t",
	  votes: {
		  up: 45,
		  down: 21
	  },
	  date_created: "20150201"
	}, {
	  title: "issue003",
	  content: "Latin words, consectetur, from a Lore",
	  votes: {
	    up: 32,
	    down: 811
	  },
	  date_created: "20150301"
	}, {
		title: 'issue004', 
		content: 'I approve of testing. Let us do more!', 
		votes: {
			up: 1,
			down: 0
		},
		date_created: '20150511'
	}
];
	
function createUsers(usersArray, callback) {
	var total = usersArray.length;
	var count = 0;

	usersArray.forEach(function(userObj) {
		saveUser(userObj, function(user) {
			console.log(user.username + ' created');
			checkCount(user);
		})
	});

	function checkCount(user) {
		count++;
		if (count === total) {
			testUser = user;
			console.log('calling createIssues with user: ' + user.username);
			callback();
		}
	}
}

function createIssues(issuesArray, callback) {
	var total = issuesArray.length;
	var count = 0;

	issuesArray.forEach(function(issueObj) {
		saveIssue(issueObj, testUser, function() {
			console.log(issueObj.title + ' created');
			checkCount();
		})
	});

	function checkCount() {
		count++;
		if (count === total) {
			callback();
		}
	}
}

function saveUser(user, callback) {
	var newUser = new User({
		username: user.username,
		basic: {
			email: user.email
		}
	});

	newUser.generateHash(user.password, function(err, hash) {
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

mongoose.connect(process.env.MONGOLAB_URI, function() {
	console.log('Opened connection to MongoDB');
	createUsers(usersArray, function() {
		createIssues(issuesArray, function() {
			mongoose.connection.close(function() {
				console.log('Closed connection to MongoDB');
			});
		});
	});
});