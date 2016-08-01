import React from 'react';
import SideBarStore from '../stores/sideBarStore';
import SideBarActions from '../actions/sideBarActions'
import ContentActions from '../actions/contentActions';

import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';

class ProjectMenu extends React.Component {
    constructor (props) {
        super(props);
        this.handleLognameClick = this.handleLognameClick.bind(this);
    }

    handleLognameClick(logname) {
        ContentActions.selectLogBranch(this.props.project, logname);
    }

    render() {
        var lognamelist = this.props.lognames.map(logname => 
            <ListItem 
                key={this.props.project + '/' + logname}
                primaryText={logname}
                onClick={() => this.handleLognameClick(logname)}
            />
        );
        return (
            <ListItem
                primaryText={this.props.project}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                nestedItems={lognamelist}
            />
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
            <div style={{paddingLeft:"15px", paddingRight:"15px"}}>
                <TextField
                    hintText="Filter"
                    floatingLabelText="Filter"
                    fullWidth={true}
                    onChange={this.handleChange}
                />
            </div>
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
        var listConent = this.state.projects.map(project =>
            <ProjectMenu key={project.name} project={project.name} lognames={project.lognames} />
        );
        return (
            <div>
                <MenuSearchbar />
                <List> {listConent} </List>
            </div>
        );
    }
}

export default SideBar;