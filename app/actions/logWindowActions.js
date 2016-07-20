import alt from '../alt';

class LogWindowActions {
    constructor () {
        this.generateActions(
            'getLogsSuccessAppend',
            'getLogsSuccess',
            'ajaxFail',
            'scroll',
            'changeFilter',
            'changePage',
            'changePageSize'
        )
        this.internalID = null;
        this.lastTimestamp = null;
    }

    changeFocus(project, logname) {
        if (this.internalID) {
            clearInterval(this.internalID);
            this.lastTimestamp = null;
        }
        this.getLogs(project, logname, this.lastTimestamp);
        this.internalID = setInterval(
            function() { this.getLogs(project, logname, this.lastTimestamp); }.bind(this), 
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
            if (data && data.length > 0) {
                this.lastTimestamp = data[0].timestamp;
                if (timestamp) {
                    this.getLogsSuccessAppend(data);
                }else {
                    this.getLogsSuccess({logs: data, project: project, logname: logname});
                }
            }else if (this.lastTimestamp === null) { 
                // data is [] or null, this branch doesn't have log data
                this.getLogsSuccess({logs: [], project: project, logname: logname});
            }
        }).fail((jqXhr) => {
            this.ajaxFail(jqXhr);
        });
    }
}

export default alt.createActions(LogWindowActions);