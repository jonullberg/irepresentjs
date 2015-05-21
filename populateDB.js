//Run with 'node populateDB.js' call
'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_dev';

var mongoose = require('mongoose');
var User = require('./models/User');
var Issue = require('./models/Issue');
var Vote = require('./models/Vote');
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
	  date_created: new Date(2013, 11, 11),
	  up_votes: 10,
	  down_votes: 2
	}, {
	  title: "issue002",
	  content: "ut also the leap into electronic t",
	  date_created: new Date(2010, 11, 11),
	  up_votes: 3,
	  down_votes: 1
	}, {
	  title: "issue003",
	  content: "Latin words, consectetur, from a Lore",
	  date_created: new Date(2015, 11, 11),
	  up_votes: 50,
	  down_votes: 4
	}, {
		title: 'issue004', 
		content: 'I approve of testing. Let us do more!',
	  date_created: new Date(2011, 11, 11),
	  up_votes: 5,
	  down_votes: 30
	}
];

function createUsers(usersArray, callback) {
	var total = usersArray.length;
	var count = 0;

	usersArray.forEach(function(userObj) {
		saveUser(userObj, checkCount);
	});

	function checkCount(err, data) {
		count++;
		if (!err) { testUser = data; }
		if (count === total) {
			if (!testUser) {
				console.log('No user created. Quitting');
				return callback(true);
			}
			console.log('calling createIssues with user: ' + testUser.username);
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
		if(err) {	
			console.log('Could not create hash: ' + err);
			return callback(err);
		}
		newUser.basic.password = hash;
		newUser.save(function(err, data) {
			if(err) { 
				console.log('Could not save user: ' + err); 
				return callback(err);
			}
			console.log(data.username + ' created');
			return callback(null, data);
		});
	});
}

function createIssues(issuesArray, callback) {
	var total = issuesArray.length;
	var count = 0;

	issuesArray.forEach(function(issueObj) {
		saveIssue(issueObj, testUser, checkCount);
	});

	function checkCount(err, data) {
		count++;
		//Save votes
		if (!err) {
			//Write a createVotes function that saves votes
		}
		if (count === total) {
			callback();
		}
	}
}

function saveIssue(issue, user, callback) {
	issue.author_id = user._id;
	var newIssue = new Issue(issue);
	newIssue.save(function(err, data) {
		if (err) { 
			console.log('Could not save issue: ' + err);
			return callback(err);
		}
		console.log(data.title + ' issue created');
		saveVote(issue._id, user._id, true, callback);
	});
}

function createVotes() {
	//Write me
}

function saveVote(issue_id, user_id, vote, callback) {
	var newVote = new Vote({
		issue_id: issue_id,
		user_id: user_id,
		vote: vote
	});
	newVote.save(function(err, data) {
		if(err) { 
			console.log('Could not save vote: ' + err);
			return callback(err);
		}
		callback(null, data);
	});
}

mongoose.connect(process.env.MONGOLAB_URI, function() {
	console.log('Opened connection to MongoDB');

	createUsers(usersArray, function(err) {
		if (err) {
			return closeConnection();
		}

		createIssues(issuesArray, function() {
			return closeConnection();
		});
	});
});

function closeConnection() {
	mongoose.connection.close(function() {
		console.log('Closed connection to MongoDB');
	});
}