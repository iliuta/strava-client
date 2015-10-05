var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$compile', '$scope', '$http', '$filter', '$locale',
    function ($compile, $scope, $http, $filter, $locale) {

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

        function compileInfoWindow() {
            var template = '<div ng-include src="\'app/templates/infowindow.html\'"></div>';
            var compiled = $compile(template)($scope);
            $scope.$apply();
            return compiled[0].parentNode;
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
                    function (event) {
                        activityGmapsPath.setOptions({strokeColor: 'blue', strokeWeight: 4});
                        $scope.currentActivity = activity;
                        $scope.$apply();
                        $scope.infoWindow.setPosition(event.latLng);
                        if (!$scope.infoWindowCompiled) {
                            $scope.infoWindow.setContent(compileInfoWindow());
                            $scope.infoWindowCompiled = true;
                        }
                    });

                google.maps.event.addListener(activityGmapsPath, 'mouseout',
                    function () {
                        activityGmapsPath.setOptions({strokeColor: 'red', strokeWeight: 2});
                    });


                google.maps.event.addListener(activityGmapsPath, 'click',
                    function (event) {
                        $scope.infoWindow.setPosition(event.latLng);
                        $scope.infoWindow.open(map, activityGmapsPath);
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

                    if (!country.states) {
                        country.states = new Object();
                    }

                    if (!activity.location_state) {
                        activity.location_state = "";
                    }
                    if (!country.states[activity.location_state]) {
                        country.states[activity.location_state] = new Totals();
                    }
                    country.states[activity.location_state].add(activity);


                    var state = country.states[activity.location_state];

                    if (!state.cities) {
                        state.cities = new Object();
                    }

                    if (activity.location_city) {
                        if (!state.cities[activity.location_city]) {
                            state.cities[activity.location_city] = new Totals();
                        }
                        state.cities[activity.location_city].add(activity);
                    }
                }
            });

        }

        $scope.drawActivitiesOnMap = function (activities) {
            $('html,body').animate({scrollTop: $('#map-canvas').offset().top});
            $scope.infoWindow = new google.maps.InfoWindow();
            $scope.infoWindowCompiled = false;

            var bounds = new google.maps.LatLngBounds();
            $scope.map = new google.maps.Map($('#map-canvas')[0],
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

        $scope.fetchPhotos = function (activities) {
            activities.forEach(function (activity) {
                if (activity.total_photo_count && activity.total_photo_count > 0) {
                    $http.get('rest/photos/' + activity.id).success(function (photos) {
                        photos.forEach(function (photo) {
                            if (photo.location && photo.location.length == 2) {
                                var photoLatLng = new google.maps.LatLng(photo.location[0], photo.location[1]);
                                /*var iwPhoto = new google.maps.InfoWindow();
                                 iwPhoto.setContent("<img src='" + photo.urls[0] + "'>");

                                 iwPhoto.setPosition(photoLatLng);
                                 iwPhoto.open($scope.map);*/


                                var image = {
                                    url: photo.urls[300],
                                    // This marker is 20 pixels wide by 32 pixels high.
                                    scaledSize: new google.maps.Size(50, 50),
                                    // The origin for this image is (0, 0).
                                    origin: new google.maps.Point(0, 0),
                                    // The anchor for this image is the base of the flagpole at (0, 32).
                                    anchor: new google.maps.Point(0, 32)
                                    
                                };
                                var marker = new google.maps.Marker({
                                    position: photoLatLng,
                                    clickable: true,
                                    map: $scope.map,
                                    title: photo.urls[300],
                                    icon: image
                                });
                                
                                var photoOpenUrl = photo.urls[300];
                                if (photo.source && photo.source==2) {
                                    photoOpenUrl = photo.ref;
                                }

                                marker.addListener('click', function() {
                                    window.open(photoOpenUrl);
                                });
                            }
                        });
                    }).error(function (data) {
                        console.log(data);
                        $scope.stravaError = data;
                    });

                }
            });

        }

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

        $scope.fetchClubActivities = function (clubId) {
            initScopeProperties(false);
            $http.get('rest/club-activities/' + clubId).success(onSuccessActivities).error(function (data) {
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
