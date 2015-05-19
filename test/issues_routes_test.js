'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = require('chai').expect;
var Issue = require('../models/Issue');

describe('issue REST api', function() {
	after(function(done) {
		//TODO: Drop test issues you test with
	});

	it('should save a new issue with a post request', function(done) {
		
		var testToken = {token: 'test token here'};
		var testIssue = {
			title: 'Test Title', 
			content: 'I approve of testing. Let us do more!', 
			votes: {up: 1, down: 0},
			date_created: '05/11/15'
		};


		chai.request('localhost:3000')
			.post('/api/issues')
			.set({'eat': testToken})
			.send({issue: testIssue})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.success).to.eql(true);
				expect(res.body.msg).to.eql('New Issue Created');
				done();
			});
	});
});
