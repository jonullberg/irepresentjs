'use strict';

var mognoose = require('mongoose');
var bodyparser = require('body-parser');

module.exports = function(router, passport) {
	router.user(bodyparser.json());

	router.post('/sign_in', function(req, res) {
		if (err) {
			console.log(err);
			return res.status(500).json({msg: 'internal server error'});
		}

		res.json({success: true, msg: 'sign in success'})
	});
};