
class API {
    constructor () {
        this.sessionId = null;
        this.reqQueue = [];
    }

    ajax(options, success, fail) {
        var req = () => {
            if (options.url.indexOf('?') >= 0) {
                options.url = options.url + '&sessionId=' + this.sessionId;
            }else {
                options.url = options.url + '?sessionId=' + this.sessionId;
            }
            $.ajax(options).done(success).fail(fail);
        }
        this._addReq(req);
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId;
        for (var i=this.reqQueue.length-1; i>=0; i--) {
            var req = this.reqQueue[i];
            process.nextTick(() => { req(); });
        }
        this.reqQueue = [];
    }

    _addReq(req) {
        if (this.sessionId) {
            process.nextTick(() => { req(); });
        }else {
            this.reqQueue.push(req);
        }
    }
}

var api = new API();

export default api;