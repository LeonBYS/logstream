import alt from '../alt';
import LogWindowActions from '../actions/logWindowActions';

class LogWindowStore {
    constructor () {
        this.bindActions(LogWindowActions);
        // data
        this.logs = [];
        this.linesOrigin = [];
        this.linesFilted = [];

        // data for component
        this.filter = '';
        this.level = 0;
        this.dateStart = null;
        this.dateEnd = null;
    }

    filterLines(lines, filter, level) {
        return lines.filter((line) => {
            var a = filter ? line.logtext.match(new RegExp(filter, 'i')) : true;
            var b = line.level >= level;
            var c = this.dateStart ?  line.timestamp >= this.dateStart.getTime() : true;
            var d = this.dateEnd ? line.timestamp <= this.dateEnd.getTime() : true;
            return a && b && c && d;
        });
    }

    convertLogsToLines(logs) {
        var lines = logs.reduce((a, b) => a + b.logtext, '').split('\n');
        if (lines[lines.length - 1].length === 0) { lines.pop(); }

        var pos = 0, size = 0;
        var results = [];
        for (var i=0; i<lines.length; i++) {
            size += lines[i].length + 1; // +1 for '\n'
            results.push({timestamp: logs[pos].timestamp, logtext: lines[i], level:logs[pos].level || 0});
            if (size >= logs[pos].logtext.length) {
                size -= logs[pos].logtext.length;
                pos++;
            }
        }
        return results;
    }

    mergeLines(lines0, lines1) { // merge two ordered line list
        // a good solution is merge sort... but we naviely sort the added array now
        var newLines = lines0.concat(lines1);
        if (lines0.length > 0 && lines1.length > 0 && lines1[0].timestamp >= lines0[lines0.length - 1].timestamp) {
            // sorted
        }else {
            newLines.sort((a, b) => a.timestamp - b.timestamp);
        }
        return newLines;
    }

    onChangeStartDate(date) {
        this.dateStart = date;
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter, this.level);
    }

    onChangeEndDate(date) {
        this.dateEnd = date;
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter, this.level);
    }

    onChangeLevel(level) {
        this.level = level;
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter, this.level);
    }

    onChangeFilter(filter) {
        this.filter = filter;
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter, this.level);
    }

    onGetLogsSuccessAppend(logs) {
        logs.sort((a, b) => a.timestamp - b.timestamp);
        this.logs = this.logs.concat(logs);
        // use lines
        var linesOrigin = this.convertLogsToLines(logs);
        this.linesOrigin = this.mergeLines(this.linesOrigin, this.convertLogsToLines(logs));
        var linesFilted = this.filterLines(linesOrigin, this.filter, this.level);
        this.linesFilted = this.mergeLines(this.linesFilted, linesFilted);
    }

    onGetLogsSuccess(data) {        
        this.filter = '';
        this.level = 0;
        this.dateStart = null;
        this.dateEnd = null;
        this.logs = data.logs.filter((log) => log.logtext).sort((a, b) => a.timestamp - b.timestamp);
        // use lines
        this.linesOrigin = this.convertLogsToLines(this.logs);
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter, this.level);
    }

    onAjaxFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);