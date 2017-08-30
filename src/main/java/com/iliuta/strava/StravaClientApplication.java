package com.iliuta.strava;

import com.iliuta.strava.mvc.StravaRestController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static springfox.documentation.spi.DocumentationType.SWAGGER_2;

@SpringBootApplication
@Configuration
// exclude spring security, we only need oauth2 client
@EnableAutoConfiguration(exclude = {org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration.class})
@EnableOAuth2Client
@EnableSwagger2
public class StravaClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(StravaClientApplication.class, args);
    }

    /**
     * Create oauth rest template (spring boot magic with configuration from application.properties)
     *
     * @param oauth2ClientContext
     * @param details
     * @return
     */
    @Bean
    public OAuth2RestTemplate stravaRestTemplate(OAuth2ClientContext oauth2ClientContext, OAuth2ProtectedResourceDetails details) {
        OAuth2RestTemplate result = new OAuth2RestTemplate(details, oauth2ClientContext);
        return result;
    }


    @Bean
    public Docket restApi() {
        return new Docket(SWAGGER_2)
                .groupName("strava-client")
                .select()
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                .build();
    }

}
