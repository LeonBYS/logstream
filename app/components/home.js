import React from 'react';
import NavBar from './navBar';
import Content from './content'

class Home extends React.Component {
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