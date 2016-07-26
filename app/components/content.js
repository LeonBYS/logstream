import React from 'react';
import ContentStore from '../stores/contentStore';
import ContentActions from '../actions/contentActions';
import LogWindow from './logWindow'



class LogUserCommand extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        // call this.props.url
        $.ajax({
            method: 'GET',
            url: '/api/' + this.props.project + '/' + this.props.logname + '/commands/' + this.props.command,
            cache: false,
            success: function (data) {} // do nothing 
        });
    }

    render() {
        return (
            <button onClick={this.handleClick} type="button" style={{marginTop:"2px", marginRight:"5px"}} className="btn btn-success">{this.props.command}</button>
        );
    }
}


class Content extends React.Component {
    constructor (props) {
        super(props);
        this.state = ContentStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        ContentStore.listen(this.onChange);
    }

    componentWillUnmount() {
        ContentStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        if (this.state.project && this.state.logname) {
            return (
                <div id="page-wrapper">
                    <div className="row">
                        <div className="col-lg-12" style={{ marginTop: "5px" }}>
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <h4>{this.state.project + '/' + this.state.logname}</h4>
                                        </div>
                                        <div className="col-md-8 text-right">
                                            {this.state.commands.map((command) =>
                                                <LogUserCommand key={command} command={command} project={this.state.project} logname={this.state.logname}/>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="panel-body">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a data-toggle="tab" href="#logswindow">Logs Window</a></li>
                                        <li><a data-toggle="tab" href="#charts">Charts</a></li>
                                        <li><a data-toggle="tab" href="#settings">Settings</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="logswindow" className="tab-pane fade in active">
                                            <LogWindow project={this.state.project} logname={this.state.logname} />
                                        </div>
                                        <div id="charts" className="tab-pane fade">
                                            <h3>Here is your charts</h3>
                                        </div>
                                        <div id="settings" className="tab-pane fade">
                                            <h3>Here is your setting for this log branch</h3>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else {
            return (
                <div id="page-wrapper">
                    <div className="row">
                        <div className="col-lg-12" style={{ marginTop: "5px" }}>
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4> Hello </h4>
                                </div>
                                <div className="panel-body">
                                    <div className="jumbotron" style={{paddingLeft:"10%"}}>
                                        <h1>LogStream</h1>
                                        <p>log your everything!</p>
                                        <p><a className="btn btn-primary btn-lg" href="https://github.com/usstwxy/logstream" role="button">Learn more</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Content;