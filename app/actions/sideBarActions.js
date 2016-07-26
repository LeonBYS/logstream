import alt from '../alt';
import api from '../api';

class SideBarActions {
    constructor () {
        this.generateActions(
            'getProjectsSuccess',
            'getProjectsFail'
        )
    }

    changeFilter(filter) {
        return filter;
    }
    
    getProjects() {
        api.ajax({
            url: '/api/projects',
            dataType: 'json',
            cache: false
        }, (data) => {
            this.getProjectsSuccess(data);
        }, (jqXhr) => {
            this.getProjectsFail(jqXhr);
        });
        return false;
    }
}

export default alt.createActions(SideBarActions);