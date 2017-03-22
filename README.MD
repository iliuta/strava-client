# Overview

This application demonstrates how to use Strava API with Spring boot, pring security OAuth2 & Thymeleaf.

Features:
* display your activities on a map, given a filter by date and activity type
* display 200 activities of your contacts and the groups you belong to
* display pictures on the activities map
* provide extended statistics of your activities
* ability to update some basic activity attributes, such: title, type, private, trainer, commute and gear
* ability to draw and export gpx routes/tracks


Some front frameworks used:
* [Leaflet JS](http://leafletjs.com/)
* [Leaflet control geocoder](https://github.com/perliedman/leaflet-control-geocoder)
* [Leaflet routing machine](http://www.liedman.net/leaflet-routing-machine/)
* Twitter bootstrap
* Angular 1



# Prerequisites
Java 8 & Maven

Create Strava API credentials of your own at https://www.strava.com/settings/api

# Build
```
mvn clean package
```

# Launch
```
java -DSTRAVA_CLIENT_ID=<your_client_id> -DSTRAVA_CLIENT_SECRET=<your_strava_client_secret> -jar target/strava-client.war
```