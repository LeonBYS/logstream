import React from 'react';
import ChartsWindowActions from '../actions/chartsWindowActions.js';
import ChartsWindowStore from '../stores/chartsWindowStore.js'

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

var Line = null;
var Bar = null;

const defaultColors = [
    { // red
        backgroundColor: "rgba(247,70,74,0.2)",
        borderColor: "rgba(247,70,74,1)",
        pointBorderColor: "rgba(247,70,74,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(247,70,74,0.8)",
        pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    { // blue
        backgroundColor: "rgba(151,187,205,0.2)",
        borderColor: "rgba(151,187,205,1)",
        pointBorderColor: "rgba(151,187,205,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(151,187,205,0.8)",
        pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    { // green
        backgroundColor: "rgba(70,191,189,0.2)",
        borderColor: "rgba(70,191,189,1)",
        pointBorderColor: "rgba(70,191,189,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(70,191,189,0.8)",
        pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    { // yellow
        backgroundColor: "rgba(253,180,92,0.2)",
        borderColor: "rgba(253,180,92,1)",
        pointBorderColor: "rgba(253,180,92,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(253,180,92,0.8)",
        pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    { // light grey
        backgroundColor: "rgba(220,220,220,0.2)",
        borderColor: "rgba(220,220,220,1)",
        pointBorderColor: "rgba(220,220,220,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(220,220,220,0.8)",
        pointHoverBorderColor: "rgba(220,220,220,1)"
    },

    // { // grey
    //     fillColor: "rgba(148,159,177,0.2)",
    //     strokeColor: "rgba(148,159,177,1)",
    //     pointColor: "rgba(148,159,177,1)",
    //     pointStrokeColor: "#fff",
    //     pointHighlightFill: "#fff",
    //     pointHighlightStroke: "rgba(148,159,177,0.8)"
    // },
    // { // dark grey
    //     fillColor: "rgba(77,83,96,0.2)",
    //     strokeColor: "rgba(77,83,96,1)",
    //     pointColor: "rgba(77,83,96,1)",
    //     pointStrokeColor: "#fff",
    //     pointHighlightFill: "#fff",
    //     pointHighlightStroke: "rgba(77,83,96,1)"
    // }
];



class Chart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            timeSpanBase: 1000,
            timeSpanBaseName: 'seconds',
            timeSpan: 60, // 60s
            timeSpanIndex: 1,
        };
        this.timeoutID = null;

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
    }


    changeTimeSpan(index, span, base, name) {
        var state = this.state;
        state.timeSpanIndex = index;
        state.timeSpan = span;
        state.timeSpanBase = base;
        state.timeSpanBaseName = name;
        this.setState(state);
    }

    makeDataInSpanLine(data, x_start, x_end) {
        var dataNew = [];
        
        for (var i=0; i<data.length; i++) {
            if (data[i].x >= x_start && data[i].x <= x_end) {
                if (dataNew.length > 0) {
                    var sum_x = dataNew[dataNew.length-1].x;
                    var sum_y = dataNew[dataNew.length-1].y;
                    var count = 1;
                    while (Math.floor(dataNew[dataNew.length-1].x) === Math.floor(data[i].x)) {
                        sum_x += data[i].x;
                        sum_y += data[i].y;
                        count++;
                        i++;
                        if (i >= data.length) break;
                    }
                    dataNew[dataNew.length-1] = {x: sum_x/count, y:sum_y/count};
                }
                if (i<data.length) dataNew.push(data[i]);
            }
        }
        dataNew.unshift({x:x_start, y:null});
        dataNew.push({x:x_end, y:null});
        if (dataNew.length === 2) {
            dataNew[0].y = 0;
            //dataNew[1].y = 0;
        }
        return dataNew;
    }

    convertDataLine () {
        if (!this.props.data) return null;
        var tnow = Date.now();
        tnow += -(tnow % this.state.timeSpanBase);
        var data = { datasets: [] };

        var i = 0;
        for (var key in this.props.data) {
            var chartData = this.makeDataInSpanLine(
                this.props.data[key]
                    .map((o) => ({x:(o[1]-tnow)/this.state.timeSpanBase, y:o[0]}))
                    .sort((a, b) => a.x - b.x), 
                -this.state.timeSpan, 1
            );

            if (data.datasets.length === 0 || chartData.length > 2) {
                data.datasets.push(Object.assign({
                    label: key,
                    data: chartData,
                    // style options
                    borderCapStyle: 'butt',
                    fill:false,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                }, defaultColors[i++]));
            }
        }

        // for (var i=0; i<data.datasets.length; i++) {
        //     data.datasets[i].data = this.makeDataInSpanLine(data.datasets[i].data, -this.state.timeSpan, 1);
        // }

        // var i = 0;
        // for (var key in this.props.data) {
        //     data.datasets.push(Object.assign({
        //         label: key,
        //         data: this.props.data[key]
        //                 .map((o) => ({x:(o[1]-tnow)/this.state.timeSpanBase, y:o[0]}))
        //                 .sort((a, b) => a.x - b.x),
        //         // style options
        //         borderCapStyle: 'butt',
        //         fill:false,
        //         borderDash: [],
        //         borderDashOffset: 0.0,
        //         borderJoinStyle: 'miter',
        //         pointBorderWidth: 1,
        //         pointHoverRadius: 5,
        //         pointHoverBorderWidth: 2,
        //         pointRadius: 1,
        //         pointHitRadius: 10,
        //     }, defaultColors[i++]));
        // }

        
        return data;
    }

    convertDataBar() {
        if (!this.props.data) return null;
        var now = Date.now();
        var dt = this.state.timeSpan * this.state.timeSpanBase;
        var labels = Object.keys(this.props.data).sort();
        var datasets = [{
            backgroundColor: defaultColors.slice(0, labels.length).map(x => x.backgroundColor),
            borderColor: defaultColors.slice(0, labels.length).map(x => x.backgroundColor),
            borderWidth: 1,
            data: labels.map(x => this.props.data[x]).map(L => L.filter(o => now-o[1] <= dt).map(o => o[0]).reduce((x, y) => x+y, 0)).map(x => x===0 ? 0.1 : x)
        }];
        return {labels: labels, datasets: datasets}
    }

    convertData() {
        if (this.props.type === 'line') {
            return this.convertDataLine();
        }else if (this.props.type === 'bar') {
            return this.convertDataBar();
        }
    }

    handleChange(event, index, value) {
        if (value === 1) {
            this.changeTimeSpan(1, 60, 1000, 'seconds');
        } else if (value === 2) {
            this.changeTimeSpan(2, 60, 60 * 1000, 'minutes');
        } else if (value === 3) {
            this.changeTimeSpan(3, 24, 60 * 60 * 1000, 'hour');
        }
    }

    render () {
        var data = this.convertData();
        var options = { animation : false };
        if(!window || !data) { return <div/>; }

        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(() => {this.forceUpdate();}, this.state.timeSpanBase);
        
        if (!Line || !Bar) {
            Line = require('react-chartjs-2').Line;
            Bar = require('react-chartjs-2').Bar;
        }

        var chart = <h1> Invalid chart types! </h1>;
        if (this.props.type === 'line') {
            options.scales = {xAxes: [{type: 'linear', position: 'bottom'}]};
            chart = <Line data={data} options={options} redraw={false} height={50}/>;
        }else if (this.props.type === 'bar') {
            options.legend = {display: false};
            options.scales = {yAxes: [{type: 'logarithmic', position: 'left'}]};
            chart = <div style={{paddingTop:"10px"}}> <Bar data={data} options={options} redraw={false} height={100}/> </div>;
        }

        return (
            <div>
                <h2> {this.props.name} </h2>
                <DropDownMenu value={this.state.timeSpanIndex} onChange={this.handleChange}>
                    <MenuItem value={1} primaryText="Last 60 seconds" />
                    <MenuItem value={2} primaryText="Last 60 minutes" />
                    <MenuItem value={3} primaryText="Last 24 hour" />
                </DropDownMenu>
                {chart}
            </div>
        );
    } // end render
}


class ChartsWindow extends React.Component {
    constructor (props) {
        super(props);
        this.state = ChartsWindowStore.getState();
        this.onChange = this.onChange.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        process.nextTick(() => {
            ChartsWindowActions.getCharts(this.props.project, this.props.logname);
        });
    }

    componentDidMount() {
        ChartsWindowStore.listen(this.onChange);
        process.nextTick(() => {
            ChartsWindowActions.getCharts(this.props.project, this.props.logname);
        });
    }

    componentWillUnmount() {
        ChartsWindowStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        //console.log('charts window render!', this.state.charts);
        return (
            <div> 
                {this.state.charts.map((chartname) => {
                    var chart = this.state.chartsData[chartname];
                    var data = chart ? chart.data : null;
                    var type = chart ? chart.type : null;
                    return (
                        <Chart 
                            key={this.state.project + '/' + this.state.logname + '/chart/' + chartname}
                            name={chartname} 
                            data={data}
                            type={type}/>
                    );
                })}
            </div>
        );
    }
}

export default ChartsWindow;