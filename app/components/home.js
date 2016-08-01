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


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

const paperStyle = {
    marginLeft: "256px",
    height: "100%",
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingTop: "2px",
    paddingBottom: "25px"
};

const tabHeaderstyles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class Home extends React.Component {
    componentDidMount() {
        this.socket = io();
        this.socket.on('connect', () => {
            var sid = this.socket.io.engine.id;
            console.log('socket sessionid', sid);
            api.setSessionID(sid);
        });
        this.socket.on('log', (data) => {
            LogWindowActions.getLogsSuccessAppend(data);
        });
        this.socket.on('chart', (data) => {
            ChartsWindowActions.updateChartData(data);
        });
    }

    render() {                    
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
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
                        <AppBar title="LogStream" />
                        <SideBar />
                    </Drawer>

                    <Paper style={paperStyle} zDepth={1}>
                        <Content />
                    </Paper>

                </div>
            </MuiThemeProvider>
        );
    }

    renderOld() {
        return (
            <div id="wrapper">
                <NavBar />
                <Content />
            </div>
        );
    }
}

export default Home;