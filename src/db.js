'use strict'
var Redis = new require('ioredis');

var dbRedis = {
    connect: function(host, port, password, tls) {
        this.client = new Redis({
            host: host,
            port: port,
            password: password,
            tls: tls,
        });
    },
    
    /**
     * add a log to a specific log branch (project, logname)
     * @param {string} project
     * @param {string} logname
     * @param {string} logtext
     * @param {number} timestamp
     * @param {function(err, result)} callback 
     */
    getLogs: function (project, logname, timestamp, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        if (!timestamp) {
            this.client.lrange(lkey, 0, -1, function (err, data) {
                data = data.map(x => {
                    return JSON.parse(x); 
                });
                callback(null, data);
            });
        } else {
            // get logs batch by batch, until exceed timestamp, UNTEST
            var getLogsSteply = function (start, batchsize, result, timestamp) {
                this.client.lrange(lkey, start, start + batchsize - 1, function (err, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        result = result.concat(data.map(x => {return JSON.parse(x);}));
                        if (result.length == 0) { // there is no log data in this branch (very hard to hit...)
                            callback(null, []);
                            return;
                        } 
                        var lastTimestamp = result[result.length - 1].timestamp;

                        // update start position and batchsize
                        if (lastTimestamp >= timestamp) {
                            start += batchsize;
                            batchsize *= 2;
                            getLogsSteply(start, batchsize, result, timestamp);
                        }else {
                            // remove the logs before timestamp
                            var size = result.length;
                            while (result[size - 1].timestamp <= timestamp) {
                                size--;
                            }
                            callback(null, result.slice(0, size));
                        }
                    }
                });
            }.bind(this);
                
            getLogsSteply(0, 100, [], Number(timestamp));
        }
    },

    /**
     * add a log to a specific log branch (project, logname)
     * @param {string} project
     * @param {string} logname
     * @param {string} logtext
     * @param {number} timestamp
     * @param {function(err, result)} callback 
     */
    addLogs: function (project, logname, logtext, timestamp, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        var lval = JSON.stringify({ timestamp: timestamp, logtext: logtext });
        this.client.lpush(lkey, lval, callback);
    },

    /**
     * get projects with it's log branchs
     * @param {function(err, result)} callback 
     */
    getProjectsAndLognames: function (callback) {
        this.client.keys("logs:*", function (err, result) {
            if (err) {
                callback(err, null);
            }else {
                var set = {};
                for (var i=0; i<result.length; i++) {
                    var arr = result[i].split(':');
                    var project = arr[1];
                    var logname = arr[2];
                    if (!(project in set)) {
                        set[project] = []
                    }
                    set[project].push(logname);
                }
                callback(null, set);
            }
        });
    }
};






function Database(dbtype) {
    if (dbtype === "redis") {
        return dbRedis;
    }else if (dbtype === "azure-storage") {
        return null;
    }else if (dbtype === "leveldb") {
        return null;
    }else if (dbtype === "mysql") {
        return null;
    }
}


module.exports = {
	Database: Database
};