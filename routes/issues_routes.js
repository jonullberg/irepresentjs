'use strict';

var bodyparser = require('body-parser');
var Issue = require('../models/Issue');

module.exports = function(router) {
	router.use(bodyparser.json());

	router.post('/issues', function(req, res) {
		var newIssue = new Issue(req.body.issue);
		newIssue.save(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json(success: false, msg: 'internal server error');
			}
			res.json(success: true, msg: 'New Issue Created');
		});
	});

	router.get('/issues/users/:uid', function(req, res) {
		var user = req.user;
		console.log(user);
		res.json(success: false, msg: 'Finish this part');
	});
};