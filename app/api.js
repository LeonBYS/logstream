
class API {
    constructor () {
        this.sessionID = null;
        this.reqQueue = [];
    }

    ajax(options, success, fail) {
        var req = () => {
            if (options.url.indexOf('?') >= 0) {
                options.url = options.url + '&sessionID=' + this.sessionID;
            }else {
                options.url = options.url + '?sessionID=' + this.sessionID;
            }
            $.ajax(options).done(success).fail(fail);
        }
        this._addReq(req);
    }

    setSessionID(sessionID) {
        this.sessionID = sessionID;
        for (var i=this.reqQueue.length-1; i>=0; i--) {
            var req = this.reqQueue[i];
            process.nextTick(() => { req(); });
        }
        this.reqQueue = [];
    }

    _addReq(req) {
        if (this.sessionID) {
            process.nextTick(() => { req(); });
        }else {
            this.reqQueue.push(req);
        }
    }
}

var api = new API();

export default api;