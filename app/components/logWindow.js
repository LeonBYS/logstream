import React from 'react';
import moment from 'moment';
import LogWindowStore from '../stores/logWindowStore';
import LogWindowActions from '../actions/logWindowActions';

import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';


class MsgHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    handleFilterChange(event) {
        LogWindowActions.changeFilter(event.target.value);
    }

    handleLevelChange(event, index, value) {
        LogWindowActions.changeLevel(value);
    }

    handleStartDateChange(event, date) {
        LogWindowActions.changeStartDate(date);
    }

    handleEndDateChange(event, date) {
        LogWindowActions.changeEndDate(date);
    }


    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <table><tbody><tr>
                        <td style={{marginRight:"10px"}}> <TextField hintText="Filter" onChange={this.handleFilterChange} style={{marginRight:"10px"}}/> </td>
                        <td style={{width:"100px"}}> <DatePicker hintText="Start date" value={this.props.dateStart} onChange={this.handleStartDateChange} style={{marginRight:"10px"}} textFieldStyle={{width:"100%"}}/> </td>
                        <td style={{width:"100px"}}> <DatePicker hintText="End date" value={this.props.dateEnd} onChange={this.handleEndDateChange} style={{marginRight:"10px"}} textFieldStyle={{width:"100%"}}/> </td>
                        <td>
                            <DropDownMenu value={this.props.level} onChange={this.handleLevelChange} labelStyle={{marginTop:"4px"}} style={{marginBottom:"16px"}}>
                                <MenuItem value={0} primaryText="Verbose" />
                                <MenuItem value={1} primaryText="Info" />
                                <MenuItem value={2} primaryText="Warning" />
                                <MenuItem value={3} primaryText="Error" />
                            </DropDownMenu>
                        </td>
                    </tr></tbody></table>
                </div>
            </div>
        );
    }
}

class MsgWindow extends React.Component {
    isSame(logs1, log2, tryCount) {
        var n = Math.min(logs1.length, log2.length);
        while (tryCount > 0) {
            var i = Math.floor(Math.random() * n); // random 0..n-1
            if (logs1[i] !== log2[i]) {
                return false;
            }
            tryCount--;
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        var logsOld = this.props.logs;
        var logsNew = nextProps.logs;
        if (logsOld.length <= logsNew.length && this.isSame(logsOld, logsNew, 10)) {
            if (typeof(this.appendData) === 'array') {
                this.appendData = this.appendData.concat(logsNew.slice(logsOld.length));
            }else {
                this.appendData = logsNew.slice(logsOld.length);
            }
        }else {
            this.appendData = null;
        }
        if (this.props.height != nextProps.height) {
            if (this.editor) {
                this.editor.resize();
            }
        }
    }

    render() {
        if (window) {
            if (!this.editor) { 
                var AceEditor = require('react-ace').default;
                var brace = require('brace').default;
                require('brace/mode/java');
                require('brace/theme/github');

                var logstr = this.props.logs.map(a => a.logtext).join('\n');
                var _this = this;
                this.ace = <AceEditor
                    mode="text"
                    theme="github"
                    readOnly={true}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: Infinity }}
                    value={logstr}
                    cursorStart={-1}
                    onLoad={ (editor) => { _this.editor = editor; } }
                    width="100%"
                    height="100%"
                    fontSize={14}
                    />; 
            }else {
                var now = Date.now();

                if (!this.appendData) { // refresh all data
                    console.log('updating...');

                    var row0 = this.editor.session.getLength() - 1;
                    var col0 = this.editor.session.getLine(row0).length;
                    var pos0 = this.editor.selection.getCursor();

                    var logstr = this.props.logs.map(a => '[' + moment(a.timestamp).format() + '] ' + a.logtext).join('');
                    this.editor.session.setValue(logstr, 1);
                    
                    if (pos0.row === row0 && pos0.column === col0) {
                        var row1 = this.editor.session.getLength() - 1;
                        var col1 = this.editor.session.getLine(row1).length // or simply Infinity;
                        this.editor.gotoLine(row1 + 1, col1);
                    }else {
                        this.editor.gotoLine(pos0.row + 1, pos0.column);
                    }

                    console.log('cost', Date.now() - now);
                }else if (this.appendData.length > 0) { // just append the data to tail
                    console.log('appending...');

                    var row0 = this.editor.session.getLength() - 1;
                    var col0 = this.editor.session.getLine(row0).length;
                    var pos0 = this.editor.selection.getCursor();

                    var logstr = this.appendData.map(a => '[' + moment(a.timestamp).format() + '] ' + a.logtext).join('');
                    this.editor.session.insert({row: this.editor.session.getLength(), column: 0}, "" + logstr);
                    
                    if (pos0.row === row0 && pos0.column === col0) {
                        var row1 = this.editor.session.getLength() - 1;
                        var col1 = this.editor.session.getLine(row1).length // or simply Infinity;
                        this.editor.gotoLine(row1 + 1, col1);
                    }else {
                        this.editor.gotoLine(pos0.row + 1, pos0.column);
                    }

                    console.log('cost', '' + (Date.now() - now) + 'ms, ', 'line number:', this.editor.session.getLength());
                }
            }
            return this.ace;
        }else {
            return <div/>
        }
    }
}


class LogWindow extends React.Component {
    constructor (props) {
        super(props);
        this.state = LogWindowStore.getState();
        this.onChange = this.onChange.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        process.nextTick(() => {
            LogWindowActions.getLogs(this.props.project, this.props.logname);
        });
    }

    updateDimensions() {
        this.forceUpdate();
    }

    componentDidMount() {
        LogWindowStore.listen(this.onChange);
        process.nextTick(() => {
            LogWindowActions.getLogs(this.props.project, this.props.logname);
        });
        if (window) window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        LogWindowStore.unlisten(this.onChange);
        if (window) window.addEventListener("resize", this.updateDimensions);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        var style = {
            borderWidth: 1, 
            borderColor:"#CCC", 
            borderStyle:"solid",
            borderRadius: 2, 
            width:"100%", 
            height:"500px", 
            marginBottom:"10px"
        };
        if (window) {
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            style.height = (height - 300) + 'px';
        }
        return (
            <div style={{height:"100%"}}>
                <MsgHeader level={this.state.level} dateStart={this.state.dateStart} dateEnd={this.state.dateEnd} />
                <div style={style}> 
                    <MsgWindow logs={this.state.linesFilted} height={style.height}/> 
                </div>
            </div>
        );
    }
}

export default LogWindow;