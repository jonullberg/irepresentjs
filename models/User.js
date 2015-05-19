'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = mongoose.Schema({
	basic: {
		email: { type: String, unique: true },
		password: String
	}
});

userSchema.methods.generateHash = function(password, callback) {
	bcyrpt.genSalt(8, function(err, salt) {
		bcrypt.hash(password, salt, null, function(err, hash) {
			return callback(err, hash);
		});
	});
};

module.exports = mongoose.model('User', userSchema);