package com.iliuta.strava.mvc;

import com.iliuta.strava.model.AthleteProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestOperations;

import javax.annotation.Resource;

/**
 * Created by apapusoi on 17/12/14.
 */
@Controller
public class HomeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HomeController.class);


    @RequestMapping("/home")
    public String showHome(@CookieValue(required = false) String dontShowThisAgain) {
        if (!StringUtils.isEmpty(dontShowThisAgain)) {
            return "redirect:/profile";
        } else {
            return "home";
        }
        
    }

}
