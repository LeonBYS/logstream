import React from 'react';
import SideBarStore from '../stores/sideBarStore';
import SideBarActions from '../actions/sideBarActions'
import ContentActions from '../actions/contentActions';

class LognameButton extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    render () {
        return (
            <li onClick={this.handleClick}>
                <a style={{cursor:"pointer"}}>{this.props.logname}</a>
            </li>
        );
    }
    handleClick() {
        ContentActions.selectLogBranch(this.props.project, this.props.logname);
    }
}

class ProjectMenu extends React.Component {
    render() {
        var loglist = this.props.lognames.map(logname => {
            return (<LognameButton key={logname} logname={logname} project={this.props.project} />); 
        });
        return (
            <li>
                <a href="#"><i className="fa fa-fw"></i>{this.props.project}<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                    {loglist}
                </ul>
            </li>
        );
    }
}

class MenuSearchbar extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        SideBarActions.changeFilter(event.target.value);
    }

    render () {
        return (
            <li className="sidebar-search">
                <div className="input-group custom-search-form">
                    <input type="text" onChange={this.handleChange} className="form-control" placeholder="Search..." />
                    <div className="input-group-addon"><i className="fa fa-search"></i></div>
                </div> 
            </li>
        );
    }
}

class SideMenu extends React.Component {
    render () {
        var data = this.props.data;
        return (
            <ul className="nav" id="side-menu">
                <MenuSearchbar />
                {data.map(function (project) {
                    return (<ProjectMenu key={project.name} project={project.name} lognames={project.lognames} />);
                })}
            </ul>
        );
    }
}

class SideBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = SideBarStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        SideBarStore.listen(this.onChange);
        SideBarActions.getProjects();
    }

    componentWillUnmount() {
        SideBarStore.unlisten(this.onChange);
    }

    onChange (state) {
        this.setState(state);
    }

    render () {
        return (
            <div className="navbar-default sidebar" role="navigation">
                <div className="sidebar-nav navbar-collapse">
                    <SideMenu data={this.state.projects}/>
                </div>
            </div>
        );
    }
}

export default SideBar;