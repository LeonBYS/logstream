import alt from '../alt';
import api from '../api';

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
    
    getLogs(project, logname, timestamp) {
        var url = '/api/' + project + '/' + logname + '/logs';
        if (timestamp) {
            url += '?timestamp=' + timestamp;        
        }else {
            url += '?count=1000';
        }
        api.ajax({
            url: url,
            dataType: 'json',
            cache: false
        }, (data) => {
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
        }, (jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }
}

export default alt.createActions(LogWindowActions);