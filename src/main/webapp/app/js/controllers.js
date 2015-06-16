var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$scope', '$http', '$filter', '$locale',
    function ($scope, $http, $filter, $locale) {

        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;

        var mapOptions = {
            center: { lat: 48.880821, lng: 2.242003 },
            zoom: 8
        };

        var onAjaxError = function (data) {
            console.log(data);
            $scope.stravaError = data;
        };

        // get athlete profile at the beginning
        $http.get('rest/profile').success(function (data) {
            $scope.athleteProfile = data;
        }).error(onAjaxError);


        // object to store some statistics
        function Totals() {
            this.nb = 0;
            this.distance = 0;
            this.elevationGain = 0;
            this.movingTime = 0;
            this.elapsedTime = 0;
            this.activities = [];

            this.add = function (activity) {
                this.activities.push(activity);
                this.distance += activity.distance;
                this.movingTime += activity.moving_time;
                this.elapsedTime += activity.elapsed_time;
                this.elevationGain += activity.total_elevation_gain;
                this.nb++;
            }
        }

        function initScopeProperties(withGear) {
            $scope.withGear = withGear;
            
            $scope.stravaError = null;

            $scope.currentActivity = null;

            $scope.activities = null;

            $scope.globalTotals = new Totals();

            $scope.trainerTotals = new Totals();

            $scope.manualTotals = new Totals();

            $scope.commuteTotals = new Totals();

            $scope.noCommuteTotals = new Totals();

            $scope.countryTotals = new Object();

            $scope.gearTotals = new Object();
        }


        function drawActivityPolylineOnMap(activity, bounds, map) {
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

                activityGmapsPath.setMap(map);
            }
        }

        function findGearName(gear_id) {
            if ($scope.athleteProfile) {
                for (var bikeIndex in $scope.athleteProfile.bikes) {
                    var bike = $scope.athleteProfile.bikes[bikeIndex];
                    if (bike.id == gear_id) {
                        return bike.name;
                    }
                }
                for (var shoeIndex in $scope.athleteProfile.shoes) {
                    var shoe = $scope.athleteProfile.shoes[shoeIndex];
                    if (shoe.id == gear_id) {
                        return shoe.name;
                    }
                }
            }
            return "unnamed gear";
        }


        function computeAllTotals(activities) {
            $scope.activities.forEach(function (activity) {

                $scope.globalTotals.add(activity);

                if (activity.commute) {
                    $scope.commuteTotals.add(activity);
                } else {
                    $scope.noCommuteTotals.add(activity);
                }

                if (activity.trainer) {
                    $scope.trainerTotals.add(activity);
                }

                if (activity.manual) {
                    $scope.manualTotals.add(activity);
                }


                if ($scope.withGear && activity.gear_id) {
                    if (!$scope.gearTotals[activity.gear_id]) {
                        $scope.gearTotals[activity.gear_id] = new Totals();
                    }
                    $scope.gearTotals[activity.gear_id].add(activity);
                    $scope.gearTotals[activity.gear_id].gearName = findGearName(activity.gear_id);
                }

                if (activity.location_country) {
                    if (!$scope.countryTotals[activity.location_country]) {
                        $scope.countryTotals[activity.location_country] = new Totals();
                    }
                    $scope.countryTotals[activity.location_country].add(activity);

                    var country = $scope.countryTotals[activity.location_country];

                    if (!country.cities) {
                        country.cities = new Object();
                    }

                    if (activity.location_city) {
                        if (!country.cities[activity.location_city]) {
                            country.cities[activity.location_city] = new Totals();
                        }
                        country.cities[activity.location_city].add(activity);
                        country.cities[activity.location_city].state = activity.location_state;
                    }
                }
            });

        }

        $scope.drawActivitiesOnMap = function(activities) {
            var bounds = new google.maps.LatLngBounds();
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
            activities.forEach(function (activity) {
                drawActivityPolylineOnMap(activity, bounds, $scope.map);
            });
            $scope.map.fitBounds(bounds);
            $scope.map.panToBounds(bounds);
        }


        var onSuccessActivities = function (activities) {
            $scope.activities = activities;
            computeAllTotals(activities);
            $scope.drawActivitiesOnMap(activities);

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
            initScopeProperties(false);
            $http.get('rest/friends-activities').success(onSuccessActivities).error(function (data) {
                $scope.stravaError = data;
            });

        };

        $scope.fetchMyActivities = function (before, after, type) {
            initScopeProperties(true);

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


        // default behaviour, open my activities of the current month
        $scope.fetchMyActivitiesThisMonth(null);
    }]);
