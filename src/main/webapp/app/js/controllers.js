var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$compile', '$scope', '$http', '$filter', '$locale',
    function ($compile, $scope, $http, $filter, $locale) {

        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;


        //$scope.map = L.map('map-canvas').setView([48.880821, 2.242003], 8);

        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 18, attribution: osmAttrib});
        var ocm = L.tileLayer("http://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png");
        var google = L.tileLayer('//mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}', {
            maxZoom: 18,
            subdomains: [ 0, 1, 2, 3 ]
        });
        var mapboxToken = "pk.eyJ1IjoiaWxpdXRhIiwiYSI6ImNpZmplb2RoODAweWV0amtuMnV6NG41N3QifQ.ielyh5hPAkTB9AquOPeuYQ";
        var runBikeHike =
            L.tileLayer("https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=" + mapboxToken,
                {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                });
        var satellite =
            L.tileLayer("https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=" + mapboxToken,
                {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                });


        $scope.popup = L.popup();

        var baseMaps = {
            "OpenStreetMap": osm,
            "OpenCycleMap": ocm,
            "Mapbox Terrain": runBikeHike,
            "Mapbox Streets Satellite": satellite
        };

        $scope.map = L.map('map-canvas', {
            center: [39.73, -104.99],
            zoom: 8,
            layers: [osm]
        });
        L.control.layers(baseMaps).addTo($scope.map);


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


        function drawActivityPolylineOnMap(activity, map) {
            if (!activity.map.summary_polyline) {
                console.log(activity.name);
                return null;
            } else {
                var decodedPath = L.Polyline.fromEncoded(activity.map.summary_polyline);

                var osmPath = L.polyline(decodedPath.getLatLngs(), {color: '#FF0000', weight: 2}).addTo(map);

                osmPath.bindPopup($scope.popup);

                osmPath.addEventListener('mouseover',
                    function (event) {
                        osmPath.setStyle({color: 'blue', weight: 7});
                        /*$scope.currentActivity = activity;
                         $scope.$apply();
                         if (!$scope.infoWindowCompiled) {
                         $scope.popup.setContent(compileInfoWindow());
                         $scope.infoWindowCompiled = true;
                         }
                         $scope.popup.setLatLng(event.latlng);*/
                    });


                osmPath.addEventListener('mouseout',
                    function () {
                        osmPath.setStyle({color: '#FF0000', weight: 2});
                    });


                osmPath.addEventListener('click',
                    function (event) {
                        $scope.currentActivity = activity;
                        $scope.$apply();
                        $scope.popup.setContent(compileInfoWindow());
                        $scope.popup.setLatLng(event.latlng);
                    });

                return osmPath;
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
            $('html,body').animate({scrollTop: $('#mapTop').offset().top});

            if ($scope.polylinesLayerGroup) {
                $scope.polylinesLayerGroup.clearLayers();
            }

            var bounds = null;

            $scope.polylinesLayerGroup = L.layerGroup();
            $scope.polylinesLayerGroup.addTo($scope.map);

            activities.forEach(function (activity) {
                var polyline = drawActivityPolylineOnMap(activity, $scope.map);
                if (polyline) {
                    if (!bounds) {
                        bounds = polyline.getBounds();
                    } else {
                        bounds.extend(polyline.getBounds());
                    }
                    $scope.polylinesLayerGroup.addLayer(polyline);
                }
            });

            $scope.map.fitBounds(bounds);
            $scope.map.panInsideBounds(bounds);
        };


        var onSuccessActivities = function (activities) {
            $scope.activities = activities;
            $scope.photos = null;
            computeAllTotals(activities);
            $scope.drawActivitiesOnMap(activities);
        };

        var drawPhotos = function (photos) {
            photos.forEach(function (photo) {
                if (photo.location && photo.location.length == 2) {
                    var photoLatLng = new L.latLng(photo.location[0], photo.location[1]);

                    var photoUrl = photo.urls[300];

                    var image = L.icon({
                        iconUrl: photoUrl,
                        iconSize: [50, 50],
                        iconAnchor: [0, 32]
                    });

                    var marker = L.marker(photoLatLng, {
                        riseOnHover: true,
                        title: photoUrl,
                        icon: image
                    });

                    marker.addEventListener('click', function () {
                        $scope.currentPhotoUrl = photoUrl;
                        $scope.currentPhoto = photo;
                        $scope.$apply();
                        $('#photoModal').modal('show');
                    });
                    marker.addTo($scope.map);
                }
            });

        };


        $scope.fetchPhotos = function (activities) {
            if (!$scope.photos) {
                $scope.photos = [];
                activities.forEach(function (activity) {
                    if (activity.total_photo_count && activity.total_photo_count > 0) {
                        $http.get('rest/photos/' + activity.id).success(function (photos) {
                            $scope.photos = $scope.photos.concat(photos);
                            drawPhotos(photos);
                        }).error(function (data) {
                            console.log(data);
                            $scope.stravaError = data;
                        });

                    }
                });
            } else {
                drawPhotos($scope.photos);
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
    }])
;
