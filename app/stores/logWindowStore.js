import alt from '../alt'
import LogWindowActions from '../actions/logWindowActions'

class LogWindowStore {
    constructor () {
        this.bindActions(LogWindowActions);
        this.logs = [];
    }

    onGetLogsSuccess(data) {
        this.logs = data;
    }

    onGetLogsFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(LogWindowStore);