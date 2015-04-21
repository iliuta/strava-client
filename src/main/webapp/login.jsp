<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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

<div class="container-fluid">


    <div class="jumbotron">
        <h1>Strava personal heatmap</h1>

        <p>Display your personal heatmap from Strava.</p>

        <p>

        <form id="loginForm" class="form-inline" action="<c:url value="/login.do"/>" method="post">
            <input type="submit" class="btn btn-primary btn-lg" value="Connect with Strava"/>
        </form>
        </p>

        <p>This application uses Strava and Google Maps free APIs. These APIs are subject to bandwidth usage limits.</p>

        <p>From time to time, some bandwidth related error messages could be displayed.</p>

        <p>Suggestions and remarks are <a href="http://twitter.com/iliuta">welcomed</a> or you can connect with <a
                href="http://strava.com/athletes/iliuta">me</a> on Strava.</p>

        <p>Enjoy!</p>

        

    </div>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-62082824-1', 'auto');
        ga('send', 'pageview');

    </script>

</body>
</html>
