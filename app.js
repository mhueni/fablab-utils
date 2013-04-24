/**
 * Module dependencies.
 */

var express = require('express'), 
	app = express(), 
	http = require('http'),
	server = http.createServer(app), 
	io = require('socket.io').listen(server), 
	path = require('path'), 
	routes = require('./routes'), 
	user = require('./routes/user'),
	MyModels = require('./public/javascripts/model.js');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', user.list);

var model = new MyModels.AppModel;
model.exceptions.add([ {
	date : '2013-04-24',
	hour : '17-21',
	user : 'ronnie',
	available : false
}, {
	date : '2013-04-25',
	hour : '17-21',
	user : 'christoph',
	available : false
}, {
	date : '2013-04-25',
	hour : '17-21',
	user : 'matthias',
	available : true
}, {
	date : '2013-05-02',
	hour : '13-17',
	user : 'matthias',
	available : false
}, {
	date : '2013-04-02',
	hour : '13-17',
	user : 'christoph',
	available : true
}, {
	date : '2013-05-09',
	hour : '13-17',
	user : 'matthias',
	available : false
} ]);

io.sockets.on('connection', function(socket) {
	socket.emit('exceptions', model.exceptions);
	socket.on('add', function(data) {
		model.exceptions.add(new MyModels.Exception(data));
		io.sockets.emit('exceptions', model.exceptions);
	});
	socket.on('destroy', function(data) {
		var models = model.exceptions.where(data);
		_.each(models, function(m) { m.destroy(); });
		io.sockets.emit('exceptions', model.exceptions);
	});
});

server.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port'))
});
