import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../css/throbber.css';

import 'bootstrap';
import angular from 'angular';
import ngRoute from 'angular-route';
import stravaControllers from './controllers.js';
import uiBootstrap from 'angular-ui-bootstrap';
import activitiesTemplateUrl from '../templates/activities.html';

import {durationString, profileImageUrlOrDefault} from './util.js'

var stravaAppFilters = angular.module('stravaAppFilters', []).filter('duration', function () {
    return durationString;
}).filter('profileImage', function () {
    return profileImageUrlOrDefault;
});

var stravaApp = angular.module('stravaApp', [
    'ngRoute',
    'stravaControllers',
    'ui.bootstrap',
    'stravaAppFilters'
]);

stravaApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/activities', {
                templateUrl: activitiesTemplateUrl,
                controller: 'ActivitiesCtrl'
            }).
            otherwise({
                redirectTo: '/activities'
            });
    }]);


export { stravaApp };