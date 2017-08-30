package com.iliuta.strava.mvc;

import com.iliuta.strava.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.UserRedirectRequiredException;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by apapusoi on 17/04/15.
 */
@RestController
@RequestMapping("/rest")
@SessionAttributes("athleteProfile")
public class StravaRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(StravaRestController.class);
    private static final int PAGE_SIZE = 200;

    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping(value = "/activities", method = RequestMethod.GET)
    public List<Activity> activities(Long before, Long after, String type) {
        int page = 1;

        LOGGER.debug("Fetch my activities before={} after={} type={}", before, after, type);

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


    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public AthleteProfile profile(@ModelAttribute("athleteProfile") AthleteProfile athleteProfile) throws StravaClientException {
        if (athleteProfile == null) {
            throw new StravaClientException("No athlete profile.");
        }
        return athleteProfile;
    }

    @RequestMapping(value = "/update-activity", method = RequestMethod.POST)
    public String updateActivity(@RequestBody Activity activity) throws StravaClientException {
        String url = "https://www.strava.com/api/v3/activities/{id}?type={type}&private={isprivate}&commute={commute}&trainer={trainer}&name={name}&gear_id={gearId}";
        stravaRestTemplate.put(url, null, activity.getId(), activity.getType(), activity.getIsprivate(), activity.getCommute(), activity.getTrainer(), activity.getName(), activity.getGearId());
        return "";
    }

    @RequestMapping(value = "/friends-activities", method = RequestMethod.GET)
    public List<Activity> friendsActivities(Long before, String type) {
        LOGGER.debug("Fetch friends' activities before={} type={}", before, type);
        String url = "https://www.strava.com/api/v3/activities/following?per_page=100";
        if (before != null) {
            url = url + "&before=" + before;
        }

        ActivityList result = stravaRestTemplate.getForObject(url, ActivityList.class);
        if (StringUtils.hasText(type)) {
            return result.stream().filter(a -> type.equals(a.getType())).collect(Collectors.toList());
        } else {
            return result;
        }
    }

    @RequestMapping(value = "/club-activities/{clubId}", method = RequestMethod.GET)
    public List<Activity> clubActivities(Long before, String type, @PathVariable String clubId) {
        LOGGER.debug("Fetch club {} activities before={} type={}", clubId, before, type);
        String url = "https://www.strava.com/api/v3/clubs/" + clubId + "/activities?per_page=100";
        if (before != null) {
            url = url + "&before=" + before;
        }

        ActivityList result = stravaRestTemplate.getForObject(url, ActivityList.class);
        if (StringUtils.hasText(type)) {
            return result.stream().filter(a -> type.equals(a.getType())).collect(Collectors.toList());
        } else {
            return result;
        }
    }

    @RequestMapping(value = "/photos/{activityId}", method = RequestMethod.GET)
    public List<Photo> activityPhotos(@PathVariable String activityId) {
        LOGGER.debug("Fetch photos for activity {}", activityId);
        String url = "https://www.strava.com/api/v3/activities/" + activityId + "/photos?photo_sources=true&size=300";

        PhotoList result = stravaRestTemplate.getForObject(url, PhotoList.class);
        return result;
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

    @ExceptionHandler(UserRedirectRequiredException.class)
    @ResponseStatus(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED)
    protected StravaError handleUserRedirectRequiredException(UserRedirectRequiredException rce) {
        LOGGER.error("Strava error", rce);
        StravaError error = new StravaError();
        error.setMessage("Your session has expired.");
        error.setDetailedMessage(rce.getMessage());
        error.setCode(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED.value());
        return error;

    }

    @ExceptionHandler(OAuth2Exception.class)
    @ResponseStatus(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED)
    protected StravaError handleOauth2Exception(OAuth2Exception oae, HttpSession session) {
        LOGGER.error("Strava error {}", oae.getSummary());
        StravaError error = new StravaError();
        error.setMessage("Strava authentication error.");
        error.setDetailedMessage(oae.getMessage());
        error.setCode(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED.value());
        session.invalidate();
        return error;

    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected StravaError handleOtherException(Exception rce) {
        LOGGER.error("Strava error", rce);
        StravaError error = new StravaError();
        error.setMessage("An error occured while acessing Strava.");
        error.setDetailedMessage(rce.getMessage());
        return error;
    }
}
