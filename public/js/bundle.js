(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentActions = function () {
    function ContentActions() {
        _classCallCheck(this, ContentActions);

        this.generateActions('selectLogBranchSuccess', 'ajaxFail');
        this.internalID = null;
        this.lastTimestamp = null;
    }

    _createClass(ContentActions, [{
        key: 'selectLogBranch',
        value: function selectLogBranch(project, logname) {
            var _this = this;

            var url = '/api/' + project + '/' + logname + '/commands';
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false
            }).done(function (commands) {
                _this.selectLogBranchSuccess({ commands: commands, project: project, logname: logname });
            }).fail(function (jqXhr) {
                _this.ajaxFail(jqXhr);
            });
            return false;
        }
    }]);

    return ContentActions;
}();

exports.default = _alt2.default.createActions(ContentActions);

},{"../alt":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogWindowActions = function () {
    function LogWindowActions() {
        _classCallCheck(this, LogWindowActions);

        this.generateActions('getLogsSuccessAppend', 'getLogsSuccess', 'ajaxFail', 'scroll', 'changeFilter', 'changePage', 'changePageSize');
        this.internalID = null;
        this.lastTimestamp = null;
    }

    _createClass(LogWindowActions, [{
        key: 'changeFocus',
        value: function changeFocus(project, logname) {
            if (this.internalID) {
                clearInterval(this.internalID);
                this.lastTimestamp = null;
            }
            this.getLogs(project, logname, this.lastTimestamp);
            this.internalID = setInterval(function () {
                this.getLogs(project, logname, this.lastTimestamp);
            }.bind(this), 1000);
        }
    }, {
        key: 'getLogs',
        value: function getLogs(project, logname, timestamp) {
            var _this = this;

            var url = '/api/' + project + '/' + logname + '/logs';
            if (timestamp) {
                url += '?timestamp=' + timestamp;
            } else {
                url += '?count=1000';
            }
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false
            }).done(function (data) {
                if (data && data.length > 0) {
                    _this.lastTimestamp = data[0].timestamp;
                    if (timestamp) {
                        _this.getLogsSuccessAppend(data);
                    } else {
                        _this.getLogsSuccess({ logs: data, project: project, logname: logname });
                    }
                } else if (_this.lastTimestamp === null) {
                    // data is [] or null, this branch doesn't have log data
                    _this.getLogsSuccess({ logs: [], project: project, logname: logname });
                }
            }).fail(function (jqXhr) {
                _this.ajaxFail(jqXhr);
            });
        }
    }]);

    return LogWindowActions;
}();

exports.default = _alt2.default.createActions(LogWindowActions);

},{"../alt":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SideBarActions = function () {
    function SideBarActions() {
        _classCallCheck(this, SideBarActions);

        this.generateActions('getProjectsSuccess', 'getProjectsFail');
    }

    _createClass(SideBarActions, [{
        key: 'changeFilter',
        value: function changeFilter(filter) {
            return filter;
        }
    }, {
        key: 'getProjects',
        value: function getProjects() {
            var _this = this;

            $.ajax({
                url: '/api/projects',
                dataType: 'json',
                cache: false
            }).done(function (data) {
                _this.getProjectsSuccess(data);
            }).fail(function (jqXhr) {
                _this.getProjectsFail(jqXhr);
            });
            return false;
        }
    }]);

    return SideBarActions;
}();

exports.default = _alt2.default.createActions(SideBarActions);

},{"../alt":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _alt2.default();

},{"alt":"alt"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                ' ',
                this.props.children,
                ' '
            );
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;

},{"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _contentStore = require('../stores/contentStore');

var _contentStore2 = _interopRequireDefault(_contentStore);

var _contentActions = require('../actions/contentActions');

var _contentActions2 = _interopRequireDefault(_contentActions);

var _logWindow = require('./logWindow');

var _logWindow2 = _interopRequireDefault(_logWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogUserCommand = function (_React$Component) {
    _inherits(LogUserCommand, _React$Component);

    function LogUserCommand(props) {
        _classCallCheck(this, LogUserCommand);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LogUserCommand).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(LogUserCommand, [{
        key: 'handleClick',
        value: function handleClick(event) {
            // call this.props.url
            $.ajax({
                method: 'GET',
                url: '/api/' + this.props.project + '/' + this.props.logname + '/commands/' + this.props.command,
                cache: false,
                success: function success(data) {} // do nothing
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'button',
                { onClick: this.handleClick, type: 'button', style: { marginTop: "2px", marginRight: "5px" }, className: 'btn btn-success' },
                this.props.command
            );
        }
    }]);

    return LogUserCommand;
}(_react2.default.Component);

var Content = function (_React$Component2) {
    _inherits(Content, _React$Component2);

    function Content(props) {
        _classCallCheck(this, Content);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Content).call(this, props));

        _this2.state = _contentStore2.default.getState();
        _this2.onChange = _this2.onChange.bind(_this2);
        return _this2;
    }

    _createClass(Content, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _contentStore2.default.listen(this.onChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _contentStore2.default.unlisten(this.onChange);
        }
    }, {
        key: 'onChange',
        value: function onChange(state) {
            this.setState(state);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (this.state.project && this.state.logname) {
                return _react2.default.createElement(
                    'div',
                    { id: 'page-wrapper' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-lg-12', style: { marginTop: "5px" } },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel panel-default' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'panel-heading' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'row' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-md-4' },
                                            _react2.default.createElement(
                                                'h4',
                                                null,
                                                this.state.project + '/' + this.state.logname
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'col-md-8 text-right' },
                                            this.state.commands.map(function (command) {
                                                return _react2.default.createElement(LogUserCommand, { key: command, command: command, project: _this3.state.project, logname: _this3.state.logname });
                                            })
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'panel-body' },
                                    _react2.default.createElement(
                                        'ul',
                                        { className: 'nav nav-tabs' },
                                        _react2.default.createElement(
                                            'li',
                                            { className: 'active' },
                                            _react2.default.createElement(
                                                'a',
                                                { 'data-toggle': 'tab', href: '#logswindow' },
                                                'Logs Window'
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'li',
                                            null,
                                            _react2.default.createElement(
                                                'a',
                                                { 'data-toggle': 'tab', href: '#charts' },
                                                'Charts'
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'li',
                                            null,
                                            _react2.default.createElement(
                                                'a',
                                                { 'data-toggle': 'tab', href: '#settings' },
                                                'Settings'
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'tab-content' },
                                        _react2.default.createElement(
                                            'div',
                                            { id: 'logswindow', className: 'tab-pane fade in active' },
                                            _react2.default.createElement(_logWindow2.default, { project: this.state.project, logname: this.state.logname })
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { id: 'charts', className: 'tab-pane fade' },
                                            _react2.default.createElement(
                                                'h3',
                                                null,
                                                'Here is your charts'
                                            )
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { id: 'settings', className: 'tab-pane fade' },
                                            _react2.default.createElement(
                                                'h3',
                                                null,
                                                'Here is your setting for this log branch'
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            } else {
                return _react2.default.createElement(
                    'div',
                    { id: 'page-wrapper' },
                    _react2.default.createElement(
                        'div',
                        { className: 'row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'col-lg-12', style: { marginTop: "5px" } },
                            _react2.default.createElement(
                                'div',
                                { className: 'panel panel-default' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'panel-heading' },
                                    _react2.default.createElement(
                                        'h4',
                                        null,
                                        ' Hello '
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'panel-body' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'jumbotron', style: { paddingLeft: "10%" } },
                                        _react2.default.createElement(
                                            'h1',
                                            null,
                                            'LogStream'
                                        ),
                                        _react2.default.createElement(
                                            'p',
                                            null,
                                            'log your everything!'
                                        ),
                                        _react2.default.createElement(
                                            'p',
                                            null,
                                            _react2.default.createElement(
                                                'a',
                                                { className: 'btn btn-primary btn-lg', href: 'https://github.com/usstwxy/logstream', role: 'button' },
                                                'Learn more'
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            }
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;

},{"../actions/contentActions":1,"../stores/contentStore":13,"./logWindow":8,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _navBar = require('./navBar');

var _navBar2 = _interopRequireDefault(_navBar);

var _content = require('./content');

var _content2 = _interopRequireDefault(_content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_React$Component) {
    _inherits(Home, _React$Component);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Home).apply(this, arguments));
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'wrapper' },
                _react2.default.createElement(_navBar2.default, null),
                _react2.default.createElement(_content2.default, null)
            );
        }
    }]);

    return Home;
}(_react2.default.Component);

exports.default = Home;

},{"./content":6,"./navBar":9,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _logWindowStore = require('../stores/logWindowStore');

var _logWindowStore2 = _interopRequireDefault(_logWindowStore);

var _logWindowActions = require('../actions/logWindowActions');

var _logWindowActions2 = _interopRequireDefault(_logWindowActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogSearchBar = function (_React$Component) {
    _inherits(LogSearchBar, _React$Component);

    function LogSearchBar(props) {
        _classCallCheck(this, LogSearchBar);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LogSearchBar).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(LogSearchBar, [{
        key: 'handleChange',
        value: function handleChange(event) {
            _logWindowActions2.default.changeFilter(event.target.value);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'input-group custom-search-form pull-right' },
                _react2.default.createElement('input', { type: 'text', onChange: this.handleChange, className: 'input-sm', placeholder: 'Filter...' })
            );
        }
    }]);

    return LogSearchBar;
}(_react2.default.Component);

var MsgItem = function (_React$Component2) {
    _inherits(MsgItem, _React$Component2);

    function MsgItem() {
        _classCallCheck(this, MsgItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MsgItem).apply(this, arguments));
    }

    _createClass(MsgItem, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'p',
                { style: { color: "#f1f1f1", margin: "0" } },
                _react2.default.createElement(
                    'a',
                    { style: { color: "#666" } },
                    this.props.index
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    this.props.text
                )
            );
        }
    }]);

    return MsgItem;
}(_react2.default.Component);

var MsgHeader = function (_React$Component3) {
    _inherits(MsgHeader, _React$Component3);

    function MsgHeader(props) {
        _classCallCheck(this, MsgHeader);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(MsgHeader).call(this, props));

        _this3.logHeaderStyle = { backgroundColor: "#666", margin: "0" };
        _this3.iStyle = { cursor: "pointer", marginRight: "3px", marginLeft: "3px", color: "#000" };
        _this3.handlePause = _this3.handlePause.bind(_this3);
        _this3.handlePlay = _this3.handlePlay.bind(_this3);
        return _this3;
    }

    _createClass(MsgHeader, [{
        key: 'handlePause',
        value: function handlePause(event) {
            _logWindowActions2.default.scroll(0);
        }
    }, {
        key: 'handlePlay',
        value: function handlePlay(event) {
            _logWindowActions2.default.scroll(100000000);
        }
    }, {
        key: 'render',
        value: function render() {
            var iplay = _react2.default.createElement('i', { onClick: this.handlePlay, className: 'fa fa-play', 'aria-hidden': 'true', style: { cursor: "pointer", marginRight: "13px", marginLeft: "3px", color: "#000" } });
            var ipause = _react2.default.createElement('i', { onClick: this.handlePause, className: 'fa fa-pause', 'aria-hidden': 'true', style: { cursor: "pointer", marginRight: "13px", marginLeft: "3px", color: "#000" } });
            return _react2.default.createElement(
                'div',
                { className: 'row', style: this.logHeaderStyle },
                _react2.default.createElement(
                    'div',
                    { className: 'col-md-8', style: { paddingTop: "6px" } },
                    this.props.pause ? iplay : ipause
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'col-md-4' },
                    _react2.default.createElement(LogSearchBar, null)
                )
            );
        }
    }]);

    return MsgHeader;
}(_react2.default.Component);

var MsgWindow = function (_React$Component4) {
    _inherits(MsgWindow, _React$Component4);

    function MsgWindow(props) {
        _classCallCheck(this, MsgWindow);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(MsgWindow).call(this, props));

        _this4.styleOut = {
            fontFamily: "Monaco, Inconsolata, monospace",
            backgroundColor: "#222",
            padding: "10px"
        };
        _this4.handleWheel = _this4.handleWheel.bind(_this4);
        return _this4;
    }

    _createClass(MsgWindow, [{
        key: 'handleWheel',
        value: function handleWheel(event) {
            _logWindowActions2.default.scroll(event.deltaY);
        }
    }, {
        key: 'render',
        value: function render() {
            var index = this.props.start;
            var logContent = this.props.logs.map(function (item) {
                index = index + 1;
                try {
                    var timestring = new Date(Number(item.timestamp)).toLocaleString();
                    return _react2.default.createElement(MsgItem, { key: index, index: index, time: timestring, text: item.logtext });
                } catch (e) {
                    return _react2.default.createElement(MsgItem, { key: index, index: index, time: 'NA', text: item.toString() });
                }
            });
            return _react2.default.createElement(
                'div',
                { onWheel: this.handleWheel, style: this.styleOut },
                logContent
            );
        }
    }]);

    return MsgWindow;
}(_react2.default.Component);

var LogWindow = function (_React$Component5) {
    _inherits(LogWindow, _React$Component5);

    function LogWindow(props) {
        _classCallCheck(this, LogWindow);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(LogWindow).call(this, props));

        _this5.state = _logWindowStore2.default.getState();
        _this5.onChange = _this5.onChange.bind(_this5);
        _this5.componentWillReceiveProps = _this5.componentWillReceiveProps.bind(_this5);
        return _this5;
    }

    _createClass(LogWindow, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.props = nextProps;
            _logWindowActions2.default.changeFocus(this.props.project, this.props.logname);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            _logWindowStore2.default.listen(this.onChange);
            _logWindowActions2.default.changeFocus(this.props.project, this.props.logname);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _logWindowStore2.default.unlisten(this.onChange);
        }
    }, {
        key: 'onChange',
        value: function onChange(state) {
            this.setState(state);
        }
    }, {
        key: 'render',
        value: function render() {
            var start = this.state.start < 0 ? this.state.linesFilted.length - this.state.height : this.state.start;
            start = Math.max(start, 0); // start >= 0
            var end = start + this.state.height;
            end = Math.min(end, this.state.linesFilted.length); // log <= logs.length
            var logs = this.state.linesFilted.slice(start, end);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(MsgHeader, { pause: this.state.start >= 0 }),
                _react2.default.createElement(MsgWindow, { logs: logs, start: start })
            );
        }
    }]);

    return LogWindow;
}(_react2.default.Component);

exports.default = LogWindow;

},{"../actions/logWindowActions":2,"../stores/logWindowStore":14,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sideBar = require('./sideBar');

var _sideBar2 = _interopRequireDefault(_sideBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavBarHead = function (_React$Component) {
    _inherits(NavBarHead, _React$Component);

    function NavBarHead() {
        _classCallCheck(this, NavBarHead);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NavBarHead).apply(this, arguments));
    }

    _createClass(NavBarHead, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'navbar-header' },
                _react2.default.createElement(
                    'button',
                    { type: 'button', className: 'navbar-toggle', 'data-toggle': 'collapse', 'data-target': '.navbar-collapse' },
                    _react2.default.createElement(
                        'span',
                        { className: 'sr-only' },
                        'Toggle navigation'
                    ),
                    _react2.default.createElement('span', { className: 'icon-bar' }),
                    _react2.default.createElement('span', { className: 'icon-bar' }),
                    _react2.default.createElement('span', { className: 'icon-bar' })
                ),
                _react2.default.createElement(
                    'a',
                    { className: 'navbar-brand', href: '/' },
                    'LogStream'
                )
            );
        }
    }]);

    return NavBarHead;
}(_react2.default.Component);

var NavBarTopRight = function (_React$Component2) {
    _inherits(NavBarTopRight, _React$Component2);

    function NavBarTopRight() {
        _classCallCheck(this, NavBarTopRight);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NavBarTopRight).apply(this, arguments));
    }

    _createClass(NavBarTopRight, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'ul',
                { className: 'nav navbar-top-links navbar-right' },
                _react2.default.createElement(
                    'li',
                    { className: 'dropdown' },
                    _react2.default.createElement(
                        'a',
                        { className: 'dropdown-toggle', 'data-toggle': 'dropdown', href: '#' },
                        _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }),
                        '  ',
                        _react2.default.createElement('i', { className: 'fa fa-caret-down' })
                    ),
                    _react2.default.createElement(
                        'ul',
                        { className: 'dropdown-menu dropdown-user' },
                        _react2.default.createElement(
                            'li',
                            null,
                            _react2.default.createElement(
                                'a',
                                { href: '#' },
                                _react2.default.createElement('i', { className: 'fa fa-user fa-fw' }),
                                ' User Profile'
                            )
                        ),
                        _react2.default.createElement(
                            'li',
                            null,
                            _react2.default.createElement(
                                'a',
                                { href: '#' },
                                _react2.default.createElement('i', { className: 'fa fa-gear fa-fw' }),
                                ' Settings'
                            )
                        ),
                        _react2.default.createElement('li', { className: 'divider' }),
                        _react2.default.createElement(
                            'li',
                            null,
                            _react2.default.createElement(
                                'a',
                                { href: 'login.html' },
                                _react2.default.createElement('i', { className: 'fa fa-sign-out fa-fw' }),
                                ' Logout'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return NavBarTopRight;
}(_react2.default.Component);

var NavBar = function (_React$Component3) {
    _inherits(NavBar, _React$Component3);

    function NavBar() {
        _classCallCheck(this, NavBar);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(NavBar).apply(this, arguments));
    }

    _createClass(NavBar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'nav',
                { className: 'navbar navbar-default navbar-static-top', role: 'navigation', style: { "marginBottom": 0 } },
                _react2.default.createElement(NavBarHead, null),
                _react2.default.createElement(NavBarTopRight, null),
                _react2.default.createElement(_sideBar2.default, null)
            );
        }
    }]);

    return NavBar;
}(_react2.default.Component);

exports.default = NavBar;

},{"./sideBar":10,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sideBarStore = require('../stores/sideBarStore');

var _sideBarStore2 = _interopRequireDefault(_sideBarStore);

var _sideBarActions = require('../actions/sideBarActions');

var _sideBarActions2 = _interopRequireDefault(_sideBarActions);

var _contentActions = require('../actions/contentActions');

var _contentActions2 = _interopRequireDefault(_contentActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LognameButton = function (_React$Component) {
    _inherits(LognameButton, _React$Component);

    function LognameButton(props) {
        _classCallCheck(this, LognameButton);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LognameButton).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(LognameButton, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'li',
                { onClick: this.handleClick },
                _react2.default.createElement(
                    'a',
                    { style: { cursor: "pointer" } },
                    this.props.logname
                )
            );
        }
    }, {
        key: 'handleClick',
        value: function handleClick() {
            _contentActions2.default.selectLogBranch(this.props.project, this.props.logname);
        }
    }]);

    return LognameButton;
}(_react2.default.Component);

var ProjectMenu = function (_React$Component2) {
    _inherits(ProjectMenu, _React$Component2);

    function ProjectMenu() {
        _classCallCheck(this, ProjectMenu);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ProjectMenu).apply(this, arguments));
    }

    _createClass(ProjectMenu, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var loglist = this.props.lognames.map(function (logname) {
                return _react2.default.createElement(LognameButton, { key: logname, logname: logname, project: _this3.props.project });
            });
            return _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement('i', { className: 'fa fa-fw' }),
                    this.props.project,
                    _react2.default.createElement('span', { className: 'fa arrow' })
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'nav nav-second-level' },
                    loglist
                )
            );
        }
    }]);

    return ProjectMenu;
}(_react2.default.Component);

var MenuSearchbar = function (_React$Component3) {
    _inherits(MenuSearchbar, _React$Component3);

    function MenuSearchbar(props) {
        _classCallCheck(this, MenuSearchbar);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuSearchbar).call(this, props));

        _this4.handleChange = _this4.handleChange.bind(_this4);
        return _this4;
    }

    _createClass(MenuSearchbar, [{
        key: 'handleChange',
        value: function handleChange(event) {
            _sideBarActions2.default.changeFilter(event.target.value);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'li',
                { className: 'sidebar-search' },
                _react2.default.createElement(
                    'div',
                    { className: 'input-group custom-search-form' },
                    _react2.default.createElement('input', { type: 'text', onChange: this.handleChange, className: 'form-control', placeholder: 'Search...' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-group-addon' },
                        _react2.default.createElement('i', { className: 'fa fa-search' })
                    )
                )
            );
        }
    }]);

    return MenuSearchbar;
}(_react2.default.Component);

var SideMenu = function (_React$Component4) {
    _inherits(SideMenu, _React$Component4);

    function SideMenu() {
        _classCallCheck(this, SideMenu);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SideMenu).apply(this, arguments));
    }

    _createClass(SideMenu, [{
        key: 'render',
        value: function render() {
            var data = this.props.data;
            return _react2.default.createElement(
                'ul',
                { className: 'nav', id: 'side-menu' },
                _react2.default.createElement(MenuSearchbar, null),
                data.map(function (project) {
                    return _react2.default.createElement(ProjectMenu, { key: project.name, project: project.name, lognames: project.lognames });
                })
            );
        }
    }]);

    return SideMenu;
}(_react2.default.Component);

var SideBar = function (_React$Component5) {
    _inherits(SideBar, _React$Component5);

    function SideBar(props) {
        _classCallCheck(this, SideBar);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(SideBar).call(this, props));

        _this6.state = _sideBarStore2.default.getState();
        _this6.onChange = _this6.onChange.bind(_this6);
        return _this6;
    }

    _createClass(SideBar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _sideBarStore2.default.listen(this.onChange);
            _sideBarActions2.default.getProjects();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            _sideBarStore2.default.unlisten(this.onChange);
        }
    }, {
        key: 'onChange',
        value: function onChange(state) {
            this.setState(state);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'navbar-default sidebar', role: 'navigation' },
                _react2.default.createElement(
                    'div',
                    { className: 'sidebar-nav navbar-collapse' },
                    _react2.default.createElement(SideMenu, { data: this.state.projects })
                )
            );
        }
    }]);

    return SideBar;
}(_react2.default.Component);

exports.default = SideBar;

},{"../actions/contentActions":1,"../actions/sideBarActions":3,"../stores/sideBarStore":15,"react":"react"}],11:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.browserHistory },
    _routes2.default
), document.getElementById('app'));

},{"./routes":12,"react":"react","react-dom":"react-dom","react-router":"react-router"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _app = require('./components/app');

var _app2 = _interopRequireDefault(_app);

var _home = require('./components/home');

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
    _reactRouter.Route,
    { component: _app2.default },
    _react2.default.createElement(_reactRouter.Route, { path: '/', component: _home2.default })
);

},{"./components/app":5,"./components/home":7,"react":"react","react-router":"react-router"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _contentActions = require('../actions/contentActions.js');

var _contentActions2 = _interopRequireDefault(_contentActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentStore = function () {
    function ContentStore() {
        _classCallCheck(this, ContentStore);

        this.bindActions(_contentActions2.default);
        this.commands = [];
        this.project = '';
        this.logname = '';
    }

    _createClass(ContentStore, [{
        key: 'onSelectLogBranchSuccess',
        value: function onSelectLogBranchSuccess(data) {
            this.commands = data.commands;
            this.project = data.project;
            this.logname = data.logname;
        }
    }, {
        key: 'onAjaxFail',
        value: function onAjaxFail(jqXhr) {
            toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        }
    }]);

    return ContentStore;
}();

exports.default = _alt2.default.createStore(ContentStore);

},{"../actions/contentActions.js":1,"../alt":4}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _logWindowActions = require('../actions/logWindowActions');

var _logWindowActions2 = _interopRequireDefault(_logWindowActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogWindowStore = function () {
    function LogWindowStore() {
        _classCallCheck(this, LogWindowStore);

        this.bindActions(_logWindowActions2.default);
        // data
        this.logs = [];
        this.linesOrigin = [];
        this.linesFilted = [];

        // data for component
        this.filter = '';
        this.height = 24;
        this.start = -this.height;
    }

    _createClass(LogWindowStore, [{
        key: 'filterLines',
        value: function filterLines(lines, filter) {
            if (!filter || filter.length === 0) {
                return lines;
            }
            return lines.filter(function (line) {
                return line.logtext.match(new RegExp(filter, 'i'));
            });
        }
    }, {
        key: 'convertLogsToLines',
        value: function convertLogsToLines(logs) {
            logs.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });
            var lines = logs.reduce(function (a, b) {
                return a + b.logtext;
            }, '').split('\n');
            if (lines[lines.length - 1].length === 0) {
                lines.pop();
            }

            var pos = 0,
                size = 0;
            var results = [];
            for (var i = 0; i < lines.length; i++) {
                size += lines[i].length + 1; // +1 for '\n'
                results.push({ timestamp: logs[pos].timestamp, logtext: lines[i] });
                if (size >= logs[pos].logtext.length) {
                    size -= logs[pos].logtext.length;
                    pos++;
                }
            }
            return results;
        }
    }, {
        key: 'mergeLines',
        value: function mergeLines(lines0, lines1) {
            // merge two ordered line list
            // a good solution is merge sort... but we naviely sort the added array now
            var newLines = lines0.concat(lines1);
            if (lines0.length > 0 && lines1.length > 0 && lines1[0].timestamp >= lines0[lines0.length - 1].timestamp) {
                // sorted
            } else {
                newLines.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
            }
            return newLines;
        }
    }, {
        key: 'onScroll',
        value: function onScroll(deltaY) {
            if (deltaY === 0) {
                // pause
                if (this.start < 0) {
                    this.start = Math.max(0, this.linesFilted.length - this.height);
                }
            } else {
                deltaY = Math.floor(deltaY / 50);
                if (this.start < 0) {
                    this.start = this.linesFilted.length - this.height + deltaY;
                } else {
                    this.start += deltaY;
                }
                if (this.start < 0) {
                    this.start = 0;
                }
                if (this.start > this.linesFilted.length - this.height) {
                    this.start = -this.height;
                }
            }
        }
    }, {
        key: 'onChangeFilter',
        value: function onChangeFilter(filter) {
            this.linesFilted = this.filterLines(this.linesOrigin, this.filter);
        }
    }, {
        key: 'onGetLogsSuccessAppend',
        value: function onGetLogsSuccessAppend(logs) {
            logs.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });
            this.logs = this.logs.concat(logs);
            // use lines
            var linesOrigin = this.convertLogsToLines(logs);
            this.linesOrigin = this.mergeLines(this.linesOrigin, this.convertLogsToLines(logs));
            var linesFilted = this.filterLines(linesOrigin, this.filter);
            this.linesFilted = this.mergeLines(this.linesFilted, linesFilted);
        }
    }, {
        key: 'onGetLogsSuccess',
        value: function onGetLogsSuccess(data) {
            this.start = -this.height;
            this.filter = '';
            this.logs = data.logs.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });
            // use lines
            this.linesOrigin = this.convertLogsToLines(this.logs);
            this.linesFilted = this.filterLines(this.linesOrigin, this.filter);
        }
    }, {
        key: 'onAjaxFail',
        value: function onAjaxFail(jqXhr) {
            toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        }
    }]);

    return LogWindowStore;
}();

exports.default = _alt2.default.createStore(LogWindowStore);

},{"../actions/logWindowActions":2,"../alt":4}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _sideBarActions = require('../actions/sideBarActions');

var _sideBarActions2 = _interopRequireDefault(_sideBarActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SideBarStore = function () {
    function SideBarStore() {
        _classCallCheck(this, SideBarStore);

        this.bindActions(_sideBarActions2.default);
        this.originProjects = [];
        this.projects = [];
        this.filter = "";
    }

    _createClass(SideBarStore, [{
        key: 'updateProjects',
        value: function updateProjects() {
            var _this = this;

            var projects = [];
            this.originProjects.map(function (project) {
                if (_this.filter.length == 0) {
                    projects.push(project);
                } else if (project.name.toLowerCase().indexOf(_this.filter.toLowerCase()) >= 0) {
                    projects.push(project);
                } else {
                    var newProject = { name: project.name, lognames: [] };
                    project.lognames.map(function (logname) {
                        if (logname.toLowerCase().indexOf(_this.filter.toLowerCase()) >= 0) {
                            newProject.lognames.push(logname);
                        }
                    });
                    if (newProject.lognames.length > 0) {
                        projects.push(newProject);
                    }
                }
            });
            this.projects = projects;
        }
    }, {
        key: 'onChangeFilter',
        value: function onChangeFilter(filter) {
            this.filter = filter;
            this.updateProjects();
        }
    }, {
        key: 'onGetProjectsSuccess',
        value: function onGetProjectsSuccess(data) {
            this.originProjects = data;
            this.updateProjects();
        }
    }, {
        key: 'onGetProjectsFail',
        value: function onGetProjectsFail(jqXhr) {
            // Handle multiple response formats, fallback to HTTP status code number.
            toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        }
    }]);

    return SideBarStore;
}();

exports.default = _alt2.default.createStore(SideBarStore);

},{"../actions/sideBarActions":3,"../alt":4}]},{},[11])


//# sourceMappingURL=bundle.js.map
