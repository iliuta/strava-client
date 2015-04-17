var stravaControllers = angular.module('stravaControllers', []);

stravaControllers.controller('ActivitiesCtrl', ['$scope', '$http',
    function ($scope, $http) {

        var mapOptions = {
            center: { lat: 48.880821, lng: 2.242003 },
            zoom: 8
        };

        
        
        
        $scope.fetchActivities = function (before, after) {
            
            if (before) {
                before = Math.floor(new Date(before).getTime() / 1000);
            }
            if (after) {
                after = Math.floor(new Date(after).getTime() / 1000);
            }
            $http.get('rest/activities?before=' + (before ? before : '') + '&after=' + (after ? after : '')).success(function (data) {
                var bounds = new google.maps.LatLngBounds();

                var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);
                
                $scope.activities = data;

                $scope.activities.forEach(function (activity) {
                    if (activity.type == 'Ride') {
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
                            });

                        google.maps.event.addListener(activityGmapsPath, 'mouseout',
                            function () {
                                activityGmapsPath.setOptions({strokeColor: 'red', strokeWeight: 2});
                            });

                        activityGmapsPath.setMap(map);
                    }
                });

                map.fitBounds(bounds);
                map.panToBounds(bounds);
                
            });
        }
    }]);