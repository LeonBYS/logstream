import alt from '../alt';

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
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false
        }).done((commands) => {
            this.selectLogBranchSuccess({commands:commands, project:project, logname:logname});
        }).fail((jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }
}


export default alt.createActions(ContentActions);
