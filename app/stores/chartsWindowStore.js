import alt from '../alt';
import ChartsWindowActions from '../actions/chartsWindowActions.js';

class ChartsWindowStore {
    constructor () {
        this.bindActions(ChartsWindowActions);
        this.chartsData = {};
        this.charts = [];
        this.project = null;
        this.logname = null;
    }

    getChartData(chartname) {
        return this.chartsData[chartname];
    }

    onGetChartsSuccess(data) {
        this.project = data.project;
        this.logname = data.logname;
        this.charts = data.charts;
    }

    onGetChartDataSuccess(chartData) {
        this.chartsData[chartData.name] = chartData.data;
    }

    onUpdateChartData(data) {
        var chartname = data.chartname;
        var timestamp = data.timestamp;
        var chartType = data.chartType;
        var appendData = data.data;

        if (!this.chartsData[chartname]) { 
            this.chartsData[chartname] = {};
            this.chartsData[chartname].data = {};
            this.charts.push(chartname);
        }

        for (var i=0; i<appendData.length; i++) {
            var key = appendData[i].key;
            var val = appendData[i].value;
            if (!this.chartsData[chartname].data[key]) {
                this.chartsData[chartname].data[key] = [];
            }
            this.chartsData[chartname].data[key].push([val, timestamp]);
            //this.chartsData[chartname].data[key].sort((a, b) => a[1] - b[1]);
        }
        if (chartType) {
            this.chartsData[chartname].type = chartType;
        }
        if (!this.chartsData[chartname].type) {
            this.chartsData[chartname].type = 'line';
        }
    }

    onAjaxFail(jqXhr) {
   	    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}



export default alt.createStore(ChartsWindowStore);