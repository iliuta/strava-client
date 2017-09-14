package com.iliuta.strava;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("strava.api")
public class StravaApiConfiguration {

    private String baseUrl;
    private String athleteProfileUrl;
    private String activitiesUrl;
    private String updateActivityUrl;
    private String friendsActivitiesUrl;
    private String clubActivitiesUrl;
    private String activityPhotosUrl;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getAthleteProfileUrl() {
        return athleteProfileUrl;
    }

    public void setAthleteProfileUrl(String athleteProfileUrl) {
        this.athleteProfileUrl = athleteProfileUrl;
    }

    public String getActivitiesUrl() {
        return activitiesUrl;
    }

    public void setActivitiesUrl(String activitiesUrl) {
        this.activitiesUrl = activitiesUrl;
    }

    public String getUpdateActivityUrl() {
        return updateActivityUrl;
    }

    public void setUpdateActivityUrl(String updateActivityUrl) {
        this.updateActivityUrl = updateActivityUrl;
    }

    public String getFriendsActivitiesUrl() {
        return friendsActivitiesUrl;
    }

    public void setFriendsActivitiesUrl(String friendsActivitiesUrl) {
        this.friendsActivitiesUrl = friendsActivitiesUrl;
    }

    public String getClubActivitiesUrl() {
        return clubActivitiesUrl;
    }

    public void setClubActivitiesUrl(String clubActivitiesUrl) {
        this.clubActivitiesUrl = clubActivitiesUrl;
    }

    public String getActivityPhotosUrl() {
        return activityPhotosUrl;
    }

    public void setActivityPhotosUrl(String activityPhotosUrl) {
        this.activityPhotosUrl = activityPhotosUrl;
    }


}
