/*
 * GET users listing.
 */

var passport = require('passport');

exports.login = function(req, res) {
	passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/error'
	});
};