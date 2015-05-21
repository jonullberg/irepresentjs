'use strict';

var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var Issue = require('../models/Issue');
var Vote = require('../models/Vote');
var sort = require('../lib/popularitySort');
var randalizeDate = require('../lib/randalizeDate');

module.exports = function(router) {
	router.use(bodyparser.json());

	router.post('/issues', eatAuth, function(req, res) {
		var newIssue = new Issue(req.body.issue);
		newIssue.author_id = req.user.id;
		newIssue.date_created = new Date();
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
				{ $sort: { date_created: -1 } }
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
					issue.date_created = randalizeDate(issue.date_created);
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
			console.log('popular sort');
			Issue.aggregate([{$project:{_id:1, 'title':'$title', 'content':'$content','date_created':'$date_created', 'author_id':'$author_id'}}], function(err, issueArray) {
				if(err) {
					console.log(err);
					return res.status(500).json({
						success: false, 
						msg: 'internal server error'
					});
				}
				//Add user vote to array
				issueArray.forEach(function(issue) {
					var total = 3;
					var forEachCount = 0;
					issue.date_created = randalizeDate(issue.date_created);
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
						forEachCount++;
						if (forEachCount === total) {
							functionAfterForEach();
						}
					}
				});

				var total = issueArray.length;
				var issueArrayCount = 0;
				function functionAfterForEach() {	
					issueArrayCount++;
					if (issueArrayCount === total) {
						//Sort array via popularity sort
						issueArray = sort(issueArray);
						//Return sorted array
						res.json({
							success: true,
							msg: 'Popular sort feed returned',
							data: issueArray
						});
					}
				};
			});
		}
	});

	router.put('/issues/:id', eatAuth, function(req, res) {		
	var newVote = new Vote();
		newVote.issue_id = req.params.id;
		newVote.user_id = req.user.id;
		if(req.body.vote === 'yes') newVote.vote = true;
		if(req.body.vote === 'no') newVote.vote = false;

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