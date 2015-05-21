'use strict';

var Vote = require('../models/Vote');
var User = require('../models/User');
var randalizeDate = require('../lib/randalizeDate');

module.exports = function(issueObj, user_id, callback) {
	var totalAsyncCalls = 5;
	var ayncCount = 0;

	//Add votes_up and votes_down count
	[true, false].forEach(function(bool) {
		Vote.count({ 'issue_id': issueObj._id, 'vote': bool }, function (err, count) {
			/* jshint expr: true */
			bool ? issueObj.votes_up = count : issueObj.votes_down = count;
			checkCount();
		});
	});

	//Add votes_total count
	Vote.count({ 'issue_id': issueObj._id }, function (err, count) {
		issueObj.votes_total = count;
		checkCount();
	});

	//Add user_vount
	Vote.findOne({ 'issue_id': issueObj._id, 'user_id': user_id}, function (err, vote) {
		if (!vote) {
			issueObj.user_vote = null;
		} else if (vote.vote) {
			issse.user_vote = 'yes';
		} else {
			issueObj.user_vote = 'no';
		}
		checkCount();
	});

	//Change author id to author username
	User.findOne({ '_id': user_id}, function (err, user) {
		issueObj.author_id = user.username;
		checkCount();
	});

	//Randalize Date
	issueObj.date_created = randalizeDate(issueObj.date_created);

	function checkCount() {
		ayncCount++;
		if (ayncCount === totalAsyncCalls) {
			callback();
		}
	}
};