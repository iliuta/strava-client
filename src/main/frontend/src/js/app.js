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

var stravaAppFilters = angular.module('stravaAppFilters', []).filter('duration', function () {

    return function (seconds) {
        var result = "";
        var minutes = Math.floor(seconds / 60);

        var reminderSeconds = seconds % 60;

        result = reminderSeconds + "s";

        if (minutes > 60) {
            var hours = Math.floor(minutes / 60);

            var reminderMinutes = minutes % 60;

            result = reminderMinutes + "min:" + result;

            if (hours > 24) {
                var days = Math.floor(hours / 24);

                var reminderHours = hours % 24;

                result = days + "d:" + reminderHours + "h:" + result;

            } else if (hours > 0) {
                result = hours + "h:" + result;

            }
        } else if (minutes > 0) {
            result = minutes + "min:" + result;
        }

        return result;
    };
}).filter('profileImage', function () {

    return function (profileImageUrl) {
        var result = "";

        if (profileImageUrl && profileImageUrl.startsWith("http")) {
            result = profileImageUrl;
        } else {
            result = "https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large-63758b9942e3f074c3ecb84db07928ee.png";

        }

        return result;
    };
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