var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$scope', '$http', '$filter', '$locale',
    function ($scope, $http, $filter, $locale) {


        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;

        var mapOptions = {
            center: { lat: 48.880821, lng: 2.242003 },
            zoom: 8
        };


        function initScopeProperties() {
            $scope.stravaError = null;

            $scope.activities = null;

            $scope.currentActivity = null;

            $scope.trainerDistance = 0;

            $scope.manualDistance = 0;

            $scope.commuteDistance = 0;

            $scope.totalDistance = 0;

            $scope.totalElevationGain = 0;

            $scope.countries = new Object();
        }


        var onSuccessActivities = function (data) {

            var bounds = new google.maps.LatLngBounds();

            $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            $scope.activities = data;

            $scope.activities.forEach(function (activity) {

                activity.moving_time_date = new Date(null, null, null, 0, null, activity.moving_time, null);
                activity.elapsed_time_date = new Date(null, null, null, 0, null, activity.elapsed_time, null);

                if (activity.commute) {
                    $scope.commuteDistance += activity.distance;
                }

                if (activity.trainer) {
                    $scope.trainerDistance += activity.distance;
                }

                if (activity.manual) {
                    $scope.manualDistance += activity.distance;

                }

                $scope.totalDistance += activity.distance;

                $scope.totalElevationGain += activity.total_elevation_gain;

                if (activity.location_country) {
                    if ($scope.countries[activity.location_country]) {
                        $scope.countries[activity.location_country].distance += activity.distance;
                        $scope.countries[activity.location_country].nb++;
                    } else {
                        $scope.countries[activity.location_country] = new Object();
                        $scope.countries[activity.location_country].distance = activity.distance;
                        $scope.countries[activity.location_country].nb = 1;
                    }
                    var country = $scope.countries[activity.location_country];
                    if (!country.cities) {
                        country.cities = new Object();
                    }
                    if (activity.location_city) {
                        if (country.cities[activity.location_city]) {
                            country.cities[activity.location_city].distance += activity.distance;
                            country.cities[activity.location_city].nb++
                        } else {
                            country.cities[activity.location_city] = new Object();
                            country.cities[activity.location_city].state = activity.location_state;
                            country.cities[activity.location_city].distance = activity.distance;
                            country.cities[activity.location_city].nb = 1;
                        }
                    }
                }

                if (!activity.map.summary_polyline) {
                    console.log(activity.name);
                } else {
                    var decodedPath = google.maps.geometry.encoding.decodePath(activity.map.summary_polyline);

                    decodedPath.forEach(function (point, index) {
                            var loc = new google.maps.LatLng(point.lat(), point.lng());
                            bounds.extend(loc);
                        }
                    );

                    var activityGmapsPath = new google.maps.Polyline({
                        path: decodedPath,
                        geodesic: true,
                        strokeColor: 'red',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    google.maps.event.addListener(activityGmapsPath, 'mouseover',
                        function () {
                            activityGmapsPath.setOptions({strokeColor: 'blue', strokeWeight: 4});
                            $scope.currentActivity = activity;
                            $scope.$apply();
                        });

                    google.maps.event.addListener(activityGmapsPath, 'mouseout',
                        function () {
                            activityGmapsPath.setOptions({strokeColor: 'red', strokeWeight: 2});
                        });

                    google.maps.event.addListener(activityGmapsPath, 'click',
                        function () {
                            window.open("http://www.strava.com/activities/" + activity.id, "_blank");
                        });

                    activityGmapsPath.setMap($scope.map);
                }
            });

            $scope.map.fitBounds(bounds);
            $scope.map.panToBounds(bounds);

        };

        var onErrorActivities = function (data) {
            $scope.stravaError = data;
        };


        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false
        };


        $scope.centerMap = function (country) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': country}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.map.setCenter(results[0].geometry.location);
                    $scope.map.fitBounds(results[0].geometry.viewport);
                } else {
                    alert('Geocoding error: ' + status);
                }
            });
        };

        $scope.fetchActivitiesThisYear = function (type) {
            var today = new Date();
            var firstDayOfYear = new Date(today.getFullYear() + "");
            $scope.after = firstDayOfYear;
            $scope.fetchActivities(null, firstDayOfYear, type);

        };
        
        $scope.fetchActivitiesThisMonth = function (type) {
            var today = new Date();
            var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            $scope.after = firstDayOfMonth;
            $scope.fetchActivities(null, firstDayOfMonth, type);

        };

        $scope.fetchFriendsActivities = function () {
            initScopeProperties();
            $http.get('rest/friends-activities').success(onSuccessActivities).error(function (data) {
                $scope.stravaError = data;
            });

        };

        $scope.fetchActivities = function (before, after, type) {
            initScopeProperties();

            if (before) {
                before = Math.floor((new Date(before).getTime() + 86400000) / 1000);
            }
            if (after) {
                after = Math.floor(new Date(after).getTime() / 1000);
            }
            $http.get('rest/activities?before=' + (before ? before : '') + '&after=' + (after ? after : '') + '&type=' + (type ? type : '')).success(onSuccessActivities).error(onErrorActivities);
        };

        // default behaviour, open my activities of the current month
        $scope.fetchActivitiesThisMonth(null);
    }]);
