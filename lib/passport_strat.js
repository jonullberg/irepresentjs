'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var passport = require('passport');
var User = require('../model/User');

module.exports = function(passport) {
	passport.use('basic', new BasicStrategy({}, function(email, password, done) {
		User.findOne({ 'basic.email': email }, function(err, user) {
			if(err) return done('Database error');

			if(!user) return done('No such user');

			user.checkPassword(password, function(err, res) {
				if(!res) return done('Wrong Password');

				return done(null, user);
			});
		});
	}));
};