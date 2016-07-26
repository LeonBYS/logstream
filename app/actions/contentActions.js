import alt from '../alt';
import api from '../api.js';

class ContentActions {
    constructor () {
        this.generateActions(
            'selectLogBranchSuccess',
            'ajaxFail'
        )
        this.internalID = null;
        this.lastTimestamp = null;
    }

    selectLogBranch(project, logname) {
        var url = '/api/' + project + '/' + logname + '/commands';
        api.ajax({
            url: url,
            dataType: 'json',
            cache: false
        }, (commands) => {
            this.selectLogBranchSuccess({commands:commands, project:project, logname:logname});
        }, (jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }
}


export default alt.createActions(ContentActions);
