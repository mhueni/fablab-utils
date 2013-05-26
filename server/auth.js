var everyauth = require('everyauth'), config = require('./config');

var usersById = {};
var nextUserId = 0;
function addUser(source, sourceUser) {
	var user;
	if (arguments.length === 1) { // password-based
		user = sourceUser = source;
		user.id = ++nextUserId;
		return usersById[nextUserId] = user;
	} else { // non-password-based
		user = usersById[++nextUserId] = {
			id : nextUserId
		};
		user[source] = sourceUser;
	}
	return user;
}

everyauth.everymodule.findUserById(function(id, callback) {
	callback(null, usersById[id]);
});

var usersByFbId = {};
everyauth.facebook.appId(config.facebook.appId).appSecret(
		config.facebook.appSecret).findOrCreateUser(
		function(session, accessToken, accessTokenExtra, fbUserMetadata) {
			console.log(fbUserMetadata);
			return usersByFbId[fbUserMetadata.id]
					|| (usersByFbId[fbUserMetadata.id] = addUser('facebook',
							fbUserMetadata));
		}).redirectPath('/');

var usersByGoogleId = {};
everyauth.google
		.appId(config.google.clientId)
		.appSecret(config.google.clientSecret)
		.scope(
				'https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
		.findOrCreateUser(
				function(sess, accessToken, extra, googleUser) {
					console.log(googleUser);
					googleUser.refreshToken = extra.refresh_token;
					googleUser.expiresIn = extra.expires_in;
					return usersByGoogleId[googleUser.id]
							|| (usersByGoogleId[googleUser.id] = addUser(
									'google', googleUser));
				}).redirectPath('/');

module.exports = everyauth;
