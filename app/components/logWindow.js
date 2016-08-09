import React from 'react';
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
                                <MenuItem value={0} primaryText="Log" />
                                <MenuItem value={1} primaryText="Warn" />
                                <MenuItem value={2} primaryText="Error" />
                            </DropDownMenu>
                        </td>
                    </tr></tbody></table>
                </div>
            </div>
        );
    }
}

class MsgWindow extends React.Component {
    render() {
        if (window) {
            var AceEditor = require('react-ace').default;
            var brace = require('brace').default;
            require('brace/mode/java');
            require('brace/theme/github');
            
            var logstr = this.props.logs.map(a => a.logtext).join('\n');
            var _this = this;
   
            if (!this.editor) { 
                this.ace = <AceEditor
                    mode="java"
                    theme="github"
                    readOnly={true}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    value={logstr}
                    cursorStart={-1}
                    onLoad={ (editor) => { _this.editor = editor; } }
                    width="100%"
                    height="100%"
                    fontSize={14}
                    />; 
            }else {
                var row0 = this.editor.session.getLength() - 1;
                var col0 = this.editor.session.getLine(row0).length;
                var pos0 = this.editor.selection.getCursor();

                this.editor.setValue(logstr, 1);

                if (pos0.row === row0 && pos0.column === col0) {
                    var row1 = this.editor.session.getLength() - 1;
                    var col1 = this.editor.session.getLine(row1).length // or simply Infinity;
                    this.editor.gotoLine(row1 + 1, col1);
                }else {
                    this.editor.gotoLine(pos0.row + 1, pos0.column);
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
        var style = {
            borderWidth: 1, 
            borderColor:"#CCC", 
            borderStyle:"solid",
            borderRadius: 2, 
            width:"100%", 
            height:"500px", 
            marginBottom:"10px"
        };
        return (
            <div>
                <MsgHeader level={this.state.level} dateStart={this.state.dateStart} dateEnd={this.state.dateEnd} />
                <div style={style}> 
                    <MsgWindow logs={this.state.linesFilted}/> 
                </div>
            </div>
        );
    }
}

export default LogWindow;