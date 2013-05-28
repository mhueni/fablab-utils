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
		clientId : '241419624203.apps.googleusercontent.com',
		clientSecret : 'O25lHE6lm_KHbWP9xtlyLFUZ'
	}
}

// appfog
if (process.env.VCAP_SERVICES) {
	config.server.name = 'fablab-tools.eu01.aws.af.cm';
	var env = JSON.parse(process.env.VCAP_SERVICES);
	config.mongodb = env['mongodb-1.8'][0]['credentials'];
}

config.mongodb.url = 'mongodb://' + config.mongodb.username + ':'
		+ config.mongodb.password + '@' + config.mongodb.hostname + ':'
		+ config.mongodb.port + '/' + config.mongodb.db;