package com.iliuta.strava.mvc;

import com.iliuta.strava.model.ActivityList;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
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

    @RequestMapping("/activities")
    public ActivityList activities(Long before, Long after) {
        String url = "https://www.strava.com/api/v3/activities?per_page=200";
        if (before != null) {
            url = url + "&before=" + before;
        }
        if (after != null) {
            url = url + "&after=" + after;
        }
        ActivityList activityList = stravaRestTemplate
                .getForObject(url, ActivityList.class);
        return activityList;
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }
}
