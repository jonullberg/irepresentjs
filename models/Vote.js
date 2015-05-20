'use strict';

var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
	issue_id: String,
	user_id: String,
	vote: String
});

voteSchema.methods.add = function(issue_id, user_id, vote) {
	//Jonathan
	this.issue_id = issue_id;
	this.user_id = user_id;
	this.vote = vote;
};

module.exports = mongoose.model('Vote', voteSchema);