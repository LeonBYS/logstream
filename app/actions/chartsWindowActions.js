import alt from '../alt';
import api from '../api';

class ChartsWindowActions {
    constructor() {
        this.generateActions(
            'getChartsSuccess',
            'getChartDataSuccess',
            'updateChartData',
            'ajaxFail'
        );
    }
    
    getCharts(project, logname) {
        api.ajax({
            url: '/api/' + project + '/' + logname + '/charts',
            dataType: 'json',
            cache: false
        }, (data) => {
            this.getChartsSuccess({project:project, logname:logname, charts:data});
            for (var i=0; i<data.length; i++) {
                this.getChartData(project, logname, data[i]);
            }
        }, (jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }

    getChartData(project, logname, chartname) {
        api.ajax({
            url: '/api/' + project + '/' + logname + '/charts/' + chartname,
            dataType: 'json',
            cache: false
        }, (data) => {
            this.getChartDataSuccess({name: chartname, data: data});
        }, (jqXhr) => {
            this.ajaxFail(jqXhr);
        });
        return false;
    }
}

export default alt.createActions(ChartsWindowActions);