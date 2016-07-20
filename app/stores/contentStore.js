import alt from '../alt';
import ContentActions from '../actions/contentActions.js';

class ContentStore {
    constructor () {
        this.bindActions(ContentActions);
        this.commands = [];
        this.project = '';
        this.logname = '';
    }

    onSelectLogBranchSuccess(data) {
        this.commands = data.commands;
        this.project = data.project;
        this.logname = data.logname;
    }

    onAjaxFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}



export default alt.createStore(ContentStore);