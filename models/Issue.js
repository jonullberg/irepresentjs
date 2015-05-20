'use strict';

var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
	author_id: String,
	title: String,
	content: String,
	votes: { type: Object,
		up: {type: Number},
		down: {type: Number},
		total: {type: Number}
	},
	date_created: Number
});

issueSchema.methods.updateVoteTotal = function() {
	this.votes.total = this.votes.up + this.votes.down ;
};

module.exports = mongoose.model('Issue', issueSchema);