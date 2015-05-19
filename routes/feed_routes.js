'use strict';

var Issue = require('../model/Issue');
var bodyparser = require('body-parser');
var eat_auth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function(router) {
	router.use(bodyparser.json());

	router.get('/feed', eat_auth, function(req, res) {
		var sortParam = '';

		if(req.query.sort === 'newest') {
			sortParam = 'date-created';
		}
		var total = votes.yes + votes.no;
		sortParam = total;
		Issue.find().sort({ sortParam: -1 }).exec(function(err, model) {

		});
	});
};