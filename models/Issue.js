'use strict';

var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
	title: String,
	content: String,
	author_id: String,
	date_created: {type: Date, default: Date().now }
});

issueSchema.methods.tallyVotes = function(user_id) {
	//Eeshan
	//Tally votes from vote db
	//this.votes_up
	//this.votes_down
	//this.votes_total
	//this.user_vote (Boolean) Undefined if not vote
};

module.exports = mongoose.model('Issue', issueSchema);