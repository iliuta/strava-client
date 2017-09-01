package com.iliuta.strava.mvc;

import com.iliuta.strava.model.Activity;
import com.iliuta.strava.model.ActivityList;
import org.assertj.core.api.Assertions;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestOperations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class StravaRestControllerTest {

    @Autowired
    private TestRestTemplate template = new TestRestTemplate();

    @MockBean(name = "stravaRestTemplate")
    private RestOperations stravaRestTemplate;

    @Test
    public void retrieveOneActivity() {
        ActivityList activities = new ActivityList(Arrays.asList(new Activity()));
        Mockito.when(stravaRestTemplate.getForObject(
                Mockito.anyString(),
                Mockito.eq(ActivityList.class))).thenReturn(activities);
        ResponseEntity<String> result = template.getForEntity("/rest/activities", String.class);
        Mockito.verify(stravaRestTemplate)
                .getForObject("https://www.strava.com/api/v3/activities?per_page=200&page=1", ActivityList.class);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void retrieve201Activities() {
        ActivityList _200activities = new ActivityList();
        for (int i = 1; i <= 200; i++) {
            _200activities.add(new Activity());
        }
        ActivityList _1activities = new ActivityList(Arrays.asList(new Activity()));

        // strava activities end point should be called twice
        Mockito.when(stravaRestTemplate.getForObject(
                "https://www.strava.com/api/v3/activities?per_page=200&page=1",
                ActivityList.class)).thenReturn(_200activities);
        Mockito.when(stravaRestTemplate.getForObject(
                "https://www.strava.com/api/v3/activities?per_page=200&page=2",
                ActivityList.class)).thenReturn(_1activities);

        ResponseEntity<String> result = template.getForEntity("/rest/activities", String.class);

        // verify that strava is called twice with good parameters
        Mockito.verify(stravaRestTemplate)
                .getForObject("https://www.strava.com/api/v3/activities?per_page=200&page=1", ActivityList.class);
        Mockito.verify(stravaRestTemplate)
                .getForObject("https://www.strava.com/api/v3/activities?per_page=200&page=2", ActivityList.class);

        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
