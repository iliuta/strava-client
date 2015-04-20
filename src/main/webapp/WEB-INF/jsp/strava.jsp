<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html ng-app="stravaApp">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">


    <title>Strava personal heatmap (beta)</title>

    <style type="text/css">
        html {
            height: 100%
        }

        #map-canvas {
            width: 100%;
            height: 500px;
        }

        body {
            padding-top: 50px;
        }

    </style>
    <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyAyxz5c3X3Dw9a1gYTtRyYhiT0ixJpcNqU">
    </script>

</head>
<body>

<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Strava personal heatmap (beta)</a>
        </div>
    </div>
</nav>


<div class="container-fluid">

    <div class="row">
        <div class="col-md-2">
            <h1>${profile.firstName}</h1>

            <c:forEach var="bike" items="${profile.bikes}">
                <p class="bg-info">${bike.name}: ${bike.distance/1000}km </p>
            </c:forEach>


        </div>
        <div class="col-md-10">
            <div ng-view=""></div>
        </div>
    </div>

</div>


<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-route/angular-route.min.js"></script>
<script src="app/js/app.js"></script>
<script src="app/js/controllers.js"></script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-62082824-1', 'auto');
  ga('send', 'pageview');

</script>

</body>
</html>
