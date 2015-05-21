'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

var issueSchema = mongoose.Schema({
	title: String,
	content: String,
	author_id: String,
	date_created: {type: Date, default: Date().now}
});

module.exports = mongoose.model('Issue', issueSchema);