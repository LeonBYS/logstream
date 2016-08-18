'use strict'

var Redis = new require('ioredis');
var request = require("request");


var config = {
    MAX_LOGS_COUNT: 100000,
    PROB_CHECK_LOGS: 0.001
};


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
    getLogs: function (project, logname, timestamp, count, callback) {
        var lkey = this.prefix + 'logs:' + project + ':' + logname;
        if (!timestamp) {
            this.returnListData(lkey, 0, count-1, callback);
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
                            if (result.length >= count) {
                                callback(null, result.slice(0, count));
                                return;
                            }
                            start += batchsize;
                            batchsize *= 2;
                            getLogsSteply(start, batchsize, result, timestamp);
                        }else {
                            // remove the logs before timestamp
                            var size = result.length;
                            while (size > 0 && result[size - 1].timestamp <= timestamp) {
                                size--;
                            }
                            callback(null, result.slice(0, Math.min(size, count)));
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
     * @param {number} level
     * @param {function(err, result)} callback 
     */
    addLog: function (project, logname, logtext, timestamp, level, callback) {
        var lkey = this.prefix + 'logs:' + project + ':' + logname;
        var lval = JSON.stringify({ timestamp: timestamp, logtext: logtext, level:level });
        var pipe = this.client.pipeline();
        pipe.lpush(lkey, lval);
        pipe.ltrim(lkey, 0, config.MAX_LOGS_COUNT);
        pipe.exec(callback);
    },

    /**
     * get projects with it's log branchs
     * @param {function(err, result)} callback 
     */
    getProjects: function (callback) {
        this.client.keys(this.prefix + "*:*", function (err, result) {
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
                    if (set[project].indexOf(logname) < 0) {
                        set[project].push(logname);
                    }
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
        var lkey = this.prefix + "commands:" + project + ':' + logname;
        this.returnListData(lkey, 0, -1, (err, result) => {
            if (result) { 
                result = result.map((a) => a.name).sort();
            }
            callback(err, result);
        });
    },

    /**
     * delete commands of a specific log branch
     * @param {string} project
     * @param {string} logname
     * @param {function(err, result)} callback 
     */
    delCommands: function (project, logname, callback) {
        var lkey = this.prefix + "commands:" + project + ':' + logname;
        this.client.del(lkey, callback);
    },

    /**
     * add commands to specific log branch
     * @param {string} project
     * @param {string} logname
     * @param {array of {name:xx, url:xx}} commands
     * @param {function(err, result)} callback 
     */
    addCommands: function (project, logname, commands, callback) {
        var lkey = this.prefix + "commands:" + project + ':' + logname;
        var lvals = commands.map(command => JSON.stringify(command));
        var params = [lkey].concat(lvals);
        params.push(callback);
        this.client.lpush.apply(this.client, params);
    },

     /**
     * execute commands to specific log branch
     * @param {string} project
     * @param {string} logname
     * @param {string} commands
     * @param {function(err, result)} callback 
     */
    exeCommand: function (project, logname, command, callback) {
        var lkey = this.prefix + "commands:" + project + ':' + logname;
        this.client.lrange(lkey, 0, -1, (err, result) => {
            if (result) {
                result = result.map((x) => JSON.parse(x));
                for (var i=0; i<result.length; i++) {
                    if (result[i].name === command) {
                        this.sendRequest(result[i].method, result[i].url, result[i].headers, result[i].body, callback);
                        break; 
                    }
                } 
            }else {
                callback(err, result);
            }
        });
    },

    // send request 
    sendRequest: function (method, url, headers, body, callback) {
        if (body) {
            headers['Content-Length'] = Buffer.byteLength(body);
        }
        request({
            uri: url,
            method: method || 'GET',
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10,
            headers: headers || {},
            body: body
        }, function (error, response, body) {
            if (error) {
                callback(error, null);
                return;
            }else {
                if (response.statusCode === 200) {
                    callback(null, body);
                    return;
                }else {
                    callback('command execute error!', null);
                    return;
                }            
            }
        });
    },
       

    /**
     * get charts with it's log branchs
     * @param {string} project
     * @param {string} logname
     * @param {function(err, result)} callback 
     */
    getCharts: function (project, logname, callback) {
        var key = this.prefix + 'charts:' + project + ':' + logname + ':*';
        this.client.keys(key, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }else {
                var set = {};
                for (var i=0; i<result.length; i++) {
                    var arr = result[i].split(':');
                    var chartName = arr[arr.length - 1];
                    if (!(chartName in set)) {
                        set[chartName] = true;
                    }
                }
                callback(null, Object.keys(set));
                return;
            }
        });
    },

    /**
     * get specific chart data 
     * @param {string} project
     * @param {string} logname
     * @param {string} chartname
     * @param {function(err, result)} callback 
     */
    getChartData: function (project, logname, chartname, callback) {
        var key = this.prefix + 'charts:' + project + ':' + logname + ':' + chartname;
        this.client.get(key, (err, res) => {
            callback(err, JSON.parse(res));
        }); 
    },
    
    /**
     * delete specific chart data 
     * @param {string} project
     * @param {string} logname
     * @param {string} chartname
     * @param {function(err, result)} callback 
     */
    delChart: function (project, logname, chartname, callback) {
        var key = this.prefix + 'charts:' + project + ':' + logname + ':' + chartname;
        this.client.del(key, callback); 
    },

    /**
     * add specific chart data 
     * @param {string} project
     * @param {string} logname
     * @param {string} chartname
     * @param {number} timestamp
     * @param {string} chartType 
     * @param {array} data
     * @param {function(err, result)} callback 
     */
    addChartData: function (project, logname, chartname, timestamp, chartType, data, callback) {
        var key = this.prefix + 'charts:' + project + ':' + logname + ':' + chartname;
        this.client.get(key, (err, result) => {
            var chartData = JSON.parse(result) || {}; 
            var dataOrigin = chartData.data || {};
            data.map((item) => {
                if (item.key in dataOrigin) {
                    if (dataOrigin[item.key].length >= 512) {
                        dataOrigin[item.key].pop();
                    }
                    dataOrigin[item.key].unshift([item.value, timestamp]);
                }else {
                    dataOrigin[item.key] = [[item.value, timestamp]];
                }
            });
            if (chartType) { chartData.type = chartType; }
            chartData.type = chartData.type || 'line'; // default chart type: line
            chartData.data = dataOrigin;
            this.client.set(key, JSON.stringify(chartData), callback);
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