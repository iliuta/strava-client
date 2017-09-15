import angular from 'angular';
import StravaMap from './map.js';

import infoWindowTemplateUrl from '../templates/infowindow.html';
// end hack

var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$compile', '$scope', '$http', '$filter', '$locale',
    function ($compile, $scope, $http, $filter, $locale) {

        $scope.dateFormat = $locale.DATETIME_FORMATS.shortDate;

        let gpxTrck = [];
        let gpxRoute = [];

        let stravaMap = new StravaMap(function() {
            let template = '<div ng-include src="\'' + infoWindowTemplateUrl + '\'"></div>';
            let compiled = $compile(template)($scope);
            $scope.$apply();
            return compiled[0].parentNode;
        });

        stravaMap.on('selectActivity',
            function(activity) {
                $scope.currentActivity = activity;
                $scope.$apply();
            }
         ).on('photoClick',
           function(photoUrl, photo) {
               $scope.currentPhotoUrl = photoUrl;
               $scope.currentPhoto = photo;
               $scope.$apply();
               $('#photoModal').modal('show');
           }
        ).on('routeFound',
            function(track, route) {
                gpxTrck = track;
                gpxRoute = route;
                $scope.routeFound = true;
                $scope.$apply();
            }
        );

        function setMapSize() {
            $("#map-canvas").height($(window).height()*0.7);
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

            this.remove = function (activity) {
                var index = this.activities.indexOf(activity);
                if (index > -1) {
                    this.activities.splice(index, 1);
                }
                this.distance -= activity.distance;
                this.movingTime -= activity.moving_time;
                this.elapsedTime -= activity.elapsed_time;
                this.elevationGain -= activity.total_elevation_gain;
                this.nb--;
            }
        }

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

            initScopeTotals();

        }

        function initScopeTotals() {
            // array of statistics
            $scope.totals = [];

            // all totals
            $scope.globalTotals = new Totals("total", "Total");
            $scope.totals.push($scope.globalTotals);

            // totals for trainer activities
            $scope.trainerTotals = new Totals("trainer", "Trainer");
            $scope.totals.push($scope.trainerTotals);

            // totals for manual activities
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

            // totals grouped by gear (slightly more complex object using Totals)
            $scope.gearTotals = new Object();

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
            });

        }

        $scope.drawActivityOnMap = function (activity) {
            $scope.drawActivitiesOnMap([activity]);
        };

        $scope.drawActivitiesOnMap = function (activities) {
            $('html,body').animate({scrollTop: $('#mapTop').offset().top});

            stravaMap.drawActivities(activities);
        };


        var onSuccessActivities = function (activities) {
            $scope.activities = activities;
            $scope.photos = null;

            computeAllTotals(activities);
            $scope.drawActivitiesOnMap(activities);
            $scope.downloadInProgress = false;
            if (!activities || activities.length == 0) {
                $scope.stravaError = {code: "0", message: "No activities found. Please change your criteria and try again."};
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
                // check if trainer attribute has been modified and update trainer totals
                if (activity.trainer != $scope.currentActivity.trainer) {
                    if (activity.trainer) {
                        $scope.trainerTotals.add($scope.currentActivity);
                    } else {
                        $scope.trainerTotals.remove($scope.currentActivity);
                    }
                }
                // check if commute attribute has been modified and update commute and noCommute totals
                if (activity.commute != $scope.currentActivity.commute) {
                    if (activity.commute) {
                        $scope.commuteTotals.add($scope.currentActivity);
                        $scope.noCommuteTotals.remove($scope.currentActivity);
                    } else {
                        $scope.commuteTotals.remove($scope.currentActivity);
                        $scope.noCommuteTotals.add($scope.currentActivity);
                    }
                }
                // check if gear has been modified and update the corresponding gear totals
                if (activity.gear_id != $scope.currentActivity.gear_id) {
                    $scope.gearTotals[$scope.currentActivity.gear_id].remove(activity);
                    if (!$scope.gearTotals[activity.gear_id]) {
                        $scope.gearTotals[activity.gear_id] = new Totals(activity.gear_id, findGearName(activity.gear_id));
                    }
                    $scope.gearTotals[activity.gear_id].add(activity);
                }

                // copy the edited attributes into the original object
                $scope.currentActivity.commute = activity.commute;
                $scope.currentActivity.private = activity.private;
                $scope.currentActivity.trainer = activity.trainer;
                $scope.currentActivity.gear_id = activity.gear_id;
                $scope.currentActivity.name = activity.name;

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
    }])
;

export { stravaControllers };