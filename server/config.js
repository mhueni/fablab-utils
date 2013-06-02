var config = module.exports = {
	server : {
		port : process.env.PORT || 3000,
		name : 'localhost:3000'
	},
	mongodb : {
		username : 'root',
		password : '',
		hostname : 'localhost',
		port : 27017,
		db : 'fablab-tools'
	},
	facebook : {
		appId : '626868220675702',
		appSecret : '45dec6513fc919717bbeb88651f10619'
	},
	google : {
		clientId : '604413965285-p6j4kmgh567g9gsecvlml3md0orjminq.apps.googleusercontent.com',
		clientSecret : '58KybjoELfov7_duFhaIwtfp'
	},
	basecamp : {
		clientId : '752f0a4e77890f9d57a1565c7befc10d9f70f594',
		clientSecret : 'bb2d0ddba634862cfca1905c9bc7cf9295c8a909'
	}
}

// appfog
if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	config.server.name = 'fablab-tools.eu01.aws.af.cm';
	config.mongodb = env['mongodb-1.8'][0]['credentials'];
	config.google.clientId = '604413965285.apps.googleusercontent.com';
	config.google.clientSecret = '9NhYiDbMrYn3dznvIP9967FD';
	config.basecamp.clientId = '95e83bda9500f2e5e207e3e6685f31375e542e53';
	config.basecamp.clientSecret = '43aee9a62e350189741b270a4fe5b1a79eaa1bc6';
}

config.mongodb.url = 'mongodb://' + config.mongodb.username + ':'
		+ config.mongodb.password + '@' + config.mongodb.hostname + ':'
		+ config.mongodb.port + '/' + config.mongodb.db;