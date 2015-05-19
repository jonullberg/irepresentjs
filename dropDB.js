'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/irepresent_dev', function() {
	console.log('Opened connection to MongoDB');
	mongoose.connection.db.dropDatabase(function() {
		console.log('Dropped Mongo DB');
		mongoose.connection.close(function() {
			console.log('Closed connection to MongoDB');
		});
	});
});