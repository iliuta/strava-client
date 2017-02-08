package com.iliuta.strava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;

@SpringBootApplication
@Configuration
@EnableAutoConfiguration(exclude = {
        org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration.class})
@ImportResource("classpath:application-context.xml")
public class StravaClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(StravaClientApplication.class, args);
    }


    @Bean
    public FilterRegistrationBean oAuth2ClientContextFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new OAuth2ClientContextFilter());
        registration.setName("oAuth2ClientContextFilter");
        registration.setOrder(1);
        return registration;
    }
}
