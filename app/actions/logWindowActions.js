import alt from '../alt';

class LogWindowActions {
    constructor () {
        this.generateActions(
            'getLogsSuccess',
            'getLogsFail'
        )
        this.internalID = null;
        this.prevLogs = [];
    }

    changePage(move) {
        return move;
    }

    changePageSize(pageSize) {
        return pageSize;
    }

    changeFocus(project, logname) {
        var getLastLogTimeStamp = function() {
            return this.prevLogs.length > 0 ? this.prevLogs[0].timestamp : null;
        }.bind(this);

        if (this.internalID) {
            clearInterval(this.internalID);
            this.prevLogs = [];
        }
        this.getLogs(project, logname, getLastLogTimeStamp());
        this.internalID = setInterval(
            function() { this.getLogs(project, logname, getLastLogTimeStamp()); }.bind(this), 
            1000
        );
    }
    
    getLogs(project, logname, timestamp) {
        var url = '/api/' + project + '/' + logname + '/logs';
        if (timestamp) {
            url += '?timestamp=' + timestamp;
        }
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false
        }).done((data) => {
            this.prevLogs = data.concat(this.prevLogs);
            this.getLogsSuccess({logs: this.prevLogs, project: project, logname: logname});
        }).fail((jqXhr) => {
            this.getLogsFail(jqXhr);
        });
        return false;
    }
}

export default alt.createActions(LogWindowActions);