<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <title>Strava personal heatmap (beta)</title>
    <style>
        body {
            padding-top: 50px;
        }

    </style>
</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Strava heatmap</a>
        </div>
    </div>
</nav>


<div class="container-fluid">

    <div class="row">
        <div class="col-md-2">

        </div>
        <div class="col-md-10">
            <form id="loginForm" class="form-inline" action="<c:url value="/login.do"/>" method="post">
               <input type="submit" class="btn btn-default" value="Connect with Strava"/>
            </form>
        </div>
    </div>

</div>

<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>
