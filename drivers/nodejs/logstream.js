'use strict'

var http = require('http');


class LogStream {
    constructor(host, port, project, logname) {
        this.host = host;
        this.port = port;
        this.project = project;
        this.logname = logname;
        this.log = this.log.bind(this);
    }

    log(msg) {
        var timestamp = Date.now();
        var logtext = '';
        for (var i=0; i<arguments.length; i++) {
            logtext += ' ' + arguments[i];
        }
        logtext += '\n';
        var message = JSON.stringify({logtext: logtext, timestamp:timestamp});
        var options = {
            hostname: this.host,
            port: this.port,
            path: '/api/' + this.project + '/' + this.logname + '/logs',
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(message)}
        };
        var req = http.request(options);
        req.on('error', function (e) {
            console.log('LogStream.Log(', message, ') FAILED!');
        });
        req.write(message);
        req.end();
    }
}



module.exports = {
	LogStream: LogStream
};