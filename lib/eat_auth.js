'use strict';

var eat = require('eat');
var User = require('../models/User');
eat.salt = new Buffer('my new salt');
eat.iv = new Buffer('1234567890123456'); //this string isn't actullay 32 bytes 

module.exports = function(secret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) {
			console.log('Unauthorized: No token in request');
			return res.status(401).json({ 
				'success': false,
				'msg': 'Not authorized' 
			});
		}

		eat.decode(token, secret, function(err, decoded) {
			if(err) {
				console.log(err);
				return res.status(401).json({ 
					'success': false,
					'msg': 'Not authorized' 
				});
			}

			User.findOne({ _id: decoded.id }, function(err, user) {
				if(err) {
					console.log(err);
					return res.status(401).json({ 
						'success': false,
						'msg': 'Not authorized' 
					});
				}

				req.user = user;
				next();
			});
		});
	};
};