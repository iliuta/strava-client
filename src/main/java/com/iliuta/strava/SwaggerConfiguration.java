package com.iliuta.strava;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static springfox.documentation.spi.DocumentationType.SWAGGER_2;

@Configuration
@EnableSwagger2
@Profile("dev")
public class SwaggerConfiguration {
    @Bean
    public Docket restApi() {
        return new Docket(SWAGGER_2)
                .groupName("strava-client")
                .select()
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                .build();
    }
}
