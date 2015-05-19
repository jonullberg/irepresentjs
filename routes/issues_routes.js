'use strict';

var bodyparser = require('body-parser');
var Issue = require('../models/Issue');
var eatAuth = require('../lib/eat_auth');

module.exports = function(router) {
	router.use(bodyparser.json());

	router.post('/issues', eatAuth, function(req, res) {
		var newIssue = new Issue(req.body.issue);
		newIssue.author_id = req.user._id;
		newIssue.save(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(500).json({
					success: false, 
					msg: 'internal server error'
				});
			}
			res.json({
				success: true, 
				msg: 'New Issue Created'
			});
		});
	});

	router.get('/issues', function(req, res) {
		var user = req.user;
		console.log(user);
		res.json({
			success: false, 
			msg: 'Finish this part'
		});
	});
};