'use strict'

import React from 'react';
import LogWindowStore from '../stores/logWindowStore';
import LogWindowActions from '../actions/logWindowActions';

class LogSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        LogWindowActions.changeFilter(event.target.value);
    }

    render() {
        return (
            <div className="input-group custom-search-form pull-right">
                <input type="text" onChange={this.handleChange} className="input-sm" placeholder="Filter..." />
            </div>
        );
    }
}

class MsgItem extends React.Component {
    render() {
        return (
            <p style={{color: "#f1f1f1", margin:"0"}}>
                <a style={{color: "#666"}}>{this.props.index}</a>
                <span>{this.props.text}</span>
            </p>
        );
    }
}

class MsgHeader extends React.Component {
    constructor(props) {
        super(props);
        this.logHeaderStyle = { backgroundColor: "#666", margin:"0" };
        this.iStyle = {cursor:"pointer", marginRight:"3px", marginLeft:"3px", color:"#000"};
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }
    handlePause(event) {
        LogWindowActions.scroll(0);
    }
    handlePlay(event) {
        LogWindowActions.scroll(100000000);
    }
    render() {
        var iplay = (<i onClick={this.handlePlay} className="fa fa-play" aria-hidden="true" style={{cursor:"pointer", marginRight:"13px", marginLeft:"3px", color:"#000"}}></i>);
        var ipause = (<i onClick={this.handlePause} className="fa fa-pause" aria-hidden="true" style={{cursor:"pointer", marginRight:"13px", marginLeft:"3px", color:"#000"}}></i>);
        return (
            <div className="row" style={this.logHeaderStyle}>
                <div className="col-md-8" style={{paddingTop:"6px"}}>
                    {this.props.pause ? iplay : ipause}
                </div>
                <div className="col-md-4">
                    <LogSearchBar />
                </div>
            </div>
        );
    }
}

class MsgWindow extends React.Component {
    constructor(props) {
        super(props);
        this.styleOut = {
            fontFamily:"Monaco, Inconsolata, monospace", 
            backgroundColor: "#222",
            padding: "10px"
        };  
        this.handleWheel = this.handleWheel.bind(this);
    }
    handleWheel(event) {
        LogWindowActions.scroll(event.deltaY);
    }
    render() {
        var index = this.props.start;
        var logContent = this.props.logs.map((item) => {
            index = index + 1;
            try {
                var timestring = new Date(Number(item.timestamp)).toLocaleString();
                return (
                    <MsgItem key={index} index={index} time={timestring} text={item.logtext} />
                );
            } catch (e) {
                return (<MsgItem key={index} index={index} time="NA" text={item.toString()} />);
            }
        });
        return (
            <div onWheel={this.handleWheel} style={this.styleOut}>                    
                {logContent}
            </div>
        );
    }
}


class LogWindow extends React.Component {
    constructor (props) {
        super(props);
        this.state = LogWindowStore.getState();
        this.onChange = this.onChange.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        process.nextTick(() => {
            LogWindowActions.getLogs(this.props.project, this.props.logname);
        });
    }

    componentDidMount() {
        LogWindowStore.listen(this.onChange);
        process.nextTick(() => {
            LogWindowActions.getLogs(this.props.project, this.props.logname);
        });
    }

    componentWillUnmount() {
        LogWindowStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        var start = this.state.start < 0 ? this.state.linesFilted.length - this.state.height : this.state.start;
        start = Math.max(start, 0); // start >= 0
        var end = start + this.state.height;
        end = Math.min(end, this.state.linesFilted.length); // log <= logs.length
        var logs = this.state.linesFilted.slice(start, end);
        return (
            <div>
                <MsgHeader pause={this.state.start >= 0} />
                <MsgWindow logs={logs} start={start} />
            </div>
        );
    }
}

export default LogWindow; 