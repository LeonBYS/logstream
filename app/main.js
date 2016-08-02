import React from 'react';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


import {Router} from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';
import { browserHistory } from 'react-router'


ReactDOM.render(
    <Router history={browserHistory}>{routes}</Router>, 
    document.getElementById('app')
);