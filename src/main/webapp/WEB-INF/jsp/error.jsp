<%@ page isErrorPage="true" contentType="text/html"%>
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

        <p>An error occured</p>
<%
if (exception !=null) {
if (exception.getCause() !=null && exception.getCause() instanceof org.springframework.security.oauth2.common.exceptions.UserDeniedAuthorizationException) {
%>
	User has denied the autorization.
<%
} else {
%>
        <%=exception.getMessage()%>
<%
}
}
%>
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
