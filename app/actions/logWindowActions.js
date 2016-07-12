import alt from '../alt';

class LogWindowActions {
    constructor () {
        this.generateActions(
            'getLogsSuccessAppend',
            'getLogsSuccess',
            'getCommandsSuccess',
            'ajaxFail',
            'changeFilter',
            'changePage',
            'changePageSize'
        )
        this.internalID = null;
        this.lastTimestamp = null;
    }

    getCommands(project, logname) {
        var url = '/api/' + project + '/' + logname + '/commands';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false
        }).done((data) => {
            this.getCommandsSuccess(data);
        }).fail((jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }

    changeFocus(project, logname) {
        if (this.internalID) {
            clearInterval(this.internalID);
            this.lastTimestamp = null;
        }
        this.getLogs(project, logname, this.lastTimestamp);
        this.getCommands(project, logname);
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
        return false;
    }
}

export default alt.createActions(LogWindowActions);