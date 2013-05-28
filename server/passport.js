var passport = module.exports = require('passport'), 
	FacebookStrategy = require('passport-facebook').Strategy, 
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('./config')

passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
//	User.findById(id, function(err, user) {
//		done(err, user);
//	});
});

passport.use(new FacebookStrategy({
	clientID : config.facebook.appId,
	clientSecret : config.facebook.appSecret,
	callbackURL : 'http://' + config.server.name + '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
	done(null, profile);
	// User.findOrCreate(..., function(err, user) {
	// if (err) { return done(err); }
	// done(null, user);
	// });
}));


passport.use(new GoogleStrategy({
	clientID : config.google.clientId,
	clientSecret : config.google.clientSecret,
	callbackURL : 'http://' + config.server.name + '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
	done(null, profile);
	// User.findOrCreate({
	// openId : identifier
	// }, function(err, user) {
	// done(err, user);
	// });
}));

/**
 * Authentication middleware
 */
passport.auth = function(req, res, next) {
	console.log(req.route.params);
	var strategy = null;
	if (req.route.params.callback) {
		strategy = passport.authenticate(req.route.params.provider, {
			successRedirect : '/',
			failureRedirect : '/?error'
		});
	} else {
		strategy = passport.authenticate(req.route.params.provider, { scope: 'email' });
	}
	if (strategy) {
		strategy(req, res, next);
	} else {
		res.send(404);
	}
}
