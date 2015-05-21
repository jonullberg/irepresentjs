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
				username:'testuser',
				email: 'test@example.com',
				password: 'foobar123'
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

	describe('POST route on /issues (Creating a new issue)', function() {
		it('Should create a new issue', function(done) {
			var testIssue = {
				title: 'Test Title', 
				content: 'I approve of testing. Let us do more!', 
			};
			chai.request(app)
				.post('/issues')
				.set({'eat': testToken})
				.send({issue: testIssue})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.success).to.eql(true);
					expect(res.body.msg).to.eql('You successfully created an issue');
					testIssueId = res.body.data.id;
					done();
				});
		});
	});

	describe('GET route on /issues (Getting the issues feed)', function() {
		it('should get an array of issues on a get request (sort = default)', function(done) {
			chai.request(app)
				.get('/issues')
				.set({eat: testToken})
				.end(function(err, res) {
					//These should fail for now
					expect(err).to.eql(null);
					expect(res.body.success).to.eql(true);
					expect(res.body.msg).to.eql('Popular sort feed returned');
					expect(Array.isArray(res.body.data)).to.eql(true);
					done();
				});
		});

		it('should get an array of issues on a get request (sort = newest)', function(done) {
			chai.request(app)
				.get('/issues')
				.query({sort: 'newest'})
				.set({eat: testToken})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.success).to.eql(true);
					expect(res.body.msg).to.eql('Newest sort feed returned');
					expect(Array.isArray(res.body.data)).to.eql(true);
					done();
				});
		});
	});

	describe('PUT route on /issues/:id (Submitting a vote for an issue)', function() {
		it('Should save a vote of yes', function(done) {
			chai.request(app)
				.put('/issues/' + testIssueId)
				.set({ eat: testToken })
				.send({ "vote": "yes" })
				.end(function(err, res) {
					expect(err).to.equal(null);
					expect(res.body.success).to.equal(true);
					expect(res.body.msg).to.equal('You successfully voted for this issue');
					done();
				});
		});
		it('Should save a vote of no', function(done) {
			chai.request(app)
				.put('/issues/' + testIssueId)
				.set({ eat: testToken })
				.send({ "vote": "no" })
				.end(function(err, res) {
					expect(err).to.equal(null);
					expect(res.body.success).to.equal(true);
					expect(res.body.msg).to.equal('You successfully voted for this issue');
					done();
				});
		});
		it('Should give an error if no vote is submitted', function(done) {
			chai.request(app)
				.put('/issues/' + testIssueId)
				.set({ eat: testToken })
				.end(function(err, res) {
					console.log(res);
					done();
				});
		})
	});
});
