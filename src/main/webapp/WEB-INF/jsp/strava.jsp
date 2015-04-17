<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Strava personal heatmap</title>

    <style type="text/css">
        html {
            height: 100%
        }

        body {
            height: 100%;
            margin: 0;
            padding: 0
        }

        #map-canvas {
            height: 100%
        }
    </style>
    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyAyxz5c3X3Dw9a1gYTtRyYhiT0ixJpcNqU">
    </script>

</head>
<body>
<div id="container">

    <div id="content">
        <h1>Profile</h1>
        <ul>
            ${profile.firstName}
        </ul>
        <ul>
            <c:forEach var="bike" items="${profile.bikes}">
                ${bike.name}, ${bike.distance/1000}km <br/>
            </c:forEach>
        </ul>
    </div>


</div>

<div id="map-canvas"></div>

<script type="text/javascript">
    function draw(activities) {
        var mapOptions = {
            center: { lat: 48.880821, lng: 2.242003 },
            zoom: 8
        };

        var bounds = new google.maps.LatLngBounds();

        var map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

        activities.forEach(function (activity) {
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
    }

</script>
<script type="application/javascript"
        src="https://www.strava.com/api/v3/athlete/activities?access_token=ce6bb7fd5b36aba5fd42b7464ef9d14b95e05636&callback=draw&after=1420070400&per_page=200"></script>
</body>
</html>