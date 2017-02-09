package com.iliuta.strava.mvc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by apapusoi on 17/12/14.
 */
@Controller
public class HomeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HomeController.class);


    @RequestMapping("/")
    public String showHome(@CookieValue(required = false) String dontShowThisAgain) {
        if (!StringUtils.isEmpty(dontShowThisAgain)) {
            return "redirect:/profile";
        } else {
            return "home";
        }

    }

}
