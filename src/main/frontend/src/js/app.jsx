'use strict';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../css/throbber.css';

import 'bootstrap';


// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {activities: []};
	}

	fetchMyActivities(before, after, type) {
	    let beforeEpoch;

        if (before) {
            beforeEpoch = Math.floor((new Date(before).getTime() + 86400000) / 1000);
        }

        let afterEpoch;
        if (after) {
            afterEpoch = Math.floor(new Date(after).getTime() / 1000);
        }
        let url = 'rest/activities?before=' + (beforeEpoch ? beforeEpoch : '') + '&after=' + (afterEpoch ? afterEpoch : '') + '&type=' + (type ? type : '');
        console.log(url);
        return fetch(url);
    };

	componentDidMount() {
	    let today = new Date();
        let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let after = firstDayOfMonth;
	    this.fetchMyActivities(null, after, 'ride').
	        then((response) => {
	                let _activities = response.blob();
	                this.setState({activities:_activities});
	                console.log(_activities);

	            }
	        ).
	        catch((error) => { console.error(error); });
	}

	render() {
		return (
			<div>Hello world!</div>
		)
	}
}

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)