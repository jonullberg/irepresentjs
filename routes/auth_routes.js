'use strict';

var User = require('../models/User');
var bodyparser = require('body-parser');
var passport = require('passport');

module.exports = function(router, passport) {
	router.use(bodyparser.json());

	router.post('/users', function(req, res) {
		var newUserData = JSON.parse(JSON.stringify(req.body));
		delete newUserData.email;
		delete newUserData.password;
		var newUser = new User(newUserData);
		newUser.basic.email = req.body.email;
		newUser.generateHash(req.body.password, function(err, hash) {
			if(err) {
				console.log(err);
				return res.status(500).json({
					'success': false,
					'msg': 'Could not create user' 
				});

			}
			newUser.basic.password = hash;
			newUser.save(function(err, user) {
				if(err) {
					console.log(err);
					return res.status(500).json({
						'success': false,
						'msg': 'Could not create user' 
					});
				}
				user.generateToken(process.env.APP_SECRET, function(err, token) {
					if(err) {
						console.log(err);
						return res.status(500).json({
							'success': false,
							'msg': 'Error generating token' 
						});
					}

					res.json({
						'success': true,
						'msg': 'You have succesfully created a user',
						'data': {
							'token': token,
							'id': user._id
						}
					});
				});
			});
		});
	});
};