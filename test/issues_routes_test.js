'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = require('chai').expect;
var app = 'localhost:3000';

describe('Issues REST api', function() {
	var testToken = '';
	var testIssueId = '';

	before(function(done) {
		chai.request(app)
			.post('/users')
			.send({
				username:'testuser1',
				email: 'testuser1@example.com',
				password: 'password'
			})
			.end(function(err, res) {
				testToken = res.body.data.token;
				done();
			}); 
	});
	
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	describe('Creating new issues', function() {
	
		it('should save a new issue with a post request', function(done) {
			var testIssue = {
				title: 'Test Title', 
				content: 'I approve of testing. Let us do more!', 
				votes: {up: 1, down: 0},
				date_created: 11052015
			};

			chai.request(app)
				.post('/issues')
				.set({'eat': testToken})
				.send({issue: testIssue})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.success).to.eql(true);
					expect(res.body.msg).to.eql('New Issue Created');
					testIssueId = res.body.data.id;
					done();
				});
		});
	});

	describe('Voting on an issue', function() {
		it('Should increment a vote tally', function(done) {
			chai.request(app)
				.put('/issues/' + testIssueId)
				.send({ vote: 'yes', 'eat': testToken })
				.end(function(err, res) {
					expect(err).to.equal(null);
					expect(res.body.msg).to.equal('Recorded a yes vote for this issue');
					done();
				});
		});
	});
});
