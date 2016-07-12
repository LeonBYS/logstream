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

class LogPageBar extends React.Component {
    constructor (props) {
        super(props);
    }

    handleChangePageSize(pageSize) {
        LogWindowActions.changePageSize(pageSize);
    }

    handleChangePage(move) {
        LogWindowActions.changePage(move);
    }

    render () {
        var start = this.props.page * this.props.pageSize;
        var end = start + this.props.pageSize - 1;
        
        return (
            <div style={{marginBottom:"6px"}} className="btn-toolbar" role="toolbar">
                <div className="btn-group" role="group" style={{marginRight:"15px"}}>
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {"PageSize:" + this.props.pageSize}
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a href="#" onClick={()=>{this.handleChangePageSize(50);}}>50</a></li>
                        <li><a href="#" onClick={()=>{this.handleChangePageSize(100);}}>100</a></li>
                    </ul>
                </div>

                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={()=>{this.handleChangePage(-this.props.page);}}>
                        <span className="fa fa-fast-backward" aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" onClick={()=>{this.handleChangePage(-1);}}>
                        <span className="fa fa-backward" aria-hidden="true"></span>
                    </button>
                </div>
                
                <span className="btn-group" style={{fontSize:"1.5em", marginLeft:"10px", marginRight:"5px", marginTop:"2px"}}>
                    {start + "-" + end}
                </span>

                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={()=>{this.handleChangePage(1);}}>
                        <span className="fa fa-forward" aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" onClick={()=>{this.handleChangePage(100000000);}}>
                        <span className="fa fa-fast-forward" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        );
    }
}

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
            <div className="input-group custom-search-form">
                <input type="text" onChange={this.handleChange} className="form-control" placeholder="Filter..." />
                <div className="input-group-addon"><i className="fa fa-filter"></i></div>
            </div>
        );
    }
}

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
        var start = this.state.page * this.state.pageSize;
        var index = start;
        var logs = this.state.logs.slice(start, start + this.state.pageSize).map(item => {
            index = index + 1;
            try {
                var timestring = new Date(Number(item.timestamp)).toLocaleString();
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
                                    {this.state.commands.map((command) => 
                                        <LogUserCommand name={command.name} url={command.url}/>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-8">
                                    <LogPageBar page={this.state.page} pageSize={this.state.pageSize} />
                                </div>
                                <div className="col-md-4 text-right">
                                    <LogSearchBar />
                                </div>
                            </div>
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