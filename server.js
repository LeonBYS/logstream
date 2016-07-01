var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var db = require('./src/db').Database('redis');

var logstream = new (require('./drivers/nodejs/logstream').LogStream)(
    'localhost', 3333, 'LogStream', 'Console'
);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ limit: '5mb' }));
app.use(express.static('public'));

db.connect();


/* RESTful API*/
// Logs
app.get('/api/*/*/logs', function (req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var timestamp = req.query.timestamp;
    db.getLogs(project, logname, timestamp, function (err, result) {
        console.log('[' + new Date().toLocaleString() + ']', 'get', project, logname);
        logstream.log('get', project, logname);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.post('/api/*/*/logs', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var logtext = req.body;
    var timestamp = req.query.timestamp || Date.now(); // use server timestamp if user not provide it
    db.addLogs(project, logname, logtext, timestamp, function (err, result) {
        console.log('[' + new Date().toLocaleString() + ']', 'post', project, logname, logtext);
        //logstream.log('post', project, logname, logtext);

        res.send(logtext);
    });
});

// Commands
app.get('/*/*/commands', function(req, res) {
    res.send('invalid now...');
});

app.post('/*/*/commands', function(req, res) {
    res.send('invalid now...');
});
// app.delete commands

// Setting
app.get('/*/*/setting', function(req, res) {
    res.send('invalid now...');
});

app.post('/*/*/setting', function(req, res) {
    res.send('invalid now...');
});

// meta data
app.get('/api/projects', function (req, res) {
    db.getProjectsAndLognames(function (err, result) {
        console.log('[' + new Date().toLocaleString() + ']', 'get projects');
        logstream.log('get projects');

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});


// root page
app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
})


var server = http.listen(process.env.PORT || 3333, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

