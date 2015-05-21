'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

var issueSchema = mongoose.Schema({
	title: { type: String, required: '{TITLE is required}' },
	content: {type: String, required: '{CONTENT is required}' },
	author_id: String,
	date_created: {type: Date, default: Date() }
});

module.exports = mongoose.model('Issue', issueSchema);