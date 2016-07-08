import React from 'react';
import LogWindow from './logWindow'

class Content extends React.Component {
    render () {
        return (
            <div id="page-wrapper">
                <LogWindow />
            </div>
        );
    }
}

export default Content;