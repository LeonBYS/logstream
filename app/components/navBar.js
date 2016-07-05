import React from 'react';
import SideBar from './sideBar';


class NavBarHead extends React.Component {
    render () {
        return (
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">LogStream</a>
            </div>
        );
    }
}

class NavBarTopRight extends React.Component {
    render () {
        return (
            <ul className="nav navbar-top-links navbar-right">
                <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i className="fa fa-user fa-fw"></i>  <i className="fa fa-caret-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-user">
                        <li><a href="#"><i className="fa fa-user fa-fw"></i> User Profile</a>
                        </li>
                        <li><a href="#"><i className="fa fa-gear fa-fw"></i> Settings</a>
                        </li>
                        <li className="divider"></li>
                        <li><a href="login.html"><i className="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>
        );
    }
}


class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{"marginBottom": 0}}>
                <NavBarHead />
                <NavBarTopRight />
                <SideBar />
            </nav>
        );
    }
}

export default NavBar;