'use strict';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../css/throbber.css';

import 'bootstrap';

import StravaMap from './map.js';

import { durationString, profileImageUrlOrDefault } from './util.js';


const React = require('react');
const ReactDOM = require('react-dom');

const Statistics = require('./statistics.js');

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stravaMap: null
		};
	}


	componentDidMount() {
		let map = new StravaMap();
		this.setState({ stravaMap: map });
	}

	componentDidUpdate() {
		this.state.stravaMap.drawActivities(this.props.activities);
	}

	render() {
		return (
			<div className="panel-body">
				<div id="map-canvas"></div>
			</div>
		);
	}
}

class StatisticsDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		if (!this.props.statistics) {
			return null;
		}

		const rows = this.props.statistics.totals.map((total, index) => {
			if (total.nb == 0) {
				return null;
			} else {
				const tbodyId = total.id + 'Collapse';

				const rowsActivities = total.activities.map((activity, index) => {
					const activityRowKey = tbodyId + activity.id;
					const athleteUrl = "http://www.strava.com/athletes/" + activity.athlete.id;
					return (
						<tr key={activityRowKey}>
							<td>
								<a href="#" title="Edit activity"><span className="glyphicon glyphicon-edit" aria-hidden="true" ></span></a>&nbsp;
								<a href="#"><b>{activity.name}</b></a>
								<a href={athleteUrl} target="_blank">{activity.athlete.firstname} {activity.athlete.lastname}</a>
								{activity.start_date}
								<span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
							</td>
							<td></td>
							<td>{activity.distance / 1000}km</td>
							<td>{activity.total_elevation_gain}m</td>
							<td>{durationString(activity.moving_time)}</td>
							<td>{durationString(activity.elapsed_time)}</td>
							<td>{durationString(activity.elapsed_time - activity.moving_time)}</td>
							<td>{3600 * activity.distance / activity.moving_time / 1000}km/h</td>
						</tr>

					);
				});


				const dataTarget = '#' + total.id + 'Collapse';
				return (
					[<tbody key={index}>
						<tr>
							<td><a href="#" data-toggle="collapse" data-target={dataTarget} title="Expand/Collapse"><span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span></a><b>
								<a href="#">{total.title}</a></b>
							</td>
							<td>
								{total.nb}
							</td>
							<td>{total.distance / 1000}km</td>
							<td>{total.elevationGain}m</td>
							<td>{durationString(total.movingTime)}</td>
							<td>{durationString(total.elapsedTime)}</td>
							<td>{durationString(total.elapsedTime - total.movingTime)}</td>
							<td>{3600 * total.distance / total.movingTime / 1000}km/h</td>
						</tr>
					</tbody>,
					<tbody id={tbodyId} className="collapse out">
						{rowsActivities}
					</tbody>]
				);
			}
		});
		console.log(rows);
		return (
			<div className="panel-footer table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th></th>
							<th>Activities</th>
							<th>Distance</th>
							<th>Elevation gain</th>
							<th>Moving time</th>
							<th>Elapsed time</th>
							<th>Motionless time</th>
							<th>Avg speed</th>
						</tr>
					</thead>
					{rows}
				</table>
			</div>
		)
	}
}


class StravaHeatmapApp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activities: [],
			statistics: null,
			athleteProfile: null
		};
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

		// TODO: check errors of the ajax call!
		fetch(url, { credentials: 'same-origin' })
			.then((response) => response.json())
			.then((responseJson) => {
				let statistics = new Statistics();
				statistics.addAll(responseJson);
				this.setState({
					activities: responseJson,
					statistics: statistics
				});
			})
			.catch((error) => { console.error(error); });;
	};

	componentDidMount() {
		let today = new Date();
		let after = new Date(today.getFullYear(), today.getMonth(), 1);
		fetch('rest/profile', { credentials: 'same-origin' })
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({ athleteProfile: responseJson });
				this.fetchMyActivities(null, after, null);
			})
			.catch(error => console.error(error));

	}

	render() {
		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div id="mapTop" className="panel-heading">
						<Map activities={this.state.activities} />
						<StatisticsDisplay statistics={this.state.statistics} />
					</div>
				</div>
			</div>
		)
	}
}

// tag::render[]
ReactDOM.render(
	<StravaHeatmapApp />,
	document.getElementById('react')
)