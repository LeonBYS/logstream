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

var ProjectMenu = React.createClass({
    render: function () {
        return (
            <li>
                <a><i className="fa fa-fw"></i>{this.props.project}<span className="fa arrow"></span></a>
                <LognameList lognames={this.props.lognames} />
            </li>
        );
    }
});

var MenuSearchbar = React.createClass({
    render: function () {
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
});


var SideMenu = React.createClass({
    pullMenuData: function () {
        api.get(this.props.url, function (data, status) {
            this.setState({data:data});
            $('#side-menu').metisMenu();
        }.bind(this));
    },
    getInitialState: function () {
      return {data: {}};
    },
    componentDidMount: function () {
        this.pullMenuData();
        setInterval(this.pullMenuData, this.props.pollInterval);
    },
    render: function () {
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
});

ReactDOM.render(
    <SideMenu url="/api/projects" pollInterval={10000} />,
    document.getElementById('side-menu-wrapper')
);