import alt from '../alt'
import LogWindowActions from '../actions/logWindowActions'

class LogWindowStore {
    constructor () {
        this.bindActions(LogWindowActions);
        // data
        this.logsOrigin = [];
        this.logs = [];
        this.project = '';
        this.logname = '';

        // data for component
        this.page = 0;
        this.pageSize = 50;
        this.filter = '';
        this.commands = [];
    }

    filterLogs(logs, filter) {
        var newLogs = [];
        logs.map((log) => {
            if (filter.length == 0 || log.logtext.toLowerCase().indexOf(filter) >= 0) {
                newLogs.push(log);
            }
        });
        return newLogs;
    }

    onChangeFilter(filter) {
        this.filter = filter;
        this.logs = this.filterLogs(this.logsOrigin, this.filter);
    }

    onChangePage(move) {
        var mod = (this.logs.length % this.pageSize);
        var maxPage = (this.logs.length - mod) / this.pageSize;
        if (mod !== 0) { maxPage++; }

        // page in [0, maxPage-1]
        var newPage = this.page + move;
        if (newPage > maxPage - 1) { newPage = maxPage -1; }
        if (newPage < 0) { newPage = 0; }

        this.page = newPage;
    }

    onChangePageSize(pageSize) {
        this.pageSize = pageSize;
    }

    onGetLogsSuccessAppend(logs) {
        this.logsOrigin = logs.concat(this.logsOrigin);
        var newLogs = this.filterLogs(logs, this.filter);
        this.logs = newLogs.concat(this.logs);
    }

    onGetLogsSuccess(data) {
        this.logsOrigin = data.logs;
        this.project = data.project;
        this.logname = data.logname;
        this.logs = this.filterLogs(this.logsOrigin, this.filter);
    }

    onGetLogsFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }

    onGetCommandsSuccess(commands) {
        this.commands = commands;
    }

    onGetCommandsFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);