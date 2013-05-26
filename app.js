/**
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development',
	path = require('path'), 
	express = require('express'),
	app = express(), 
	server = require('http').createServer(app), 
	io = require('socket.io').listen(server),
	routes = require('./routes'),
	config = require('./server/config'),
	model = require('./server/model'),
	auth = require('./server/auth');

// all environments
app.set('port', config.server.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fablab-tools'));
app.use(express.session());
app.use(auth.middleware());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

io.sockets.on('connection', function(socket) {
	socket.emit('model', model);
	socket.on('+exception', function(data) {
		model.addException(data, function(model) {
			socket.emit('+exception', model);
			socket.broadcast.emit('+exception', model);
		});
	});
	socket.on('-exception', function(data) {
		model.removeException(data, function(model) {
			socket.emit('-exception', model);
			socket.broadcast.emit('-exception', model);
		});
	});
});

server.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port'))
});
