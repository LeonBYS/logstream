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
app.get('/*/*/logs', function (req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    db.getLogs(project, logname, function (err, result) {
        console.log('[' + new Date().toLocaleString() + ']', 'get', project, logname);
        //logstream.log('get', project, logname);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.post('/*/*/logs', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var logtext = req.body;
    db.addLogs(project, logname, logtext, function (err, result) {
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
app.get('/projects', function (req, res) {
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

