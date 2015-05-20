'use strict';

var bodyparser = require('body-parser');
var Issue = require('../models/Issue');
var User = require('../models/User');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function(router) {
	router.use(bodyparser.json());

	router.post('/issues', eatAuth, function(req, res) {
		var newIssue = new Issue(req.body.issue);
		newIssue.author_id = req.user._id;
		newIssue.save(function(err, issue) {
			if(err) {
				console.log(err);
				return res.status(500).json({
					success: false, 
					msg: 'internal server error'
				});
			}
			res.json({
				success: true, 
				msg: 'New Issue Created',
				data: {
					id: issue._id
				}
			});
		});
	});

	router.get('/issues', eatAuth, function(req, res) {
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

	router.put('/issues/:id', eatAuth, function(req, res) {
		if(req.body.vote === 'yes') {
			Issue.findOneAndUpdate({ _id: req.params.id }, {$inc: {'votes.up': 1 }}, {upsert: true}, function(err, issue) {
					if(err) {
						console.log(err);
						return res.status(500).json({
							'success': false,
							'msg': 'Failed to record vote'
						});
					}
					//var newVote = 'votes[' + req.params.id + ']';
					//var newVote = 'votes.req.params.id';
					var newVote = 'votes.' + req.params.id;
					console.log(newVote);
					User.findOneAndUpdate({ _id: req.user.id }, {$set: { 'vote.thisVote' : true }}, { upsert: true }, function(err, user) {
						if(err) {
							console.log(err);
							return res.status(500).json({
								'success': false,
								'msg': 'Failed to update the user'
							});
						}
						return res.json({
							'success': true,
							'msg': 'Recorded a yes vote for this issue'
						});
					});
				});
		} else {
			Issue.findOneAndUpdate({ _id: req.params.id }, {$inc: {'votes.down': 1 }}, {upsert: true }, 
				function(err, issue) {
					console.log(issue);
					if(err) {
						console.log(err);
						return res.status(500).json({
							'success': false,
							'msg': 'Failed to record a vote'
						});
					}

					User.findOneAndUpdate({ _id: req.user.id }, {$set: { newVote: false }}, { upsert: true }, function(err, user) {
						if(err) {
							console.log(err);
							return res.status(500).json({
								'success': false,
								'msg': 'Failed to update the user'
							});
						}
						return res.json({
							'success': true,
							'msg': 'Recorded a yes vote for this issue'
						});
					});

				});

		}
	});
};