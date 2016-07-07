'use strict'

var http = require('http');


class LogStream {
    constructor(host, port, project, logname) {
        this.host = host;
        this.port = port;
        this.project = project;
        this.logname = logname;
    }

    log(msg) {
        var message = '';
        for (var i=0; i<arguments.length; i++) {
            message += ' ' + arguments[i];
        }
        message += '\n';
        var options = {
            hostname: this.host,
            port: this.port,
            path: '/api/' + this.project + '/' + this.logname + '/logs?timestamp=' + Date.now(),
            method: 'POST',
            headers: {'Content-Type': 'text/plain', 'Content-Length': Buffer.byteLength(message)}
        };
        var req = http.request(options);
        req.on('error', function (e) {
            console.log('LogStream', message, 'FAILED!');
        });
        req.write(message);
        req.end();
    }
}



module.exports = {
	LogStream: LogStream
};