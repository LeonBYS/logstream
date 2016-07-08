import alt from '../alt'
import LogWindowActions from '../actions/logWindowActions'

class LogWindowStore {
    constructor () {
        this.bindActions(LogWindowActions);
        // data
        this.logs = [];
        this.project = '';
        this.logname = '';

        // data for component
        this.page = 0;
        this.pageSize = 50;
        //this.filter = '';
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

    onGetLogsSuccess(data) {
        this.logs = data.logs;
        this.project = data.project;
        this.logname = data.logname;
    }

    onGetLogsFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);