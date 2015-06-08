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
            
            $scope.totalMovingTime = 0;

            $scope.totalMovingFormatted = 0;
            
            $scope.totalElapsedTime = 0;

            $scope.totalElapsedTimeFormatted = null;

            $scope.totalMovingTimeCommute = 0;
            
            $scope.totalMovingTimeCommuteFormatted = null;
            
            $scope.totalMovingTimeNoCommute = 0;
            
            $scope.totalMovingTimeNoCommuteFormatted = null;

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

                $scope.totalMovingTime += activity.moving_time;

                $scope.totalElapsedTime += activity.elapsed_time;

                if (activity.commute) {
                    $scope.commuteDistance += activity.distance;
                    $scope.totalMovingTimeCommute += activity.moving_time;
                } else {
                    $scope.totalMovingTimeNoCommute += activity.moving_time;
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

            $scope.totalMovingTimeFormatted = formatTime($scope.totalMovingTime);

            $scope.totalElapsedTimeFormatted = formatTime($scope.totalElapsedTime);
            
            $scope.totalMovingTimeCommuteFormatted = formatTime($scope.totalMovingTimeCommute);

            $scope.totalMovingTimeNoCommuteFormatted = formatTime($scope.totalMovingTimeNoCommute);

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
            initScopeProperties();
            $http.get('rest/friends-activities').success(onSuccessActivities).error(function (data) {
                $scope.stravaError = data;
            });

        };

        $scope.fetchMyActivities = function (before, after, type) {
            initScopeProperties();

            var beforeEpoch;
            
            if (before) {
                beforeEpoch = Math.floor((new Date(before).getTime() + 86400000) / 1000);
            }
            
            var afterEpoch;
            if (after) {
                afterEpoch = Math.floor(new Date(after).getTime() / 1000);
            }
            $http.get('rest/activities?before=' + (beforeEpoch ? beforeEpoch : '') + '&after=' + (afterEpoch ? afterEpoch : '') + '&type=' + (type ? type : '')).success(onSuccessActivities).error(onErrorActivities);
        };


        formatTime = function (seconds) {
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

        // default behaviour, open my activities of the current month
        $scope.fetchMyActivitiesThisMonth(null);
    }]);
