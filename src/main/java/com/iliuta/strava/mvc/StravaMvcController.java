package com.iliuta.strava.mvc;

import com.iliuta.strava.model.AthleteProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;

/**
 * Created by apapusoi on 17/12/14.
 */
@Controller
public class StravaMvcController {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(StravaMvcController.class);
    

    @Resource(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @RequestMapping("/profile")
    public String userProfile(Model model) {
        AthleteProfile athleteProfile = stravaRestTemplate
                .getForObject("https://www.strava.com/api/v3/athlete", AthleteProfile.class);
        model.addAttribute("profile", athleteProfile);
        LOGGER.info("AthleteProfile retrieved: id={}", athleteProfile.getId());
        return "strava";
    }

    public void setStravaRestTemplate(OAuth2RestTemplate stravaRestTemplate) {
        this.stravaRestTemplate = stravaRestTemplate;
    }

    @ExceptionHandler(InvalidRequestException.class)
    protected String handleInvalidRequestException(InvalidRequestException ire) {
        LOGGER.error("OAuth2 invalid request. Redirect to this page without parameters. Message: {}", ire.getMessage());
        return "redirect:/profile";
    }

}
