'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: '{PATH} is required.'
	},
	password: {
		type: String,
		required: '{PATH} is required.'
	},
	email: {
		type: String,
		required: '{PATH} is required.'
	},
	basic: {
		email: String,
		password: String,
	}
	votes: Array	
});

userSchema.methods.generateHash = function(password, callback) {
	bcyrpt.genSalt(8, function(err, salt) {
		bcrypt.hash(password, salt, null, function(err, hash) {
			return callback(err, hash);
		});
	});
};

var User = mongoose.model('User', userSchema);

User.schema.path('email').validate(function(value) {

});

module.exports = User;


var Toy = mongoose.model('Toy', toySchema);

Toy.schema.path('color').validate(function (value) {
  return /blue|green|white|red|orange|periwinkle/i.test(value);
}, 'Invalid color');

module.exports = mongoose.model('User', userSchema);