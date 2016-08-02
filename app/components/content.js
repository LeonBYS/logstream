import React from 'react';
import ContentStore from '../stores/contentStore';
import ContentActions from '../actions/contentActions';
import LogWindow from './logWindow';
import ChartsWindow from './chartsWindow';

import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

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
            return (<div>
                <h2> {this.state.project + '/' + this.state.logname}</h2>
                <Divider style={{ marginBottom: "20px" }}/>
                <div>
                    {this.state.commands.map((command) =>
                        <LogUserCommand key={command} command={command} project={this.state.project} logname={this.state.logname}/>
                    )}
                </div>
                <Tabs>
                    <Tab label="Logggs" >
                        <LogWindow project={this.state.project} logname={this.state.logname} />
                    </Tab>
                    <Tab label="Charts" >
                        <ChartsWindow project={this.state.project} logname={this.state.logname} />
                    </Tab>
                </Tabs>
            </div>);
        }else {
            return (<div style={{textAlign: 'center', paddingTop:"100px", paddingBottom:"100px"}}> 
                <h1> LogStream </h1>
                <h4 style={{marginTop:"20px", marginBottom:"50px"}}> 
                    View, manage, analyze your app logs centrally in real time :) 
                </h4> 
                <RaisedButton
                    label="Github"
                    secondary={true}
                    href="https://github.com/usstwxy/logstream"
                />
            </div>);
        }
    }
}

export default Content;