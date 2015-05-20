'use strict';

var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var Issue = require('../models/Issue');
var Vote = require('../models/Vote');

module.exports = function(router) {
	router.use(bodyparser.json());

	router.post('/issues', eatAuth, function(req, res) {
		var newIssue = new Issue(req.body.issue);
		newIssue.author_id = req.user.id;
		newIssue.date_created = new Date().now;
		console.log(newIssue);
		newIssue.save(function(err, issue) {
			if(err) {
				console.log(err);
				return res.status(500).json({
					'success': false,
					'msg': 'Failed to save issue'
				});
			}
			var newVote = new Vote();
			newVote.issue_id = issue._id;
			newVote.user_id = req.user.id;
			newVote.vote = true;
			newVote.save(function(err, vote) {
				if(err) {
					console.log(err);
				}

				return res.json({
					'success': true,
					'msg': 'You successfully saved a vote and issue',
					'data': {
						'id': issue._id
					}
				});
			});
		});
	});

	router.get('/issues', eatAuth, function(req, res) {

		//Emre
		//Do sort based on query
		//Call tallyVotes (Eeshan to write this method)
		//Send data to Randy via res
		//Below is old code

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
			Issue.aggregate([
				{ $sort: { 'votes.total': 1 } }
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
					msg: 'Popular sort feed returned',
					data: issueArray
				});
			});
		}
		
		function getUserVote(issue) {
			var userVote = req.user.getUserVote(issue._id);
			if (userVote === undefined) { return; }
			issue.user_vote = userVote;
 		}
	});

	router.put('/issues/:id', eatAuth, function(req, res) {
		var newVote = new Vote();
		newVote.issue_id = req.params.id;
		newVote.user_id = req.user.id;
		if(req.body.vote === undefined) newVote.vote = null;
		if(req.body.vote === 'yes') newVote.vote = true;
		newVote.vote = false;

		newVote.save(function(err, vote) {
			if(err) {
				console.log(err);
				return res.status(500).json({
					'success': false,
					'msg': 'Failed to vote on this issue'
				});
			}
			res.json({
				'success': true,
				'msg': 'You successfully voted for this issue'
			});
		});

	});
};