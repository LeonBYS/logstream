'use strict'

import React from 'react'
import LogWindowStore from '../stores/logWindowStore';
import LogWindowActions from '../actions/logWindowActions'



class LogItem extends React.Component {
    render () {
        return (
            <tr><td>{this.props.time}</td><td >{this.props.text}</td></tr>
        );
    }
}

class LogWindow extends React.Component {
    constructor (props) {
        super(props);
        this.state = LogWindowStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        LogWindowStore.listen(this.onChange);
    }

    componentWillUnmount() {
        LogWindowStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        var index = 0;
        var logs = this.state.logs.slice(0, 100).map(item => {
            index = index + 1;
            try {
                var timestring = new Date(item.timestamp).toLocaleString();
                return (
                    <LogItem key={index} time={timestring} text={item.logtext} />
                );
            } catch (e) {
                return (<LogItem key={index} time="NA" text={item.toString()} />);
            }
        });

        return (
             <div className="row">
                <div className="col-lg-12" style={{marginTop:"5px"}}>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4>{this.state.project + '/' + this.state.logname + '(' + this.state.logs.length + ')'}</h4>
                                </div>
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-4 text-right">
                                    <div className="input-group custom-search-form" style={{marginTop:"1%"}}>
                                        <input type="text" className="form-control" placeholder="Filter..." />
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" type="button">
                                                <i className="fa fa-filter"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="dataTable_wrapper">                    
                                <table className="table table-striped table-bordered table-hover" id="dataTables-example">
                                    <thead>
                                        <tr><th width="20%">Time</th><th>Log</th></tr>
                                    </thead>
                                    <tbody>
                                        {logs}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogWindow; 