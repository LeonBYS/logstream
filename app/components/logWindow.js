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
        LogWindowActions.getLogs('LogStream', 'Console');
    }

    componentWillUnmount() {
        LogWindowStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        var logs = this.state.logs.map(item => {
            try {
                item = JSON.parse(item);
                var timestring = new Date(item.timestamp).toLocaleTimeString();
                return (
                    <LogItem key={item.timestamp} time={timestring} text={item.logtext} />
                );
            } catch (e) {
                item = item.toString();
                return (<LogItem key={item} time="NA" text={item} />);
            }
        });
        return (
             <div className="row">
                <div className="col-lg-12" style={{marginTop:"1%"}}>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            Log Window
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