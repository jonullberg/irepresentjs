'use strict';

var eat = require('eat');
var User = require('../model/User');

module.exports = function(secret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) {
			console.log('Unauthorized: No token in request');
			return res.status(401).json({ msg: 'Not authorized' });
		}

		eat.decode(token, secret, function(err, decoded) {
			if(err) {
				console.log(err);
				return res.stats(401).json({ msg: 'Not authorized' });
			}

			User.findOne({ _id: decoded.id }, function(err, user) {
				if(err) {
					console.log(err);
					return res.status(401).json({ msg: 'Not authorized' });
				}

				req.user = user;
				next();
			});
		});
	}
};