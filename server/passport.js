var passport = module.exports = require('passport'), 
	FacebookStrategy = require('passport-facebook').Strategy, 
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
