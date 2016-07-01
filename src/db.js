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
    getLogs: function (project, logname, timestamp, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        if (!timestamp) {
            this.client.lrange(lkey, 0, -1, callback);
        } else {
            // get logs batch by batch, until exceed timestamp, UNTEST
            timestamp = Number(timestamp);
            var start = 0, batchsize = 100;
            var result = [];
            var lastTimestamp = timestamp;
            while (lastTimestamp >= timestamp) {
                this.client.lrange(start, start + batchsize - 1, function (err, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        data = JSON.parse(data);
                        result.push.apply(data);
                        lastTimestamp = result[result.length - 1].timestamp;
                    }
                });
                // update start position and batchsize
                start += batchsize;
                batchsize *= 2;
            }
            // remove the logs before timestamp
            var size = result.length;
            while (result[size - 1].timestamp <= timestamp) {
                size--;
            }
            // callback(err=null, result=result)
            callback(null, result);
        }
    },
    addLogs: function (project, logname, logtext, timestamp, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        var lval = JSON.stringify({ timestamp: Number(timestamp), logtext: logtext });
        this.client.lpush(lkey, lval, callback);
    },

    getProjectsAndLognames: function (callback) {
        this.client.keys("logs:*", function (err, result) {
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
            callback(err, set);
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