import alt from '../alt';
import LogWindowActions from '../actions/logWindowActions';

class LogWindowStore {
    constructor () {
        this.bindActions(LogWindowActions);
        // data
        this.logsOrigin = [];
        this.logs = [];

        // data for component
        this.filter = '';
        this.height = 24;
        this.start = -this.height;
    }

    onScroll(deltaY) {
        if (deltaY === 0) { // pause
            if (this.start < 0) this.start = this.logs.length - this.height;
        }else {
            deltaY = Math.floor(deltaY/50);
            if (this.start < 0) {
                this.start = this.logs.length - this.height + deltaY;
            }else {
                this.start += deltaY;
            }
            if (this.start < 0) { this.start = 0; }
            if (this.start > this.logs.length - this.height) { this.start = -this.height; }
        }
    }

    filterLogs(logs, filter) {
        var newLogs = [];
        logs.map((log) => {
            if (filter.length === 0 || log.logtext.toLowerCase().indexOf(filter) >= 0) {
                newLogs.push(log);
            }
        });
        return newLogs;
    }

    onChangeFilter(filter) {
        this.filter = filter.toLowerCase();
        this.logs = this.filterLogs(this.logsOrigin, this.filter);
    }

    onGetLogsSuccessAppend(logs) {
        logs.sort((a, b) => a.timestamp - b.timestamp);
        // remove the repeated last element
        if (logs[0].timestamp === this.logsOrigin[this.logsOrigin.length - 1].timestamp) {
            this.logsOrigin.pop();
        }
        if (logs[0].timestamp === this.logs[this.logs.length - 1].timestamp) {
            this.logs.pop();
        }
        // concat logsOrigin
        this.logsOrigin = this.logsOrigin.concat(logs);
        // concat logs with filted/sorted newLogs
        var newLogs = this.filterLogs(logs, this.filter);
        this.logs = this.logs.concat(newLogs.sort((a, b) => a.timestamp - b.timestamp));
    }

    onGetLogsSuccess(data) {        
        this.start = -this.height;
        this.filter = '';
        this.logsOrigin = data.logs.sort((a, b) => a.timestamp - b.timestamp);
        this.logs = this.filterLogs(this.logsOrigin, this.filter);
    }

    onAjaxFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);