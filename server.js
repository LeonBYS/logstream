var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var redis = new require('ioredis')();

app.disable('x-powerd-by');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ limit: '5mb' }));
app.use(express.static('public'));



/* RESTful API*/
// Logs
app.get('/*/*/logs', function (req, res) {
    console.log(req);
    var project = req.params[0];
    var logname = req.params[1];
    var lkey = 'logs:' + project + ':' + logname;
    redis.lrange(lkey, 0, -1, function (err, result) {
        res.send('<h1>' + lkey + '=' + result + '</h1>');
    });
});

app.post('/*/*/logs', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var lkey = 'logs:' + project + ':' + logname;
    var lval = req.body;
    redis.lpush(lkey, lval, function (err, result) {
        res.send(lval);
    });
});

// Commands
app.get('/*/*/commands', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var lkey = 'commands:' + project + ':' + logname;
    redis.lrange(lkey, 0, -1, function (err, result) {
        res.send('<h1>' + lkey + '=' + result + '</h1>');
    });
});

app.post('/*/*/commands', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var lkey = 'commands:' + project + ':' + logname;
    var commandName = req.body.name;
    var commandUri = req.body.uri;
    var lval = JSON.stringify({name: commandName, uri: commandUri});
    redis.lpush(lkey, lval, function (err, result) {
        res.send(lval);
    });
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
    res.send('all project names');
});

app.get('/lognames', function (req, res) {
    res.send('all lognames for specified project');
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

