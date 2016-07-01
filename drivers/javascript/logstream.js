'use strict'


class LogStream {
    constructor(project, logname) {
        this.project = project;
        this.logname = logname;
    }
    log(msg) {
        var message = '[' + new Date().toLocaleString() + ']';
        for (var i=0; i<arguments.length-1; i++) {
            message += ' ' + arguments[i];
        }
        
    }
}



module.exports = {
	LogStream: LogStream
};