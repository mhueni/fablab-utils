var passport = module.exports = require('passport'), 
	FacebookStrategy = require('passport-facebook').Strategy, 
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	BasecampStrategy = require('passport-oauth').OAuth2Strategy,
	model = require('./model'),
	config = require('./config')

passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	model.findOrCreateUser({email: email}, function(err, user) {
		done(null, user);
	})
});

passport.use(new FacebookStrategy({
	clientID : config.facebook.appId,
	clientSecret : config.facebook.appSecret,
	callbackURL : 'http://' + config.server.name + '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
	model.findOrCreateUser(profile, function(err, user) {
		done(err, user);
	})
}));


passport.use(new GoogleStrategy({
	clientID : config.google.clientId,
	clientSecret : config.google.clientSecret,
	callbackURL : 'http://' + config.server.name + '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
	model.findOrCreateUser(profile, function(err, user) {
		done(err, user);
	})
}));

BasecampStrategy.prototype.userProfile = function(accessToken, done) {
	this._oauth2.get('https://launchpad.37signals.com/authorization.json',
			accessToken, function(err, body, res) {
				if (err) {
					return done(err);
				}

				try {
					var json = JSON.parse(body);

					var profile = {
						provider : 'basecamp'
					};
					profile.id = json.identity.id;
					profile.displayName = json.identity.name;
					profile.username = json.identity.email_address;
					profile.emails = [ {
						value : json.identity.email_address
					} ];

					profile._raw = body;
					profile._json = json;

					done(null, profile);
				} catch (e) {
					done(e);
				}
			});
}
passport.use('basecamp', new BasecampStrategy({
	authorizationURL : 'https://launchpad.37signals.com/authorization/new',
	tokenURL : 'https://launchpad.37signals.com/authorization/token',
	clientID : config.basecamp.clientId,
	clientSecret : config.basecamp.clientSecret,
	callbackURL : 'http://' + config.server.name + '/auth/basecamp/callback'
}, function(accessToken, refreshToken, profile, done) {
	model.findOrCreateUser(profile, function(err, user) {
console.log(err, user);
		done(err, user);
	})
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
		strategy = passport.authenticate(req.route.params.provider, { scope: ['identity', 'email'] });
	}
	if (strategy) {
		strategy(req, res, next);
	} else {
		res.send(404);
	}
}
