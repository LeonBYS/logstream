'use strict'

var LogCounter = require('./utils.js').LogCounter;




class Connections {
    constructor (http) {
        this.subscription = {};
        this.socketBySession = {};
        this.counter = new LogCounter(1001); // counter 1 second

        this.io = require('socket.io')(http);
        this.io.on('connection', (socket) => {
            var sid = socket.id.slice(2);
            this._newConnection(sid, socket);
        });
    }

    _newConnection(sessionID, socket) {
        console.log('new connection:', sessionID);
        this.socketBySession[sessionID] = socket;
        socket.on('disconnect', () => {
            this._delConnection(sessionID);
        })
    }

    _delConnection(sessionID) {
        console.log('del connection', sessionID);
        delete this.subscription[sessionID];
        delete this.socketBySession[sessionID];
    }

    _genBranch(project, logname) {
        return project + '/' + logname;
    }

    subscribe(sessionID, channel, project, logname) {
        if (!sessionID || !this.socketBySession[sessionID]) return;
        if (!this.subscription[sessionID]) {
            this.subscription[sessionID] = {};
        }
        this.subscription[sessionID][channel] = this._genBranch(project, logname);
    }

    publish(channel, project, logname, message) {
        var branch = this._genBranch(project, logname);
        for (var sid in this.subscription) {
            if (this.subscription[sid][channel] === branch) {
                this.socketBySession[sid].emit(channel, message);
                this.counter.inc(branch);
            }
        }
    }

    hasSession(sessionID) {
        if (sessionID && this.socketBySession[sessionID]) {
            return true;
        }else {
            return false;
        }
    }

    // for fun
    countSession() {
        return Object.keys(this.socketBySession).length;
    }

    countSubscription() {
        var n = 0;
        for (var sid in this.subscription) {
            n += Object.keys(this.subscription[sid]).length;
        }
        return n;
    }

    getFocusedBranchs() {
        var branchs = [];
        for (var sid in this.subscription) {
            for (var k in this.subscription[sid]) {
                var v = this.subscription[sid][k];
                if (branchs.indexOf(v) < 0) {
                    branchs.push(v);
                }
            }
        }
        return branchs;
    }

    getBranchEmitCount(branch) {
        return this.counter.count(branch);
    }
}

module.exports = {
	Connections: Connections
};