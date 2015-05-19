//Run with 'node dropDB.js' call
'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/irepresent_dev';
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, function() {
	console.log('Opened connection to MongoDB');
	mongoose.connection.db.dropDatabase(function() {
		console.log('Dropped Mongo DB');
		mongoose.connection.close(function() {
			console.log('Closed connection to MongoDB');
		});
	});
});