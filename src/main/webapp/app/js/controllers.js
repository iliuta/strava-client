var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$compile', '$scope', '$http', '$filter', '$locale',
    function ($compile, $scope, $http, $filter, $locale) {

        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;


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
        var streets =
            L.tileLayer("https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" + mapboxToken,
                {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                });
        var satellite =
            L.tileLayer("https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=" + mapboxToken,
                {
                    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
                });


        $scope.popup = L.popup();
        var template = '<div ng-include src="\'app/templates/infowindow.html\'"></div>';
        var compiled = $compile(template)($scope);
        $scope.popup.setContent(compiled[0].parentNode);

        var baseMaps = {
            "OpenStreetMap": osm,
            "OpenCycleMap": ocm,
            "Mapbox Terrain": runBikeHike,
            "Mapbox Streets Satellite": satellite,
            "Mapbox Streets": streets
        };

        $scope.map = L.map('map-canvas', {
            center: [39.73, -104.99],
            zoom: 8,
            layers: [runBikeHike]
        });
        L.control.layers(baseMaps).addTo($scope.map);

        $scope.gpxUrl = null;

        var routingControl = L.Routing.control(
            {
                waypoints: [],
                lineOptions: {
                    styles: [
                        {color: 'black', opacity: 0.15, weight: 9},
                        {color: 'white', opacity: 0.8, weight: 6},
                        {color: 'yellow', opacity: 1, weight: 2}
                    ]
                }
            }).addTo($scope.map);

        routingControl.getPlan().on("waypointschanged", function (e) {
            var waypoints = routingControl.getWaypoints();

            var nonEmptyWaypoints = waypoints.filter(function (waypoint) {
                if (waypoint.latLng) {
                    return waypoint;
                }
            });

            if (nonEmptyWaypoints && nonEmptyWaypoints.length > 1) {
                $scope.gpxUrl = "https://api-osrm-routed-production.tilestream.net/viaroute?output=gpx&geometry=false&alt=false&instructions=false";
                nonEmptyWaypoints.forEach(function (waypoint) {
                    if (waypoint.latLng) {
                        $scope.gpxUrl += "&loc=" + waypoint.latLng.lat + "," + waypoint.latLng.lng;
                    }
                });
                $scope.$apply();
            }
        });

        $scope.clearRoute = function () {
            routingControl.spliceWaypoints(0, routingControl.getWaypoints().length);
            $scope.gpxUrl = null;
        };


        function createButton(label, container) {
            var btn = L.DomUtil.create('button', '', container);
            btn.setAttribute('type', 'button');
            btn.innerHTML = label;
            return btn;
        }

        $scope.map.on('click', function (e) {
            /*var container = L.DomUtil.create('div'),
             startBtn = createButton('Start from this location', container),
             destBtn = createButton('Go to this location', container);

             L.DomEvent.on(startBtn, 'click', function () {
             routingControl.spliceWaypoints(0, 1, e.latlng);
             $scope.map.closePopup();
             });

             L.DomEvent.on(destBtn, 'click', function () {
             routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, e.latlng);
             $scope.map.closePopup();
             });

             L.popup()
             .setContent(container)
             .setLatLng(e.latlng)
             .openOn($scope.map);*/
            if (!routingControl.getWaypoints()[0].latLng) {
                routingControl.spliceWaypoints(0, 1, e.latlng);
            } else if (routingControl.getWaypoints().length == 2 && !routingControl.getWaypoints()[1].latLng) {
                routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, e.latlng);
            } else {
                var lastWaypoint = routingControl.getWaypoints()[routingControl.getWaypoints().length - 1].latLng;
                routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, lastWaypoint, e.latlng);
            }

        });


        var onAjaxError = function (data) {
            console.log(data);
            $scope.stravaError = data;
            $scope.downloadInProgress = false;
        };

// get athlete profile at the beginning
        $http.get('rest/profile').success(function (data) {
            $scope.athleteProfile = data;
        }).error(onAjaxError);


// object to store some statistics
        function Totals(id, title) {
            this.id = id;
            this.title = title;
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

            $scope.downloadInProgress = true;

            $scope.withGear = withGear;

            $scope.stravaError = null;

            $scope.currentActivity = null;

            $scope.activities = null;

            $scope.totals = [];

            $scope.globalTotals = new Totals("total", "Total");
            $scope.totals.push($scope.globalTotals);

            $scope.trainerTotals = new Totals("trainer", "Trainer");
            $scope.totals.push($scope.trainerTotals);

            $scope.manualTotals = new Totals("manual", "Manual");
            $scope.totals.push($scope.manualTotals);

            $scope.commuteTotals = new Totals("commute", "Commute");
            $scope.totals.push($scope.commuteTotals);

            $scope.noCommuteTotals = new Totals("noCommute", "No commute");
            $scope.totals.push($scope.noCommuteTotals);

            $scope.bikeDistanceTotals0_50 = new Totals("bike0_50", "Bike 0-50km");
            $scope.totals.push($scope.bikeDistanceTotals0_50);

            $scope.bikeDistanceTotals50_100 = new Totals("bike50_100", "Bike 50-100km");
            $scope.totals.push($scope.bikeDistanceTotals50_100);

            $scope.bikeDistanceTotals100_150 = new Totals("bike100_150", "Bike 100-150km");
            $scope.totals.push($scope.bikeDistanceTotals100_150);

            $scope.bikeDistanceTotals150_200 = new Totals("bike150_200", "Bike 150-200km");
            $scope.totals.push($scope.bikeDistanceTotals150_200);

            $scope.bikeDistanceTotals200 = new Totals("bike200", "Bike more than 200km");
            $scope.totals.push($scope.bikeDistanceTotals200);

            $scope.runDistanceTotals0_10 = new Totals("run0_10", "Run 0-10km");
            $scope.totals.push($scope.runDistanceTotals0_10);

            $scope.runDistanceTotals10_20 = new Totals("run10_20", "Run 10-20km");
            $scope.totals.push($scope.runDistanceTotals10_20);

            $scope.runDistanceTotals20_30 = new Totals("run20_30", "Run 20-30km");
            $scope.totals.push($scope.runDistanceTotals20_30);

            $scope.runDistanceTotals30_40 = new Totals("run30_40", "Run 30-40km");
            $scope.totals.push($scope.runDistanceTotals30_40);

            $scope.runDistanceTotals40 = new Totals("run40", "Run more than 40km");
            $scope.totals.push($scope.runDistanceTotals40);

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


                /*osmPath.addEventListener('mousedown',
                 function (event) {
                 $scope.popup.setContent(compileInfoWindow());
                 });*/

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

                if (activity.type == "Ride") {
                    if (activity.distance / 1000 <= 50) {
                        $scope.bikeDistanceTotals0_50.add(activity);
                    }

                    if (activity.distance / 1000 > 50 && activity.distance / 1000 <= 100) {
                        $scope.bikeDistanceTotals50_100.add(activity);
                    }

                    if (activity.distance / 1000 > 100 && activity.distance / 1000 <= 150) {
                        $scope.bikeDistanceTotals100_150.add(activity);
                    }

                    if (activity.distance / 1000 > 150 && activity.distance / 1000 <= 200) {
                        $scope.bikeDistanceTotals150_200.add(activity);
                    }

                    if (activity.distance / 1000 > 200) {
                        $scope.bikeDistanceTotals200.add(activity);
                    }
                }
                if (activity.type == "Run") {
                    if (activity.distance / 1000 <= 10) {
                        $scope.runDistanceTotals0_10.add(activity);
                    }

                    if (activity.distance / 1000 > 10 && activity.distance / 1000 <= 20) {
                        $scope.runDistanceTotals10_20.add(activity);
                    }

                    if (activity.distance / 1000 > 20 && activity.distance / 1000 <= 30) {
                        $scope.runDistanceTotals20_30.add(activity);
                    }

                    if (activity.distance / 1000 > 30 && activity.distance / 1000 <= 40) {
                        $scope.runDistanceTotals30_40.add(activity);
                    }

                    if (activity.distance / 1000 > 40) {
                        $scope.runDistanceTotals40.add(activity);
                    }
                }

                if ($scope.withGear && activity.gear_id) {
                    var gearName = findGearName(activity.gear_id);
                    if (!$scope.gearTotals[activity.gear_id]) {
                        $scope.gearTotals[activity.gear_id] = new Totals(activity.gear_id, gearName);
                    }
                    $scope.gearTotals[activity.gear_id].add(activity);
                }

                if (activity.location_country) {
                    if (!$scope.countryTotals[activity.location_country]) {
                        $scope.countryTotals[activity.location_country] = new Totals(activity.location_country, activity.location_country);
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
                        country.states[activity.location_state] = new Totals(activity.location_state, activity.location_state);
                    }
                    country.states[activity.location_state].add(activity);


                    var state = country.states[activity.location_state];

                    if (!state.cities) {
                        state.cities = new Object();
                    }

                    if (activity.location_city) {
                        if (!state.cities[activity.location_city]) {
                            state.cities[activity.location_city] = new Totals(activity.location_city, activity.location_city);
                        }
                        state.cities[activity.location_city].add(activity);
                    }
                }
            });

        }

        $scope.drawActivityOnMap = function (activity) {
            $scope.drawActivitiesOnMap([activity]);
        };

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
            $scope.downloadInProgress = false;
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
                        $scope.downloadInProgress = true;
                        $http.get('rest/photos/' + activity.id).success(function (photos) {
                            $scope.downloadInProgress = false;
                            $scope.photos = $scope.photos.concat(photos);
                            drawPhotos(photos);
                        }).error(onAjaxError);

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
            $http.get('rest/friends-activities').success(onSuccessActivities).error(onAjaxError);

        };

        $scope.fetchClubActivities = function (clubId) {
            initScopeProperties(false);
            $http.get('rest/club-activities/' + clubId).success(onSuccessActivities).error(onAjaxError);
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
