var config = module.exports = {
	server : {
		port : process.env.PORT || 3000
	},
	mongodb : {
		username : 'root',
		password : '',
		hostname : 'localhost',
		port : 27017,
		db : 'fablab-tools'
	}
}

// appfog
if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	config.mongodb = env['mongodb-1.8'][0]['credentials'];
}

config.mongodb.url = 'mongodb://' + config.mongodb.username + ':'
		+ config.mongodb.password + '@' + config.mongodb.hostname + ':'
		+ config.mongodb.port + '/' + config.mongodb.db;