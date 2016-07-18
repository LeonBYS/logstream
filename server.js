'use strict'

require('babel-register');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var db = require('./src/db').Database('redis');

var logstream = new (require('./drivers/nodejs/logstream').LogStream)(
    process.env.LOGSTREAM_HOST || 'localhost', 
    process.env.LOGSTREAM_PORT ? Number(process.env.LOGSTREAM_PORT) : 3333, 
    'LogStream', 'Console'
);

/* react */
var swig = require('swig');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server')
var Router = require('react-router');
var routes = require('./app/routes');


app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ limit: '5mb' }));
app.use(express.static('public'));


db.connect(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    process.env.REDIS_PASSWORD,
    process.env.REDIS_HOST ? {servername: process.env.REDIS_HOST} : null
);


/* RESTful API*/
// Logs
app.get('/api/*/*/logs', function (req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var timestamp = req.query.timestamp;
    if (isFinite(timestamp) && new Date(Number(timestamp)).getTime() > 0) { // check valid timestamp, (integer and convert to valid date)
        timestamp = Number(req.query.timestamp); // use user provided timestamp
    }else {
        timestamp = null; // give it null
    }

    console.log('[' + new Date().toLocaleString() + ']', 'get', project, logname, timestamp);
    logstream.log('get', project, logname, timestamp);

    db.getLogs(project, logname, timestamp, function (err, result) {
        if (err) {
            res.status(500).send({error: err});
        }else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    });
});

app.post('/api/*/*/logs', function(req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var logtext = req.body.logtext;
    var timestamp = req.body.timestamp; 
    if (isFinite(timestamp) && new Date(Number(timestamp)).getTime() > 0) { // check valid timestamp, (integer and convert to valid date)
        timestamp = Number(req.body.timestamp); // use user provided timestamp
    }else {
        timestamp = Date.now(); // use server timestamp if user not provide it
    }

    console.log('[' + new Date().toLocaleString() + ']', 'POST', project + '/' + logname, '"' + logtext + '"');
    //logstream.log('post', project, logname, logtext); DON'T DO IT!!!!!!!!!!!!!!!

    db.addLog(project, logname, logtext, timestamp, function (err, result) {
        if (err) {
            res.status(500).send({error: err});
        }else {
            res.status(200).send(logtext);
        }
    });
});

// Commands
app.get('/api/*/*/commands', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'GET commands');
    logstream.log('GET commands');

    var project = req.params[0];
    var logname = req.params[1];
    db.getCommands(project, logname, (err, result) => {
        if (err) {
            res.status(500).send({error: err});
        }else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    });
});

app.post('/api/*/*/commands', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'POST commands');
    logstream.log('POST commands');

    var project = req.params[0];
    var logname = req.params[1];
    var commands = req.body;

    if (!commands || !Array.isArray(commands)) {
        res.status(500).send({error: 'command list is needed!'});
    }else {
        for (var i=0; i<commands.length; i++) {
            if (!commands[i].name || commands[i].name.length === 0) {
                res.status(500).send({error: 'command list is needed!'});
                return;
            }
            commands[i].url = commands[i].url || '#';
        }
        db.addCommand(project, logname, commands, (err, result) => {
            if (err) {
                res.status(500).send({error: err});
            }else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(commands);
            }
        });
    }
});

app.delete('/api/*/*/commands', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'DELETE commands');
    logstream.log('DELETE commands');

    var project = req.params[0];
    var logname = req.params[1];
    db.delCommands(project, logname, (err, result) => {
        if (err) {
            res.status(500).send({error: err});
        }else {
            res.status(200).send("DELETE OK!");
        }
    });
});

// meta data
app.get('/api/projects', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'get projects');
    logstream.log('GET projects');
        
    db.getProjects(function (err, result) {    
        if (err) {
            res.status(500).send({error:err});
        }else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    });
});


app.use(function (req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var html = ReactDOMServer.renderToString(React.createElement(Router.RouterContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});


var server = http.listen(process.env.PORT || 3333, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});



module.exports = app;