'use strict'
var Redis = new require('ioredis');

var dbRedis = {
    connect: function(host, port, password, tls) {
        this.client = new Redis({
            host: host,
            port: port,
            password: password,
            tls: tls
        });
        this.prefix = "logstream>";
    },

    /**
     * get all list data
     * @param {string} lkey
     * @param {function(err, result)} callback 
     */
    returnListData: function(lkey, beg, end, callback) {
        this.client.lrange(lkey, beg, end, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }else {
                data = data.map(x => JSON.parse(x));
                callback(null, data);
                return;
            }
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
        var lkey = this.prefix + 'logs:' + project + ':' + logname;
        if (!timestamp) {
            this.returnListData(lkey, 0, -1, callback);
        } else {
            // get logs batch by batch, until exceed timestamp
            var getLogsSteply = function (start, batchsize, result, timestamp) {
                this.client.lrange(lkey, start, start + batchsize - 1, function (err, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        result = result.concat(data.map(x => {return JSON.parse(x);}));
                        if (result.length === 0) { // there is no log data in this branch (very hard to hit...)
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
                            while (size > 0 && result[size - 1].timestamp <= timestamp) {
                                size--;
                            }
                            callback(null, result.slice(0, size));
                            return;
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
    addLog: function (project, logname, logtext, timestamp, callback) {
        var lkey = this.prefix + 'logs:' + project + ':' + logname;
        var lval = JSON.stringify({ timestamp: timestamp, logtext: logtext });
        this.client.lpush(lkey, lval, callback);
    },

    /**
     * get projects with it's log branchs
     * @param {function(err, result)} callback 
     */
    getProjects: function (callback) {
        this.client.keys(this.prefix + "logs:*", function (err, result) {
            if (err) {
                callback(err, null);
                return;
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
                var result = [];
                for (var key in set) {
                    result.push({name:key, lognames:set[key]})
                }
                callback(null, result);
                return;
            }
        });
    },

    /**
     * get commands with it's log branchs
     * @param {string} project
     * @param {string} logname
     * @param {function(err, result)} callback 
     */
    getCommands: function (project, logname, callback) {
        var lkey = this.prefix + "commands:" + project + '/' + logname;
        this.returnListData(lkey, 0, -1, callback);
    },

    /**
     * delete commands of a specific log branch
     * @param {string} project
     * @param {string} logname
     * @param {function(err, result)} callback 
     */
    delCommands: function (project, logname, callback) {
        var lkey = this.prefix + "commands:" + project + '/' + logname;
        this.client.del(lkey, callback);
    },

    /**
     * add commands to specific log branch
     * @param {string} project
     * @param {string} logname
     * @param {array of {name:xx, url:xx}} commands
     * @param {function(err, result)} callback 
     */
    addCommand: function (project, logname, commands, callback) {
        var lkey = this.prefix + "commands:" + project + '/' + logname;
        var lvals = commands.map(command => JSON.stringify(command));
        var params = [lkey].concat(lvals);
        params.push(callback);
        this.client.lpush.apply(this.client, params);
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