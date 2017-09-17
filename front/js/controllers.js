import angular from 'angular';
import StravaMap from './map.js';
const Statistics = require('./statistics.js');

import infoWindowTemplateUrl from '../templates/infowindow.html';
// end hack

var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$compile', '$scope', '$http', '$filter', '$locale',
    function ($compile, $scope, $http, $filter, $locale) {

        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;

        let gpxTrck = [];
        let gpxRoute = [];

        let stravaMap = new StravaMap(function () {
            let template = '<div ng-include src="\'' + infoWindowTemplateUrl + '\'"></div>';
            let compiled = $compile(template)($scope);
            $scope.$apply();
            return compiled[0].parentNode;
        });

        stravaMap.on('selectActivity',
            function (activity) {
                $scope.currentActivity = activity;
                $scope.$apply();
            }
        ).on('photoClick',
            function (photoUrl, photo) {
                $scope.currentPhotoUrl = photoUrl;
                $scope.currentPhoto = photo;
                $scope.$apply();
                $('#photoModal').modal('show');
            }
            ).on('routeFound',
            function (track, route) {
                gpxTrck = track;
                gpxRoute = route;
                $scope.routeFound = true;
                $scope.$apply();
            }
            );

        function setMapSize() {
            $("#map-canvas").height($(window).height() * 0.7);
            stravaMap.invalidateMapSize();
        }
        // resize the map according when resizing the window
        $(window).on("resize", setMapSize).trigger("resize");

        // initialize the map size at the beginning
        setMapSize();

        $scope.routeFound = false;
        $scope.routePlannerOnOff = false;

        $scope.activateRoutePlanner = function () {
            if ($scope.routePlannerOnOff) {
                stravaMap.displayRoutePlanner();
            } else {
                $scope.clearRoute();
                stravaMap.hideRoutePlanner();
            }
        };

        $scope.clearRoute = function () {
            stravaMap.resetRoutePlanner();
            $scope.routeFound = false;
        };

        var onAjaxError = function (data) {
            console.log(data);
            $scope.stravaError = data;
            $scope.downloadInProgress = false;
        };


        function initScopeProperties(withGear, mine) {

            // flag used to deactivate buttons while the download is in progress
            $scope.downloadInProgress = true;

            // flag used to display gear statistics or not (in case of club and friends activities)
            $scope.withGear = withGear;

            // flag used to inform that activities displayed are mine or others' activities (clubs or friends)
            // used to display or not the "photos" button (cannot display photos from activities not mine)
            $scope.mine = mine;

            // store some error and display it on the screen
            $scope.stravaError = null;

            // the activity currently clicked on the map 
            $scope.currentActivity = null;

            // the list of activities currently displayed on the map 
            $scope.activities = null;

            $scope.statistics = new Statistics(withGear, $scope.athleteProfile);
        }

        // get athlete profile at the beginning
        $http.get('rest/profile').success(function (data) {
            $scope.athleteProfile = data;
            initScopeProperties(true, true);
        }).error(onAjaxError);

        $scope.drawActivityOnMap = function (activity) {
            $scope.drawActivitiesOnMap([activity]);
        };

        $scope.drawActivitiesOnMap = function (activities) {
            $('html,body').animate({ scrollTop: $('#mapTop').offset().top });

            stravaMap.drawActivities(activities);
        };

        var onSuccessActivities = function (activities) {
            $scope.activities = activities;
            $scope.photos = null;

            $scope.statistics.addAll(activities);

            $scope.drawActivitiesOnMap(activities);
            $scope.downloadInProgress = false;
            if (!activities || activities.length == 0) {
                $scope.stravaError = { code: "0", message: "No activities found. Please change your criteria and try again." };
            }
        };

        $scope.fetchPhotos = function (activities) {
            if (!$scope.photos) {
                $scope.photos = [];
                activities.forEach(function (activity) {
                    if (activity.total_photo_count && activity.total_photo_count > 0) {
                        $scope.downloadInProgress = true;
                        $http.get('rest/photos/' + activity.id).success(function (photos) {
                            $scope.downloadInProgress = false;
                            $scope.photos = $scope.photos.concat(photos);
                            stravaMap.drawPhotos(photos);
                        }).error(onAjaxError);

                    }
                });
            } else {
                stravaMap.drawPhotos($scope.photos);
            }
        };

        $scope.fetchMyActivitiesThisYear = function (type) {
            var today = new Date();
            var firstDayOfYear = new Date(today.getFullYear() + "");
            $scope.after = firstDayOfYear;
            $scope.fetchMyActivities(null, firstDayOfYear, type);

        };

        $scope.fetchMyActivitiesThisMonth = function (type) {
            var today = new Date();
            var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            $scope.after = firstDayOfMonth;
            $scope.fetchMyActivities(null, firstDayOfMonth, type);
        };

        $scope.fetchFriendsActivities = function () {
            initScopeProperties(false, false);
            $http.get('rest/friends-activities').success(onSuccessActivities).error(onAjaxError);

        };

        $scope.fetchClubActivities = function (clubId) {
            initScopeProperties(false, false);
            $http.get('rest/club-activities/' + clubId).success(onSuccessActivities).error(onAjaxError);
        };

        $scope.fetchMyActivities = function (before, after, type) {
            initScopeProperties(true, true);

            var beforeEpoch;

            if (before) {
                beforeEpoch = Math.floor((new Date(before).getTime() + 86400000) / 1000);
            }

            var afterEpoch;
            if (after) {
                afterEpoch = Math.floor(new Date(after).getTime() / 1000);
            }
            $http.get('rest/activities?before=' + (beforeEpoch ? beforeEpoch : '') + '&after=' + (afterEpoch ? afterEpoch : '') + '&type=' + (type ? type : '')).success(onSuccessActivities).error(onAjaxError);
        };


        $scope.displayEditActivityModal = function (activity) {
            $scope.currentActivity = activity;
            // copy the currentActivity into a new object to edit without change the selected activity
            $scope.currentEditActivity = {};
            $scope.currentEditActivity.type = activity.type;
            $scope.currentEditActivity.id = activity.id;
            $scope.currentEditActivity.name = activity.name;
            $scope.currentEditActivity.private = activity.private;
            $scope.currentEditActivity.trainer = activity.trainer;
            $scope.currentEditActivity.commute = activity.commute;
            $scope.currentEditActivity.gear_id = activity.gear_id;
            $('#editActivityModal').modal('show');
        };

        $scope.displayRoutePlannerHelpModal = function () {
            $('#routePlannerHelpModal').modal('show');
        };

        $scope.update = function (activity) {
            $http.post("rest/update-activity", activity).success(function () {
                $scope.statistics.updateActivity(activity, $scope.currentActivity);
                $('#editActivityModal').modal('hide');
            }).error(onAjaxError);
        };

        /**
         * Create gpx track file and download it
         */
        $scope.downloadGpxTrack = function () {
            //console.log($scope.route);
            var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n' +
                '\t<metadata>\n\t\t<name>Track</name>\n\t</metadata>\n' +
                '\t<trk>\n\t\t<name>Track</name>\n';

            gpxTrck.forEach(function (coords) {
                gpx += '\t\t<trkpt lat="' + coords.lat + '" lon="' + coords.lng + '" />\n';
            });


            gpx += '\t</trk>\n</gpx>';

            window.open('data:application/gpx+xml,' + encodeURIComponent(gpx), "_blank");
        };


        $scope.downloadGpxRoute = function () {
            var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n' +
                '\t<metadata>\n\t\t<name>Route</name>\n\t</metadata>\n' +
                '\t<rte>\n\t\t<name>Route</name>\n';

            gpxRoute.forEach(function (coords) {
                gpx += '\t\t<rtept lat="' + coords.lat + '" lon="' + coords.lng + '" />\n';
            });


            gpx += '\t</rte>\n</gpx>';

            window.open('data:application/gpx+xml,' + encodeURIComponent(gpx), "_blank");
        };


        // default behaviour, open my activities of the current month
        $scope.fetchMyActivitiesThisMonth(null);
    }]);

export { stravaControllers };