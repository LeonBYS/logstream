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
            url: this.props.url,
            cache: false,
            success: function (data) {} // do nothing 
        });
    }

    render() {
        return (
            <button onClick={this.handleClick} type="button" style={{marginTop:"2px", marginRight:"5px"}} className="btn btn-success">{this.props.name}</button>
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
                                        <div className="col-md-4">
                                        </div>
                                        <div className="col-md-4 text-right">
                                            {this.state.commands.map((command) =>
                                                <LogUserCommand name={command.name} url={command.url}/>
                                            ) }
                                        </div>
                                    </div>
                                </div>

                                <div className="panel-body">
                                    <LogWindow project={this.state.project} logname={this.state.logname} />
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
                                    <h5> Please choose a log :) </h5>
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