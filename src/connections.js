'use strict'

class Connections {
    constructor (http, sessionMiddleWare) {
        this.focusBySession = {};
        this.sessionsByFocus = {};
        this.socketBySession = {};

        this.io = require('socket.io')(http);
        this.io.on('connection', (socket) => {
            var sid = socket.id.slice(2);
            console.log('sid', sid);
            this._newConnection(sid, socket);
        });
    }

    _newConnection(sessionID, socket) {
        this.socketBySession[sessionID] = socket;
        socket.on('disconnect', () => {
            this._delConnection(sessionID);    
        });
    }

    _delConnection(sessionID) {
        console.log('delete session', sessionID);
        var focus = this.focusBySession[sessionID];
        if (focus) {
            delete this.sessionsByFocus[focus][sessionID];
        }
        delete this.focusBySession[sessionID];
        delete this.socketBySession[sessionID];
    }

    _genFocus(project, logname) {
        return project + ':' + logname;
    }

    changeFocus(sessionID, project, logname) {
        if (!sessionID || !this.socketBySession[sessionID]) {
            return;
        }
        console.log('changeFocus', sessionID, project, logname);
        var focusNew = this._genFocus(project, logname);
        var focusOld = this.focusBySession[sessionID]; 
        if (focusOld && focusNew !== focusOld) {
            delete this.sessionsByFocus[focusOld][sessionID];
        }
        // session -> focus
        this.focusBySession[sessionID] = focusNew;
        // focus -> {session1, ...} 
        if (!this.sessionsByFocus[focusNew]) { 
            this.sessionsByFocus[focusNew] = {}; 
        }
        this.sessionsByFocus[focusNew][sessionID] = true;
    }

    pushMessage(msgType, msgBody, project, logname) {
        console.log('pushMessage', project, logname);

        var focus = this._genFocus(project, logname);
        var sessions = [];
        if (project) {
            if (this.sessionsByFocus[focus]) {
                sessions = Object.keys(this.sessionsByFocus[focus]);
            }
        }else {// if project & logname is null, sessions <- all sessions
            sessions = Object.keys(this.focusBySession);
        }
        for (var i=0; i<sessions.length; i++) {
            var client = this.socketBySession[sessions[i]];
            console.log('emit to ', sessions[i]);
            client.emit(msgType, msgBody);
        }
    }
}

module.exports = {
	Connections: Connections
};