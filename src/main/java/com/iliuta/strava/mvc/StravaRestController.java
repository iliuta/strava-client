package com.iliuta.strava.mvc;

import com.iliuta.strava.model.Activity;
import com.iliuta.strava.model.ActivityList;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by apapusoi on 17/04/15.
 */
@RestController
@RequestMapping("/rest")
public class StravaRestController {
    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping("/activities")
    public List<Activity> activities(Long before, Long after) {
        ActivityList activityList = fetch200ActivitiesFromStrava(before, after);
        // sort by date
        List<Activity> activities = activityList.stream().sorted((a1, a2) -> {
            return a1.getStartDate().compareTo(a2.getStartDate());
        }).map(a -> {
            return (Activity) a;
        }).collect(Collectors.toList());

        // fetch the next 200 activities
        while (activityList.size() == 200) {
            activityList = fetch200ActivitiesFromStrava(null, (activities.get(activities.size() - 1).getStartDate().getTime() + 1000) / 1000);
            // sort by date
            List<Activity> sortedActivities = activityList.stream().sorted((a1, a2) -> {
                return a1.getStartDate().compareTo(a2.getStartDate());
            }).map(a -> {
                return (Activity) a;
            }).collect(Collectors.toList());
            // add to sorted activities
            activities.addAll(sortedActivities);
        }

        // return them
        return activities;
    }

    private ActivityList fetch200ActivitiesFromStrava(Long before, Long after) {
        String url = "https://www.strava.com/api/v3/activities?per_page=200";
        if (before != null) {
            url = url + "&before=" + before;
        }
        if (after != null) {
            url = url + "&after=" + after;
        }
        return stravaRestTemplate
                .getForObject(url, ActivityList.class);
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }
}
