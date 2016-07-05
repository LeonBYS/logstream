import alt from '../alt'
import SideBarActions from '../actions/sideBarActions'

class SideBarStore {
    constructor () {
        this.bindActions(SideBarActions);
        this.projects = {};
    }

    getProjectsSuccess(data) {
        this.projects = data;
    }

    getProjectsFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(SideBarStore);