package com.iliuta.strava.mvc;

import com.iliuta.strava.model.ActivityList;
import com.iliuta.strava.model.AthleteProfile;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;

/**
 * Created by apapusoi on 17/04/15.
 */
@RestController
@RequestMapping("/rest")
public class StravaRestController {
    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping("/profile")
    public AthleteProfile userProfile(Model model) {
        AthleteProfile athleteProfile = stravaRestTemplate
                .getForObject("https://www.strava.com/api/v3/athlete", AthleteProfile.class);
        return athleteProfile;
    }

    @RequestMapping("/activities")
    public ActivityList activities(Model model) {
        ActivityList activityList = stravaRestTemplate
                .getForObject("https://www.strava.com/api/v3/activities", ActivityList.class);
        return activityList;
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }
}
