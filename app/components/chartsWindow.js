import React from 'react';
import ChartsWindowActions from '../actions/chartsWindowActions.js';
import ChartsWindowStore from '../stores/chartsWindowStore.js'


class Chart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            timeSpanBase: 1000,
            timeSpanBaseName: 'seconds',
            timeSpan: 60, // 60s
        };
        this.timeoutID = null;
    }

    changeTimeSpan(span, base, name) {
        var state = this.state;
        state.timeSpan = span;
        state.timeSpanBase = base;
        state.timeSpanBaseName = name;
        this.setState(state);
    }

    makeDataInSpan(data, x_start, x_end) {
        var dataNew = [];
        //dataNew.push({x:x_start, y:null});
        
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
        return dataNew;
    }

    convertData () {
        if (!this.props.data) return null;
        var tnow = Date.now();
        tnow += -(tnow % this.state.timeSpanBase);
        var data = { datasets: [] };
        for (var key in this.props.data) {
            data.datasets.push({
                label: key,
                data: this.props.data[key]
                        .map((o) => ({x:(o[1]-tnow)/this.state.timeSpanBase, y:o[0]}))
                        .sort((a, b) => a.x - b.x)
            });
        }
        for (var i=0; i<data.datasets.length; i++) {
            data.datasets[i].data = this.makeDataInSpan(data.datasets[i].data, -this.state.timeSpan, 1);
        }
        return data;
    }

    render () {
        var data = this.convertData();
        if (!data) return <div/>; 

        var options = {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            animation : false
        };

        if(!window) { return <div/>; } 

        if (this.props.type === 'line') {
            if (this.timeoutID) {
                clearTimeout(this.timeoutID);
            }
            this.timeoutID = setTimeout(() => {this.forceUpdate();}, this.state.timeSpanBase);
            var Line = require('react-chartjs-2').Line;
            return (
                <div>
                    <h2> {this.props.name} </h2>
                    <div className="btn-group" role="group" style={{ marginRight: "15px" }}>
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {"Time Span: last " + this.state.timeSpan + " " + this.state.timeSpanBaseName}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a style={{cursor:"pointer"}} onClick={() => { this.changeTimeSpan(60, 1000, 'seconds'); } }>last 60 seconds</a></li>
                            <li><a style={{cursor:"pointer"}} onClick={() => { this.changeTimeSpan(60, 60 * 1000, 'minutes'); } }>last 60 minutes</a></li>
                            <li><a style={{cursor:"pointer"}} onClick={() => { this.changeTimeSpan(24, 60 * 60 * 1000, 'hour'); } }>last 24 hour</a></li>
                        </ul>
                    </div>
                    <Line data={data} options={options} redraw={true} height={50}/>
                </div>
            );
        }else {
            return <h1> Invalid chart types! </h1>;
        }
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
        console.log('charts window render!');
        return (
            <div> 
                {this.state.charts.map((chartname) => {
                    var chart = this.state.chartsData[chartname];
                    var data = chart ? chart.data : null;
                    var type = chart ? chart.type : null;
                    return (
                        <Chart key={chartname} 
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