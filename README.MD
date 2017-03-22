# Prerequisites
Java 8 & Maven

Create a Strava API credentials of your own at https://www.strava.com/settings/api

# Build
```
mvn clean package
```

# Launch
```
java -DSTRAVA_CLIENT_ID=<your_client_id> -DSTRAVA_CLIENT_SECRET=<your_strava_client_secret> -jar target/strava-client.war
```