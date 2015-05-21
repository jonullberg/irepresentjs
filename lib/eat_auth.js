'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(secret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) {
			console.log('Unauthorized: No token in request');
			return res.status(401).json({ 
				'success': false,
				'msg': 'Not authorized 1' 
			});
		}

		eat.decode(token, secret, function(err, decoded) {
			if(err) {
				console.log(err);
				return res.status(401).json({ 
					'success': false,
					'msg': 'Not authorized 2' 
				});
			}

			User.findOne({ _id: decoded.id }, function(err, user) {
				if(err) {
					console.log(err);
					return res.status(401).json({ 
						'success': false,
						'msg': 'Not authorized 3' 
					});
				}
				if (!user) {
					console.log('No user');
					return res.status(401).json({ 
						'success': false,
						'msg': 'Not authorized 4' 
					});
				}
				req.user = user;
				next();
			});
		});
	};
};