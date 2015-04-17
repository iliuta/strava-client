package com.iliuta.strava.mvc;

import com.iliuta.strava.model.AthleteProfile;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.UserRedirectRequiredException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;

/**
 * Created by apapusoi on 17/12/14.
 */
@Controller
public class StravaMvcController {

    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping("/profile")
    public String userProfile(Model model) {
        AthleteProfile athleteProfile = stravaRestTemplate
                .getForObject("https://www.strava.com/api/v3/athlete", AthleteProfile.class);
        model.addAttribute("profile", athleteProfile);
        return "strava";
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }



}
