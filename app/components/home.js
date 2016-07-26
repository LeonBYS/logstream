import React from 'react';
import NavBar from './navBar';
import Content from './content';
import LogWindowActions from '../actions/logWindowActions';
import SideBarActions from '../actions/sideBarActions';
import api from '../api.js';

class Home extends React.Component {
    componentDidMount() {
        this.socket = io();
        this.socket.on('connect', () => {
            var sid = this.socket.io.engine.id;
            console.log('socket sessionid', sid);
            api.setSessionId(sid);
        });
        this.socket.on('log', function(data) {
            console.log(data);
            LogWindowActions.getLogsSuccessAppend(data);
        });
    }

    render() {
        return (
            <div id="wrapper">
                <NavBar />
                <Content />
            </div>
        );
    }
}

export default Home;