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
    getLogs: function (project, logname, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        this.client.lrange(lkey, 0, -1, callback);
    },
    addLogs: function (project, logname, logtext, callback) {
        var lkey = 'logs:' + project + ':' + logname;
        var lval = logtext;
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