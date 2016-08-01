'use strict'

require('babel-register');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./src/db').Database('redis');
var Connections = require('./src/connections').Connections;


global.navigator = { userAgent: 'all' };
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
app.use(function(req, res, next) {
    global.navigator = {
        userAgent: req.headers['user-agent']
    }
    next();
});


db.connect(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    process.env.REDIS_PASSWORD,
    process.env.REDIS_TLS ? JSON.parse(process.env.REDIS_TLS) : null
);


var connections = new Connections(http);

var LogStream = require('./drivers/nodejs/logstream').LogStream;
var logstream = new LogStream(
    process.env.LOGSTREAM_HOST || 'localhost', 
    process.env.LOGSTREAM_PORT ? Number(process.env.LOGSTREAM_PORT) : 3333, 
    'LogStream', 
    'Console'
);



/* RESTful API*/
function returnResult(res, successRet) {
    function ret(err, result) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.status(500).send({error:err});
        }else {
            if (successRet) {
                res.status(200).send(typeof(successRet) === 'string' ? successRet : JSON.stringify(successRet));
            }else {
                res.status(200).send(JSON.stringify(result));
            }
        }
    }
    return ret;
}

// meta data
app.get('/api/projects', function (req, res) {
    console.log('projects session', req.query.sessionID);

    console.log('[' + new Date().toLocaleString() + ']', 'get projects');
    logstream.log('GET projects');
        
    db.getProjects(returnResult(res));
});

// Logs
app.get('/api/*/*/logs', function (req, res) {
    var project = req.params[0];
    var logname = req.params[1];
    var timestamp = req.query.timestamp;
    var count = req.query.count || 100000; // 100K logs, are you kidding me?

    if (isFinite(timestamp) && new Date(Number(timestamp)).getTime() > 0) { // check valid timestamp, (integer and convert to valid date)
        timestamp = Number(req.query.timestamp); // use user provided timestamp
    }else {
        timestamp = null; // give it null
    }

    console.log('[' + new Date().toLocaleString() + ']', 'get', project, logname, timestamp);
    logstream.log('get', project, logname, timestamp);

    db.getLogs(project, logname, timestamp, count, (err, result) => {
        if (timestamp === null) {
            connections.subscribe(req.query.sessionID, 'log', project, logname);
        }
        returnResult(res)(err, result);
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

    if (logtext) {
        db.addLog(project, logname, logtext, timestamp, (err, result) => {
            var logs = [{timestamp: timestamp, logtext: logtext}];
            connections.publish('log', project, logname, logs);
            returnResult(res, req.body)(err, result);
        });
    }else {
        res.status(500).send({error:'invalid log'});
    }
});


// Commands
app.get('/api/*/*/commands', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'GET commands');
    logstream.log('GET commands');

    var project = req.params[0];
    var logname = req.params[1];
    db.getCommands(project, logname, returnResult(res));
});

app.get('/api/*/*/commands/*', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'GET commands/' + req.params[2]);
    logstream.log('GET commands/' + req.params[2]);
 
    var project = req.params[0];
    var logname = req.params[1];
    var command = req.params[2];
    // excute this command
    db.exeCommand(project, logname, command, returnResult(res));
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
        db.addCommands(project, logname, commands, returnResult(res, commands));    
    }
});

app.delete('/api/*/*/commands', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'DELETE commands');
    logstream.log('DELETE commands');

    var project = req.params[0];
    var logname = req.params[1];
    db.delCommands(project, logname, returnResult(res, ''));
});

// Charts
app.get('/api/*/*/charts', function (req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'GET charts');
    logstream.log('GET charts', req.params[0], req.params[1]);

    var project = req.params[0];
    var logname = req.params[1];
    db.getCharts(project, logname, (err, result) => {
        connections.subscribe(req.query.sessionID, 'chart', project, logname);
        returnResult(res)(err, result);
    });
});

app.get('/api/*/*/charts/*', function(req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'GET chart data');
    logstream.log('GET chart data', req.params[0], req.params[1]);

    var project = req.params[0];
    var logname = req.params[1];
    var chartname = req.params[2];
    db.getChartData(project, logname, chartname, returnResult(res));
});

app.delete('/api/*/*/charts/*', function(req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'DELETE chart');
    logstream.log('DELETE chart', req.params[0], req.params[1]);

    var project = req.params[0];
    var logname = req.params[1];
    var chartname = req.params[2];
    db.delChart(project, logname, chartname, returnResult(res, ''));
});

app.post('/api/*/*/charts/*', function(req, res) {
    console.log('[' + new Date().toLocaleString() + ']', 'POST chart data'); 
    logstream.log('POST chart data', req.params[0], req.params[1]);

    var project = req.params[0];
    var logname = req.params[1];
    var chartname = req.params[2];
    var timestamp = req.body.timestamp || Date.now();
    var chartType = req.body.chartType;
    var data = req.body.data;
    if (!chartType || ['line'].indexOf(chartType) >= 0) {
        db.addChartData(project, logname, chartname, timestamp, chartType, data, (err, result) => {
            var appendData = Object.assign({
                chartname: chartname,
                timestamp: timestamp
            }, req.body);
            connections.publish('chart', project, logname, appendData);
            console.log(err, result);
            returnResult(res, req.body)(err, result);
        });   
    }else {
        res.status(500).send({error:'invalid chart type'});
    }
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