<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html ng-app="stravaApp">
<head>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>
    <script src="app/js/app.js"></script>
    <script src="app/js/controllers.js"></script>
    
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
            height: 70%;
            width: 70%
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

<div ng-view=""></div>

<div id="map-canvas"></div>


</html>