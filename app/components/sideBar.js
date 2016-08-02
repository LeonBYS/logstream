import React from 'react';
import SideBarStore from '../stores/sideBarStore';
import SideBarActions from '../actions/sideBarActions'
import ContentActions from '../actions/contentActions';

import TextField from 'material-ui/TextField';
import {List, ListItem, MakeSelectable} from 'material-ui/List';


let SelectableListNaive = MakeSelectable(List);

class SelectableList extends React.Component {
    constructor(props) {
        super(props);
        this.handleRequestChange = this.handleRequestChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            selectedIndex: this.props.defaultValue,
        });
    }

    handleRequestChange(event, index) {
        if (index) {
            this.setState({
                selectedIndex: index,
            });
        }
    };

    render() {
        return (
            <SelectableListNaive
                value={this.state.selectedIndex}
                onChange={this.handleRequestChange}
                >
                {this.props.children}
            </SelectableListNaive>
        );
    }
};


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
        this.handleLognameClick = this.handleLognameClick.bind(this);
    }

    componentDidMount() {
        SideBarStore.listen(this.onChange);
        SideBarActions.getProjects();
    }

    componentWillUnmount() {
        SideBarStore.unlisten(this.onChange);
    }

    handleLognameClick(project, logname) {
        ContentActions.selectLogBranch(project, logname);
    }

    onChange(state) {
        this.setState(state);
    }

    render () {
        var listConent = this.state.projects.map(project => {
            var lognamelist = project.lognames ? project.lognames.map(logname => 
                <ListItem 
                    value={project.name + '/' + logname}
                    key={project.name + '/' + logname}
                    primaryText={logname}
                    onClick={() => this.handleLognameClick(project.name, logname)}
                />
            ) : [];
            return (
                <ListItem
                    key={project.name}
                    primaryText={project.name}
                    initiallyOpen={true}
                    primaryTogglesNestedList={true}
                    nestedItems={lognamelist}
                />
            );
        });

        if (!listConent) listConent = [];

        return (
            <div>
                <MenuSearchbar />
                <SelectableList defaultValue={"None"}> {listConent} </SelectableList>
            </div>
        );
    }
}

export default SideBar;