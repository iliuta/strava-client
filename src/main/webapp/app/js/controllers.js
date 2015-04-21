var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$scope', '$http',
    function ($scope, $http) {
        
        var mapOptions = {
            center: { lat: 48.880821, lng: 2.242003 },
            zoom: 8
        };

        $scope.openDatePickerBefore = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datePickerOpenedBefore = true;
        };

        $scope.openDatePickerAfter = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datePickerOpenedAfter = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false
        };


        $scope.fetchActivities = function (before, after) {
            $scope.stravaError = null;

            $scope.activities = null;

            $scope.currentActivity = null;

            $scope.trainerDistance = 0;

            $scope.commuteDistance = 0;

            $scope.totalDistance = 0;

            $scope.totalElevationGain = 0;

            $scope.gearDistances = new Object();

            if (before) {
                before = Math.floor(new Date(before).getTime() / 1000);
            }
            if (after) {
                after = Math.floor(new Date(after).getTime() / 1000);
            }
            $http.get('rest/activities?before=' + (before ? before : '') + '&after=' + (after ? after : '')).success(function (data) {

                var bounds = new google.maps.LatLngBounds();

                $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                $scope.activities = data;

                $scope.activities.forEach(function (activity) {
                    if (activity.type == 'Ride') {

                        if (activity.commute) {
                            $scope.commuteDistance += activity.distance;
                        }

                        if (activity.trainer) {
                            $scope.trainerDistance += activity.distance;
                        }

                        $scope.totalDistance += activity.distance;
                        
                        $scope.totalElevationGain += activity.total_elevation_gain;

                        if (activity.gear_id) {
                            if ($scope.gearDistances[activity.gear_id]) {
                                $scope.gearDistances[activity.gear_id] += activity.distance;
                            } else {
                                $scope.gearDistances[activity.gear_id] = activity.distance;
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

                            activityGmapsPath.setMap($scope.map);
                        }
                    }
                });

                $scope.map.fitBounds(bounds);
                $scope.map.panToBounds(bounds);

            }).error(function (data) {
                $scope.stravaError = data;
            });
        }
    }]);
