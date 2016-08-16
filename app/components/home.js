import React from 'react';
import SideBar from './sideBar';
import Content from './content';
import LogWindowActions from '../actions/logWindowActions';
import ChartsWindowActions from '../actions/chartsWindowActions';
import api from '../api';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});


const muiTheme2 = getMuiTheme({
    palette: {
        primary1Color: "#1690DB",
        primary2Color: "#2173B3",
        primary3Color: "#A9D2EB",
        accent1Color: "#ED3B3B",
        accent2Color: "#ED2B2B",
        accent3Color: "#F58C8C"
    },
});




const paperStyle = {
    marginLeft: "256px",
    height: "100%",
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingTop: "2px",
    paddingBottom: "25px",
};

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.themes = [getMuiTheme(lightBaseTheme), muiTheme2];
        this.state = {
            theme: 0
        }
        this.lastLogTimestamp = null;
        this.savedLogs = [];
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('connect', () => {
            var sid = this.socket.io.engine.id;
            console.log('socket sessionid', sid);
            api.setSessionID(sid);
        });
        this.socket.on('log', (data) => {
            //console.log('log coming', data);
            var now = Date.now();
            if (this.lastLogTimestamp === null || now - this.lastLogTimestamp > 500) {
                this.lastLogTimestamp = now;
                console.log('fire', this.savedLogs.length);
                LogWindowActions.getLogsSuccessAppend(this.savedLogs);
                this.savedLogs = [];
            }else {
                this.savedLogs = this.savedLogs.concat(data);
            }
        });
        this.socket.on('chart', (data) => {
            //console.log('chart coming', data);
            ChartsWindowActions.updateChartData(data);
        });
    }

    render() {                    
        return (
            <MuiThemeProvider muiTheme={this.themes[this.state.theme]}>
                <div>
                    <AppBar
                        title="LogStream" 
                        iconElementRight={
                            <FlatButton label="GITHUB" href="https://github.com/usstwxy/logstream"> 
                                <i className="fa fa-github" style={{marginRight:"-10px", marginLeft:"15px"}}></i> 
                            </FlatButton>
                        }
                    />

                    <Drawer open={true}>
                        <AppBar title="LogStream" 
                            onLeftIconButtonTouchTap={()=>{
                                this.setState({
                                    theme: (this.state.theme + 1) % this.themes.length
                                });
                            }}
                        />
                        <SideBar />
                    </Drawer>

                    <Paper style={paperStyle} zDepth={1}>
                        <Content />
                    </Paper>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default Home;