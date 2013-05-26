var assert = require('assert'),
	mongo = require('mongodb'),
	config = require('../config/config');
var Server = mongo.Server, 
	Db = mongo.Db, 
	BSON = mongo.BSONPure,
	ObjectID = mongo.ObjectID;
var server = new Server(config.mongodb.hostname, config.mongodb.port, {
	auto_reconnect : true
});

var model = exports;

exports.shifts = [];
exports.exceptions = [];

db = new Db(config.mongodb.db, server);
db.open(function(err, db) {
	if (!err) {
		console.log("Connected to database");
		db.collection('shifts', {
			strict : true
		}, function(err, collection) {
			if (err) {
				var shifts = require('./shifts');
				db.collection('shifts', function(err, collection) {
					collection.insert(shifts, {
						safe : true
					}, function(err, result) {
						console.log(err);
					});
				});
			}
		});
		db.collection('shifts', function(err, collection) {
			collection.find().toArray(function(err, shifts) {
				model.shifts = shifts;
			});
		});
		db.collection('exceptions', function(err, collection) {
			collection.find().toArray(function(err, exceptions) {
				model.exceptions = exceptions;
			});
		});
	}
});

exports.addException = function(data, next) {
	db.collection('exceptions', function(err, collection) {
		assert.equal(null, err);
		collection.insert(data, function(err, result) {
			assert.equal(null, err);
			next(data);
			collection.find().toArray(function(err, exceptions) {
				assert.equal(null, err);
				model.exceptions = exceptions;
			});
		});
	});
}

exports.removeException = function(data, next) {
	db.collection('exceptions', function(err, collection) {
		assert.equal(null, err);
		collection.findAndRemove({ '_id': new ObjectID(data._id) }, function(err, result) {
			assert.equal(null, err);
			next(data);
			collection.find().toArray(function(err, exceptions) {
				assert.equal(null, err);
				model.exceptions = exceptions;
			});
		});
	});
}