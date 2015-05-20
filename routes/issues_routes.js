'use strict';

var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var Issue = require('../models/Issue');
var Vote = require('../models/Vote');
var popularitySort = require('../lib/popularitySort');

module.exports = function(router) {
	router.use(bodyparser.json());

	//Jonathan
	//Redo this new issue code to call issue.addIssue method
	//This method should add a new vote as well

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
				issueArray.forEach(function(issue) {
					var total = 3;
					var count = 0;
					Vote.count({ 'issue_id': issue._id, 'vote': true }, function (err, count) {
						issue.votes_up = count;
						runCallback();
					});
					Vote.count({ 'issue_id': issue._id, 'vote': false }, function (err, count) {
						issue.votes_down = count;
						runCallback();
					});
					Vote.count({ 'issue_id': issue._id }, function (err, count) {
						issue.votes_total = count;
						runCallback();
					});
					function runCallback() {
						count++;
						if (count === total) {
							functionAfterForEach();
						}
					}
				});

				var total = issueArray.length;
				var count = 0;
				function functionAfterForEach() {	
					count++;
					if (count === total) {
						//Return sorted array
						res.json({
							success: true,
							msg: 'Newest sort feed returned',
							data: issueArray
						});
					}
				};
			});
		} else { //Default of popular sort
			//Return sorted array
			res.json({
				success: true,
				msg: 'Popular sort feed returned'
			});
		}
	});

	router.put('/issues/:id', eatAuth, function(req, res) {

		//Jonathan
		//Redo this to add a new Vote


		var newVote = new Vote();
		newVote.issue_id = req.params.id;
		newVote.user_id = req.user.id;
		if(req.body.vote === 'yes') {
			newVote.vote = true;
		}
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

		// Issue.findOne({ _id: req.params.id }, function(err, issue) {
		// 	issue.updateVote(req.body.vote, function(err, data) {
		// 		if (err) {
		// 			console.log(err);
		// 			return res.status(500).json({
		// 				'success': false,
		// 				'msg': 'Failed to record vote'
		// 			});
		// 		}
		// 		return res.json({
		// 			'success': true,
		// 			'msg': 'Recorded ' + data + ' vote'
		// 		});
		// 	});
		// });

		// if(req.body.vote === 'yes') {
		// 	Issue.findOneAndUpdate({ _id: req.params.id }, {$inc: {'votes.up': 1 }}, {upsert: true, 'new': true}, function(err, issue) {
		// 			if(err) {
		// 				console.log(err);
		// 				return res.status(500).json({
		// 					'success': false,
		// 					'msg': 'Failed to record vote'
		// 				});
		// 			}
		// 			return res.json({
		// 				'success': true,
		// 				'msg': 'Recorded a yes vote for this issue'
		// 			});
		// 		});
		// } else {
		// 	Issue.findOneAndUpdate({ _id: req.params.id }, {$inc: {'votes.down': 1 }}, {upsert: true }, 
		// 		function(err, issue) {
		// 			console.log(issue);
		// 			if(err) {
		// 				console.log(err);
		// 				return res.status(500).json({
		// 					'success': false,
		// 					'msg': 'Failed to record a vote'
		// 				});
		// 			}

		// 			return res.json({
		// 				'success': true,
		// 				'msg': 'Recorded a yes vote for this issue'
		// 			});

		// 		});

		// }
	});
};