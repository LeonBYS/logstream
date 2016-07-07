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

var LogWindowActions = function () {
    function LogWindowActions() {
        _classCallCheck(this, LogWindowActions);

        this.generateActions('getLogsSuccess', 'getLogsFail');
        this.internalID = null;
        this.prevLogs = [];
    }

    _createClass(LogWindowActions, [{
        key: 'changeFocus',
        value: function changeFocus(project, logname) {
            var getLastLogTimeStamp = function () {
                return this.prevLogs.length > 0 ? this.prevLogs[0].timestamp : null;
            }.bind(this);

            if (this.internalID) {
                clearInterval(this.internalID);
                this.prevLogs = [];
            }
            this.getLogs(project, logname, getLastLogTimeStamp());
            this.internalID = setInterval(function () {
                this.getLogs(project, logname, getLastLogTimeStamp());
            }.bind(this), 1000);
        }
    }, {
        key: 'getLogs',
        value: function getLogs(project, logname, timestamp) {
            var _this = this;

            var url = '/api/' + project + '/' + logname + '/logs';
            if (timestamp) {
                url += '?timestamp=' + timestamp;
            }
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false
            }).done(function (data) {
                _this.prevLogs = data.concat(_this.prevLogs);
                _this.getLogsSuccess({ logs: _this.prevLogs, project: project, logname: logname });
            }).fail(function (jqXhr) {
                _this.getLogsFail(jqXhr);
            });
            return false;
        }
    }]);

    return LogWindowActions;
}();

exports.default = _alt2.default.createActions(LogWindowActions);

},{"../alt":3}],2:[function(require,module,exports){
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

},{"../alt":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _alt2.default();

},{"alt":"alt"}],4:[function(require,module,exports){
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

},{"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _logWindow = require('./logWindow');

var _logWindow2 = _interopRequireDefault(_logWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content() {
        _classCallCheck(this, Content);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Content).apply(this, arguments));
    }

    _createClass(Content, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'page-wrapper' },
                _react2.default.createElement(_logWindow2.default, null)
            );
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;

},{"./logWindow":7,"react":"react"}],6:[function(require,module,exports){
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

},{"./content":5,"./navBar":8,"react":"react"}],7:[function(require,module,exports){
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

var LogItem = function (_React$Component) {
    _inherits(LogItem, _React$Component);

    function LogItem() {
        _classCallCheck(this, LogItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LogItem).apply(this, arguments));
    }

    _createClass(LogItem, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                    'td',
                    null,
                    this.props.time
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    this.props.text
                )
            );
        }
    }]);

    return LogItem;
}(_react2.default.Component);

var LogWindow = function (_React$Component2) {
    _inherits(LogWindow, _React$Component2);

    function LogWindow(props) {
        _classCallCheck(this, LogWindow);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(LogWindow).call(this, props));

        _this2.state = _logWindowStore2.default.getState();
        _this2.onChange = _this2.onChange.bind(_this2);
        return _this2;
    }

    _createClass(LogWindow, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _logWindowStore2.default.listen(this.onChange);
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
            var index = 0;
            var logs = this.state.logs.map(function (item) {
                index = index + 1;
                try {
                    var timestring = new Date(item.timestamp).toLocaleString();
                    return _react2.default.createElement(LogItem, { key: index, time: timestring, text: item.logtext });
                } catch (e) {
                    return _react2.default.createElement(LogItem, { key: index, time: 'NA', text: item.toString() });
                }
            });
            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                    'div',
                    { className: 'col-lg-12', style: { marginTop: "1%" } },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel panel-default' },
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-heading' },
                            this.state.project + '/' + this.state.logname
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'panel-body' },
                            _react2.default.createElement(
                                'div',
                                { className: 'dataTable_wrapper' },
                                _react2.default.createElement(
                                    'table',
                                    { className: 'table table-striped table-bordered table-hover', id: 'dataTables-example' },
                                    _react2.default.createElement(
                                        'thead',
                                        null,
                                        _react2.default.createElement(
                                            'tr',
                                            null,
                                            _react2.default.createElement(
                                                'th',
                                                { width: '20%' },
                                                'Time'
                                            ),
                                            _react2.default.createElement(
                                                'th',
                                                null,
                                                'Log'
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'tbody',
                                        null,
                                        logs
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return LogWindow;
}(_react2.default.Component);

exports.default = LogWindow;

},{"../actions/logWindowActions":1,"../stores/logWindowStore":12,"react":"react"}],8:[function(require,module,exports){
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

},{"./sideBar":9,"react":"react"}],9:[function(require,module,exports){
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

var _logWindowActions = require('../actions/logWindowActions');

var _logWindowActions2 = _interopRequireDefault(_logWindowActions);

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
            _logWindowActions2.default.changeFocus(this.props.project, this.props.logname);
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

    function MenuSearchbar() {
        _classCallCheck(this, MenuSearchbar);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MenuSearchbar).apply(this, arguments));
    }

    _createClass(MenuSearchbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'li',
                { className: 'sidebar-search' },
                _react2.default.createElement(
                    'div',
                    { className: 'input-group custom-search-form' },
                    _react2.default.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Search...' }),
                    _react2.default.createElement(
                        'span',
                        { className: 'input-group-btn' },
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-default', type: 'button' },
                            _react2.default.createElement('i', { className: 'fa fa-search' })
                        )
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
                Object.keys(data).map(function (project) {
                    return _react2.default.createElement(ProjectMenu, { key: project, project: project, lognames: data[project] });
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

},{"../actions/logWindowActions":1,"../actions/sideBarActions":2,"../stores/sideBarStore":13,"react":"react"}],10:[function(require,module,exports){
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

},{"./routes":11,"react":"react","react-dom":"react-dom","react-router":"react-router"}],11:[function(require,module,exports){
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

},{"./components/app":4,"./components/home":6,"react":"react","react-router":"react-router"}],12:[function(require,module,exports){
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
        this.logs = [];
        this.project = '';
        this.logname = '';
    }

    _createClass(LogWindowStore, [{
        key: 'onGetLogsSuccess',
        value: function onGetLogsSuccess(data) {
            this.logs = data.logs;
            this.project = data.project;
            this.logname = data.logname;
        }
    }, {
        key: 'onGetLogsFail',
        value: function onGetLogsFail(jqXhr) {
            // Handle multiple response formats, fallback to HTTP status code number.
            toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        }
    }]);

    return LogWindowStore;
}();

exports.default = _alt2.default.createStore(LogWindowStore);

},{"../actions/logWindowActions":1,"../alt":3}],13:[function(require,module,exports){
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
        this.projects = {};
    }

    _createClass(SideBarStore, [{
        key: 'onGetProjectsSuccess',
        value: function onGetProjectsSuccess(data) {
            this.projects = data;
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

},{"../actions/sideBarActions":2,"../alt":3}]},{},[10])


//# sourceMappingURL=bundle.js.map
