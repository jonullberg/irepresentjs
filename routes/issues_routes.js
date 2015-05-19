'use strict';

var bodyparser = require('body-parser');
var Issue = require('../models/Issue');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET)

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
		if (req.query.sort === 'newest') { //Check if newest sort
			console.log('newest sort');
		} else { //Default of popular sort
			console.log('popular sort');
		}
		res.json({
			success: false, 
			msg: 'Finish this part'
		});
	});
};