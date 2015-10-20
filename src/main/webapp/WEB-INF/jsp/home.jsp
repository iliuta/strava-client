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

        <div class="row">

            <div class="col-lg-12">
                <h1>Strava personal heatmap</h1>
                
                <img src="app/img/screenshot.png" alt="screenshot" style="float:left" class="img-responsive">


                <script>
                    function setCookie() {
                        var d = new Date();
                        d.setTime(d.getTime() + (1000*24*60*60*1000));
                        var expires = "expires="+d.toUTCString();
                        document.cookie = "dontShowThisAgain=true; " + expires;
                    }
                    
                </script>
                <a href="<c:url value="/profile"/>"><img src="app/img/ConnectWithStrava.png"></a>
                <input type="checkbox" onclick="setCookie()"> Don't show this again.

                <p>
                    This application uses Strava and Google Maps free APIs. No data is stored locally on the server.
                    I haven't tested this with Internet Explorer. It seem to work properly with Chrome, Firefox and
                    Safari.
                    Suggestions and remarks are <a href="http://twitter.com/iliuta">welcome</a> or you can connect with
                    <a href="http://strava.com/athletes/iliuta">me</a> on Strava.
                    Enjoy!
                </p>

            </div>


        </div>

        <div class="row well">
            <div class="col-lg-12">
                <h4>What's new</h4>
                <ul>
                    <li>Statistics by distance: bike and run</li>
                    <li>Now you can click on an activity on the list</li>
                    <li>Added photos display button</li>
                    <li>Added clubs activities display</li>
                    <li>Show each activity details into the table down the page.</li>
                    <li>Better gear and location grouping.</li>
                    <li>Activity details now displayed directly on the map</li>
                    <li>Better displayed totals statistics</li>
                    <li>Statistics by gear</li>
                    <li>Improved mobile responsiveness</li>
                </ul>
            </div>
        </div>


    </div>
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
