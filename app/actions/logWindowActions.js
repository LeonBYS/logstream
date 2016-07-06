import alt from '../alt';

class LogWindowActions {
    constructor () {
        this.generateActions(
            'getLogsSuccess',
            'getLogsFail'
        )
    }
    
    getLogs(project, logname) {
        $.ajax({
            url: '/api/' + project + '/' + logname + '/logs',
            dataType: 'json',
            cache: false
        }).done((data) => {
            this.getLogsSuccess(data);
        }).fail((jqXhr) => {
            this.getLogsFail(jqXhr);
        });
        return false;
    }
}

export default alt.createActions(LogWindowActions);