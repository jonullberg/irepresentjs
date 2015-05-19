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

	router.get('/issues', eatAuth, function(req, res) {

		if (req.query.sort === 'newest') { //Check if newest sort
			console.log('newest sort');
			Issue.aggregate([
				{ $sort: { date_created: 1 } }
			], function(err, issueArray) {
				if(err) {
					console.log(err);
					return res.status(500).json({
						success: false, 
						msg: 'internal server error'
					});
				}
				//Add user vote to sorted array
				issueArray.forEach(getUserVote);

				//Return sorted array
				res.json({
					success: true,
					msg: 'Newest sort feed returned',
					data: issueArray
				});
			});
		} else { //Default of popular sort
			console.log('popular sort');
			//To do: Implement Emre's popular sort
			res.json({
					success: false,
					msg: 'Finish me'
				});
		}

		function getUserVote(issue) {
			var userVote = req.user.getUserVote(issue._id);
			if (userVote === undefined) { return; }
			issue.user_vote = userVote;
		}
	});
};