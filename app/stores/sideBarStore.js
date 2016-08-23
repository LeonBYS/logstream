import alt from '../alt'
import SideBarActions from '../actions/sideBarActions'

class SideBarStore {
    constructor () {
        this.bindActions(SideBarActions);
        this.originProjects = [];
        this.projects = [];
        this.filter = "";
    }

    updateProjects() {
        var projects = [];
        this.originProjects.map((project) => {
            if (this.filter.length == 0) {
                projects.push(project);
            }else if (project.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
                projects.push(project);
            }else {
                var newProject = {name:project.name, lognames:[]};
                project.lognames.map((logname) => {
                    if (logname.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
                        newProject.lognames.push(logname);
                    }
                });
                if (newProject.lognames.length > 0) {
                    projects.push(newProject);
                }
            }
        });
        this.projects = projects;
    }

    onChangeFilter(filter) {
        this.filter = filter;
        this.updateProjects();
    }

    onGetProjectsSuccess(data) {
        this.originProjects = data.map(p => ({name:p.name, lognames:p.lognames.sort((a,b) => a<b? -1:1)}));
        this.updateProjects();
    }

    onGetProjectsFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}


export default alt.createStore(SideBarStore);