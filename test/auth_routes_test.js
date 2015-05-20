'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_test';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var app = 'localhost:3000';
chai.use(chaihttp);

var User = require('../models/User');

describe('The login API', function() {
	describe('Creating a user', function() {
		it('Should be able to create a user with a token', function(done) {
			chai.request(app)
				.post('/users')
				.send({
					'username': 'testUser', 
					'email': 'unique@example.com', 
					'password': 'foobar123' 
				})
				.end(function(err, res) {
					expect(err).to.equal(null);
					expect(res.body.success).to.equal(true);
					expect(res).to.have.status(200);
					expect(res.body.msg).to.equal('You have successfully created a user');
					expect(res.body.data).to.have.property('token');
					done();
				});
		});
		it('Should not succeed if there is no password', function(done) {
			chai.request(app)
				.post('/users')
				.send({
					'username': 'testUser7',
					'email': 'unique4@example.com'
				})
				.end(function(err, res) {
					expect(res.body.success).to.equal(false);
					expect(res).to.have.status(401);
					expect(res.body.msg).to.equal('No password submitted');
					done();
				});
		});
		it('Should not succeed if there is no email', function(done) {
			chai.request(app)
				.post('/users')
				.send({
					'username': 'testUser6',
					'password': 'foobar123'
				})
				.end(function(err, res) {
					expect(res.body.success).to.equal(false);
					expect(res).to.have.status(500);
					expect(res.body.msg).to.equal('Could not create user');
					done();
				});
		});
		describe('Unique emails and usernames', function() {
			before(function(done) {
				chai.request(app)
					.post('/users')
					.send({
						'username': 'testUser2',
						'email': 'unique2@example.com',
						'password': 'foobar123'
					})
					.end(function() {
						done();
					});
			});
			it('Should not be able to create a user with a non-unique username', function(done) {
				chai.request(app)
					.post('/users')
					.send({
						'username': 'testUser2',
						'email': 'unique3@example.com',
						'password': 'foobar123'
					})
					.end(function(err, res) {
						expect(res.body.success).to.equal(false);
						expect(res).to.have.status(500);
						expect(res.body.msg).to.equal('Could not create user');
						done();
					});
			});
			it('Should not be able to create a user with a non-unique email', function(done) {
				chai.request(app)
					.post('/users')
					.send({
						'username': 'testUser3',
						'email': 'unique2@example.com',
						'password': 'foobar123'
					})
					.end(function(err, res) {
						expect(res.body.success).to.equal(false);
						expect(res).to.have.status(500);
						expect(res.body.msg).to.equal('Could not create user');
						done();
					});
			});

		});
	});
	describe('Logging in', function() {
		it('Should be able to log-in a user with a password', function(done) {
			chai.request(app)
				.get('/sign_in')
				.auth('unique@example.com', 'foobar123')
				.end(function(err, res) {
					expect(res.body.success).to.equal(true);
					expect(res.body.msg).to.equal('You successfully logged in');
					expect(res.body.data).to.have.property('token');
					done();
				});
		});
		it('Should give an error if logging in with the wrong password', function(done) {
			chai.request(app)
				.get('/sign_in')
				.auth('unique@example.com', 'foobar124')
				.end(function(err, res) {
					expect(res.error.text).to.equal('Wrong Password\n');
					done();
				});

		});
		it('Should give an error if logging in with an invalid email', function(done) {
			chai.request(app)
				.get('/sign_in')
				.auth('wrong@example.com', 'foobar123')
				.end(function(err, res) {
					expect(res.error.text).to.equal('No such user\n');
					expect(res).to.have.status(500);
					done();
				});

		});
		it('Should give an error if logging in with a correct username and not an email', function(done) {
			chai.request(app)
				.get('/sign_in')
				.auth('testUser', 'foobar123')
				.end(function(err, res) {	// Need to update
					expect(res.error.text).to.equal('No such user\n');
					expect(res).to.have.status(500);
					done();
				});
		});
	});
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});
});