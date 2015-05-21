'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var app = express();

var port = process.env.PORT || 3000;

process.env.APP_SECRET = process.env.APP_SECRET || 'changethischangethischangethis!';

var usersRoutes = express.Router();
var issuesRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/irepresent_dev');

app.use(passport.initialize());

require('./lib/passport_strat')(passport);

require('./routes/auth_routes')(usersRoutes, passport);
require('./routes/issues_routes')(issuesRoutes);

app.use(usersRoutes);
app.use(issuesRoutes);

//404 Catch All
app.use(function(req, res, next) {
	res.status(404).send('404 - page not found');
});

app.listen(port, function() {
	console.log('Your server is running on port ' + port);
});