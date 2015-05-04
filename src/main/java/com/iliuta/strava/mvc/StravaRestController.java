package com.iliuta.strava.mvc;

import com.iliuta.strava.model.Activity;
import com.iliuta.strava.model.ActivityList;
import com.iliuta.strava.model.StravaError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by apapusoi on 17/04/15.
 */
@RestController
@RequestMapping("/rest")
public class StravaRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(StravaRestController.class);
    private static final int PAGE_SIZE = 200;

    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping("/activities")
    public List<Activity> activities(Long before, Long after, String type) {
        int page = 1;

        List<Activity> result = new ArrayList<>();
        ActivityList activityList = fetch200ActivitiesFromStrava(before, after, page);
        result.addAll(activityList);

        while (activityList.size() == PAGE_SIZE) {
            page++;
            activityList = fetch200ActivitiesFromStrava(before, after, page);
            result.addAll(activityList);
        }

        // filter if needed and return
        if (StringUtils.hasText(type)) {
            return result.stream().filter(a -> type.equals(a.getType())).collect(Collectors.toList());
        } else {
            return result;
        }
    }

    @RequestMapping("/friends-activities")
    public List<Activity> friendsActivities(Long before) {
        String url = "https://www.strava.com/api/v3/activities/following";
        if (before != null) {
            url = url + "&before=" + before;
        }

        return stravaRestTemplate.getForObject(url, ActivityList.class);
    }

    private ActivityList fetch200ActivitiesFromStrava(Long before, Long after, int page) {
        String url = "https://www.strava.com/api/v3/activities?per_page=" + PAGE_SIZE + "&page=" + page;
        if (before != null) {
            url = url + "&before=" + before;
        }
        if (after != null) {
            url = url + "&after=" + after;
        }
        return stravaRestTemplate.getForObject(url, ActivityList.class);
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }


    @ExceptionHandler(RestClientException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected StravaError handleRestClientException(RestClientException rce) {
        LOGGER.error("Strava error", rce);
        StravaError error = new StravaError();
        error.setMessage("An error occured while acessing Strava.");
        error.setDetailedMessage(rce.getMessage());
        return error;

    }
}
