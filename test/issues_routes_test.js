'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = require('chai').expect;

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
			date_created: '20150511'
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

	it('should get an array of issues on a get request (sort = default)', function(done) {
		chai.request('localhost:3000')
			.get('/issues')
			.set({eat: testToken})
			.end(function(err, res) {
				//These should all fail for now
				expect(err).to.eql(null);
				expect(res.body.success).to.eql(true);
				expect(res.body.msg).to.eql('Popular sort feed returned');
				expect(Array.isArray(res.body.data)).to.eql(true);
				done();
			});
	});

	it('should get an array of issues on a get request (sort = newest)', function(done) {
		chai.request('localhost:3000')
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
