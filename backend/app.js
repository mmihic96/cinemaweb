// Imported modules
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var session = require('express-session')

var app = express();
var server = http.Server(app);

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cookieParser())
// Check platform
var isWin = /^win/.test(process.platform);
if (isWin) {
    app.use(express.static('..\\frontend/'));
} else {
    app.use(express.static('../frontend'));
}


// Users API
app.use('/api', require('./routes/users.routes.js'));
// Movies API
app.use('/api', require('./routes/movies.routes.js'));
// Events API
app.use('/api', require('./routes/events.routes.js'));
// Halls API
app.use('/api', require('./routes/halls.routes.js'));
// Bills API
app.use('/api', require('./routes/bills.routes.js'));
// Login
app.use('/', require('./routes/auth.routes.js'));

server.listen(3000, '0.0.0.0', function () {
    console.info('Express listen on *:3000');
});

module.exports = app;