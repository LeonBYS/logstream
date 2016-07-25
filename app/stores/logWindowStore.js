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
        this.height = 24;
        this.start = -this.height;
    }

    filterLines(lines, filter) {
        if (!filter || filter.length === 0) { return lines; }
        return lines.filter((line) => line.logtext.match(new RegExp(filter, 'i')));
    }

    convertLogsToLines(logs) {
        var lines = logs.reduce((a, b) => a + b.logtext, '').split('\n');
        if (lines[lines.length - 1].length === 0) { lines.pop(); }

        var pos = 0, size = 0;
        var results = [];
        for (var i=0; i<lines.length; i++) {
            size += lines[i].length + 1; // +1 for '\n'
            results.push({timestamp: logs[pos].timestamp, logtext: lines[i]});
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


    onScroll(deltaY) {
        if (deltaY === 0) { // pause
            if (this.start < 0) { this.start = Math.max(0, this.linesFilted.length - this.height); }
        }else {
            deltaY = Math.floor(deltaY/50);
            if (this.start < 0) {
                this.start = this.linesFilted.length - this.height + deltaY;
            }else {
                this.start += deltaY;
            }
            if (this.start < 0) { this.start = 0; }
            if (this.start > this.linesFilted.length - this.height) { this.start = -this.height; }
        }
    }

    onChangeFilter(filter) {
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter);
    }

    onGetLogsSuccessAppend(logs) {
        logs.sort((a, b) => a.timestamp - b.timestamp);
        this.logs = this.logs.concat(logs);
        // use lines
        var linesOrigin = this.convertLogsToLines(logs);
        this.linesOrigin = this.mergeLines(this.linesOrigin, this.convertLogsToLines(logs));
        var linesFilted = this.filterLines(linesOrigin, this.filter);
        this.linesFilted = this.mergeLines(this.linesFilted, linesFilted);
    }

    onGetLogsSuccess(data) {        
        this.start = -this.height;
        this.filter = '';
        this.logs = data.logs.filter((log) => log.logtext).sort((a, b) => a.timestamp - b.timestamp);
        // use lines
        this.linesOrigin = this.convertLogsToLines(this.logs);
        this.linesFilted = this.filterLines(this.linesOrigin, this.filter);
    }

    onAjaxFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);