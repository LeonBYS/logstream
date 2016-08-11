'use strict'

var http = require('http');
var request = require('request');


class LogStream {
    constructor(host, port, project, logname) {
        this.host = host;
        this.port = port;
        this.project = project;
        this.logname = logname;
        this.log = this.log.bind(this);
        this.api_secret = process.env.API_SECRET;
    }

    log(msg) {
        var timestamp = Date.now();
        var logtext = '';
        for (var i=0; i<arguments.length; i++) {
            logtext += ' ' + arguments[i];
        }
        logtext += '\n';
        var message = {logtext: logtext, timestamp:timestamp};

        request.post(
            {
                uri: 'http://' + this.host + ':' + this.port + '/api/' + this.project + '/' + this.logname + '/logs',
                json: message,
                //followAllRedirects: true,
                headers: {'API_SECRET': this.api_secret}
            }, 
            function (error, response, body) {
                if (response.statusCode === 302) {
                    request.post({
                        uri: response.headers['location'], 
                        json: message, 
                        headers: {'API_SECRET': this.api_secret}
                    }, function (error, response, body) {
                        if (error) {
                            console.log('LogStream.Log(', message, ') FAILED!')
                        }
                    })
                }else {
                    if (error) {
                        console.log('LogStream.Log(', message, ') FAILED!')
                    }
                }
            }
        );
    }

    addChartData(chartname, data, chartType) {
        var timestamp = Date.now();
        var chartData = {timestamp: timestamp, chartType: chartType, data:data};
        var url = 'http://' + this.host + this.port + '/api/' + this.project + ':' +'/' + this.logname + '/charts/' + chartname;
        request.post(
            {
                uri: url,
                json: chartData,
                headers: {'API_SECRET': this.api_secret}
            }, 
            function (error, response, body) {
                if (response.statusCode === 302) {
                    request.post({
                        uri: response.headers['location'], 
                        json: chartData, 
                        headers: {'API_SECRET': this.api_secret}
                    }, function (error, response, body) {
                        if (error) {
                            console.log('LogStream.Log(', message, ') FAILED!')
                        }
                    })
                }else {
                    if (error) {
                        console.log('LogStream.Log(', message, ') FAILED!')
                    }
                }
            }
        );
    }
}



module.exports = {
	LogStream: LogStream
};