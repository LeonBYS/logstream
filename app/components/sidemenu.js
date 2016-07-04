import React from 'react'

class LognameButton extends React.Component {
    render () {
        return (<li><a>{this.props.logname}</a></li>);
    }
}

/*
var LognameList = React.createClass({
    render: function () {
        return (
            <ul className="nav nav-second-level">
            {this.props.lognames.map(function (logname) {
                return (<li key={logname}><a>{logname}</a></li>);
            })}
            </ul>
        );
    }
});
*/

class ProjectMenu extends React.Component {
    render() {
        var loglist = this.props.lognames.map(logname => {
            return (<LognameButton key={logname} logname={logname} project={this.props.project} />); 
        });
        return (
            <li>
                <a><i className="fa fa-fw"></i>{this.props.project}<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                    {loglist}
                </ul>
            </li>
        );
    }
}

class MenuSearchbar extends React.Component {
    render () {
        return (
            <li className="sidebar-search">
                <div className="input-group custom-search-form">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button">
                            <i className="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            </li>
        );
    }
}


class SideMenu extends React.createClass {
    pullMenuData () {
        api.get(this.props.url, function (data, status) {
            this.setState({data:data});
            $('#side-menu').metisMenu();
        }.bind(this));
    }

    getInitialState () {
      return {data: {}};
    }

    componentDidMount () {
        this.pullMenuData();
        //setInterval(this.pullMenuData, this.props.pollInterval);
    }

    render () {
        var data = this.state.data;
        return (
            <ul className="nav" id="side-menu">
                <MenuSearchbar />
                {Object.keys(data).map(function (project) {
                    return (<ProjectMenu key={project} project={project} lognames={data[project]} />);
                })}
            </ul>
        );
    }
}

/*
ReactDOM.render(
    <SideMenu url="/api/projects" pollInterval={10000} />,
    document.getElementById('side-menu-wrapper')
);
*/