'use strict';

var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
	issue_id: String,
	user_id: String,
	vote: { type: Boolean, required: '{VOTE is required}' }
});

module.exports = mongoose.model('Vote', voteSchema);