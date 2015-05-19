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
	var testToken;

	before(function(done) {
		chai.request('localhost:3000')
			.post('/users')
			.send({
				username:'testuser1',
				email: 'testuser1@example.com',
				password: 'password'
			}).end(function(err, res) {
				testToken = res.body.data.token;
				done();
			}); 
	});
	
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should save a new issue with a post request', function(done) {
		var testIssue = {
			title: 'Test Title', 
			content: 'I approve of testing. Let us do more!', 
			votes: {up: 1, down: 0},
			date_created: '05/11/15'
		};

		chai.request('localhost:3000')
			.post('/issues')
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
