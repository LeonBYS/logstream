import React from 'react';
import ChartsWindowActions from '../actions/chartsWindowActions.js';
import ChartsWindowStore from '../stores/chartsWindowStore.js'


class Chart extends React.Component {
    render () {
        var chartData = ChartsWindowStore.getState().chartsData[this.props.name];
        console.log(this.props, chartData);
        if (!chartData) return <div />;

        var data = {
            datasets: []
        };
        for (var key in chartData.data) {
            data.datasets.push({
                label: key,
                data: chartData.data[key].map((o) => ({x:o[1], y:o[0]}))
            });
        }
        for (var i=0; i<data.datasets.length; i++) {
            var arr = data.datasets[i].data;
            if (arr.length > 10) {
                data.datasets[i].data = arr.slice(arr.length-10);
            }
        }

        var options = {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            animation : false
        };

        var graph;
        if(!window) {
            graph = (<div></div>);
        } else {
            if (chartData.type === 'line') {
                var Line = require('react-chartjs-2').Line;
                graph = <Line data={data} options={options} redraw={true}/>;
            }
        }
        return graph;
    }
}


class ChartsWindow extends React.Component {
    rand(min, max, num) {
        var rtn = [];
        while (rtn.length < num) {
            rtn.push((Math.random() * (max - min)) + min);
        }
        return rtn;
    }

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
                {this.state.charts.map((chartname) => <Chart key={chartname} name={chartname} height="400px"/>)}
            </div>
        );
    }
}

export default ChartsWindow;