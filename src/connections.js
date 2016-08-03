'use strict'

class Connections {
    constructor (http) {
        this.subscription = {};
        this.socketBySession = {};

        this.io = require('socket.io')(http);
        this.io.on('connection', (socket) => {
            var sid = socket.id.slice(2);
            this._newConnection(sid, socket);
        })
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

    _genFocus(project, logname) {
        return project + ':' + logname;
    }

    subscribe(sessionID, channel, project, logname) {
        if (!sessionID || !this.socketBySession[sessionID]) return;
        if (!this.subscription[sessionID]) {
            this.subscription[sessionID] = {};
        }
        this.subscription[sessionID][channel] = this._genFocus(project, logname);
    }

    publish(channel, project, logname, message) {
        var focus = this._genFocus(project, logname);
        for (var sid in this.subscription) {
            if (this.subscription[sid][channel] === focus) {
                this.socketBySession[sid].emit(channel, message);
            }
        }
    }


    // for fun
    count() {
        return Object.keys(this.socketBySession).length;
    }
}

module.exports = {
	Connections: Connections
};