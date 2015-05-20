'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

var issueSchema = mongoose.Schema({
	title: String,
	content: String,
	author_id: String,
	date_created: Number
});

issueSchema.methods.add = function() {
	//Jonathan
	//Fill me in based on what Randy is sending us
};

issueSchema.methods.tallyVotes = function(issue, user_id) {
	issue.votes_up = Vote.where({ 'issue_id': this._id, 'vote': true }).count();
	issue.votes_down = Vote.where({ 'issue_id': this._id, 'vote': false }).count();
	issue.votes_total = Vote.where({ 'issue_id': this._id }).count();
	//this.user_vote (Boolean) Undefined if not vote
};

module.exports = mongoose.model('Issue', issueSchema);