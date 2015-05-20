'use strict';

var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var Issue = require('../models/Issue');
var Vote = require('../models/Vote');

module.exports = function(router) {
	router.use(bodyparser.json());

	//Jonathan
	//Redo this new issue code to call issue.add method
	//This method should add a new vote as well

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
				msg: 'New Issue Created',
				data: {
					id: data._id
				}
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
				console.log(issueArray);
				//Add user vote to sorted array
				issueArray.forEach(function(issue) {
					Issue.findOne({_id: issue._id}, function(err, oneIssue) {
						oneIssue.tallyVotes(issue, req.user._id);
						console.log(issue);
					})
				});
				console.log('Added tallies');
				console.log(issueArray);

				//Return sorted array
				res.json({
					success: true,
					msg: 'Newest sort feed returned',
					data: issueArray
				});
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

		Issue.findOne({ _id: req.params.id }, function(err, issue) {
			issue.updateVote(req.body.vote, function(err, data) {
				if (err) {
					console.log(err);
					return res.status(500).json({
						'success': false,
						'msg': 'Failed to record vote'
					});
				}
				return res.json({
					'success': true,
					'msg': 'Recorded ' + data + ' vote'
				});
			});
		});

		if(req.body.vote === 'yes') {
			Issue.findOneAndUpdate({ _id: req.params.id }, {$inc: {'votes.up': 1 }}, {upsert: true, 'new': true}, function(err, issue) {
					if(err) {
						console.log(err);
						return res.status(500).json({
							'success': false,
							'msg': 'Failed to record vote'
						});
					}
					return res.json({
						'success': true,
						'msg': 'Recorded a yes vote for this issue'
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

					return res.json({
						'success': true,
						'msg': 'Recorded a yes vote for this issue'
					});

				});

		}
	});
};