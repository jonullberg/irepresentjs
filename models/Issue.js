'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

var issueSchema = mongoose.Schema({
	title: String,
	content: String,
	author_id: String,
	date_created: {type: Date, default: Date().now }
});

issueSchema.methods.tallyVotes = function(issue, user_id, callback) {
	var total = 3;
	var count = 0;
	Vote.count({ 'issue_id': this._id, 'vote': true }, function (err, count) {
		issue.votes_up = count;
		runCallback();
	});
	Vote.count({ 'issue_id': this._id, 'vote': false }, function (err, count) {
		issue.votes_down = count;
		runCallback();
	});
	Vote.count({ 'issue_id': this._id }, function (err, count) {
		issue.votes_total = count;
		runCallback();
	});

	function runCallback() {
		count++;
		if (count === total) {
			console.log(issue);
			// callback();
		}
	}
	//this.user_vote (Boolean) Undefined if not vote
};

module.exports = mongoose.model('Issue', issueSchema);