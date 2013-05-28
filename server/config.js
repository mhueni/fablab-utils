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
		appId : '333343110060582',
		appSecret : 'ad5a263a3f8ff5684a0c4edabced8826'
	},
	google : {
		clientId : '604413965285-p6j4kmgh567g9gsecvlml3md0orjminq.apps.googleusercontent.com',
		clientSecret : '58KybjoELfov7_duFhaIwtfp'
	}
}

// appfog
if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	config.server.name = 'fablab-tools.eu01.aws.af.cm';
	config.google.clientId = '604413965285.apps.googleusercontent.com';
	config.google.clientSecret = '9NhYiDbMrYn3dznvIP9967FD';
	config.mongodb = env['mongodb-1.8'][0]['credentials'];
}

config.mongodb.url = 'mongodb://' + config.mongodb.username + ':'
		+ config.mongodb.password + '@' + config.mongodb.hostname + ':'
		+ config.mongodb.port + '/' + config.mongodb.db;