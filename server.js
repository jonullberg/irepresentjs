'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var app = express();

var port = process.env.PORT || 3000;

process.env.APP_SECRET = process.env.APP_SECRET || 'changethischangethischangethis!';

var usersRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/irepresent_dev');

app.use(passport.initialize());

require('./lib/passport_strat')(passport);

require('./routes/auth_routes')(usersRoutes, passport);

app.use(usersRoutes);

app.listen(port, function() {
	console.log('Your server is running on port ' + port);
});