'use strict';

var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
	author_id: String,
	title: String,
	content: String,
	votes: {
		up: {type: Number},
		down: {type: Number}
	},
	date_created: Number
});

module.exports = mongoose.model('Issue', issueSchema);