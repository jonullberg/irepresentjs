'use strict';

var mongoose = require('mongoose');

var issueSchema = mongoose.schema({
	author_id: Number,
	title: String,
	content: String,
	votes: {
		up: Number,
		down: Number
	},
	date_created: String
});

issueSchema.methods.

module.exports = mongoose.model('Issue', issueSchema);