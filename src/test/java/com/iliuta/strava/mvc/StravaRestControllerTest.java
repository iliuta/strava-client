package com.iliuta.strava.mvc;

import com.iliuta.strava.StravaApiConfiguration;
import com.iliuta.strava.model.Activity;
import com.iliuta.strava.model.ActivityList;
import com.iliuta.strava.model.PhotoList;
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
import org.springframework.web.util.UriComponentsBuilder;

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

    @Autowired
    private StravaApiConfiguration stravaApiConfiguration;

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

        // strava activities end point should be called twice, to simulate pagination
        // first, return 200 activities
        String stravaUrlPage1 = UriComponentsBuilder.fromUriString(this.stravaApiConfiguration.getActivitiesUrl()).buildAndExpand(200, 1).toString();
        Mockito.when(stravaRestTemplate.getForObject(
                stravaUrlPage1,
                ActivityList.class)).thenReturn(_200activities);
        // second, return 1 activity
        String stravaUrlPage2 = UriComponentsBuilder.fromUriString(this.stravaApiConfiguration.getActivitiesUrl()).buildAndExpand(200, 2).toString();
        Mockito.when(stravaRestTemplate.getForObject(
                stravaUrlPage2,
                ActivityList.class)).thenReturn(_1activities);

        ResponseEntity<ActivityList> result = template.getForEntity("/rest/activities", ActivityList.class);

        // verify that strava is called twice with good parameters
        Mockito.verify(stravaRestTemplate)
                .getForObject(stravaUrlPage1, ActivityList.class);
        Mockito.verify(stravaRestTemplate)
                .getForObject(stravaUrlPage2, ActivityList.class);

        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(result.getBody().size()).isEqualTo(201);
    }

    @Test
    public void activityPhotos() {
        String activityId = "1";
        Mockito.when(stravaRestTemplate.getForObject(this.stravaApiConfiguration.getActivityPhotosUrl(), PhotoList.class, activityId)).thenReturn(new PhotoList());

        ResponseEntity<PhotoList> result = template.getForEntity("/rest/photos/" + activityId, PhotoList.class);

        Mockito.verify(stravaRestTemplate).getForObject(this.stravaApiConfiguration.getActivityPhotosUrl(), PhotoList.class, activityId);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void updateActivity() {
        Activity activity = new Activity();
        ResponseEntity<String> result = template.postForEntity("/rest/update-activity", activity, String.class);

        Mockito.verify(stravaRestTemplate).put(this.stravaApiConfiguration.getUpdateActivityUrl(), null, activity.getId(), activity.getType(), activity.getIsprivate(), activity.getCommute(), activity.getTrainer(), activity.getName(), activity.getGearId());
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void friendsActivities() {
        ActivityList activityList = new ActivityList();
        Activity ride = new Activity();
        ride.setType("ride");
        activityList.add(ride);

        Activity run = new Activity();
        run.setType("run");
        activityList.add(run);

        Mockito.when(stravaRestTemplate.getForObject(this.stravaApiConfiguration.getFriendsActivitiesUrl() + "&before=5", ActivityList.class)).thenReturn(activityList);
        ResponseEntity<ActivityList> result = template.getForEntity("/rest/friends-activities?type=ride&before=5", ActivityList.class);

        Mockito.verify(stravaRestTemplate).getForObject(this.stravaApiConfiguration.getFriendsActivitiesUrl() + "&before=5", ActivityList.class);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(result.getBody().size()).isEqualTo(1);
        Assertions.assertThat(result.getBody().get(0).getType()).isEqualTo("ride");
    }

    @Test
    public void clubActivities() {
        ActivityList activityList = new ActivityList();
        Activity ride = new Activity();
        ride.setType("ride");
        activityList.add(ride);

        Activity run = new Activity();
        run.setType("run");
        activityList.add(run);

        String clubId = "10";

        String stravaUrl = UriComponentsBuilder.fromUriString(this.stravaApiConfiguration.getClubActivitiesUrl()).buildAndExpand(clubId).toString() + "&before=5";

        Mockito.when(stravaRestTemplate.getForObject(stravaUrl, ActivityList.class)).thenReturn(activityList);
        ResponseEntity<ActivityList> result = template.getForEntity("/rest/club-activities/" + clubId + "?type=ride&before=5", ActivityList.class);

        Mockito.verify(stravaRestTemplate).getForObject(stravaUrl, ActivityList.class);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(result.getBody().size()).isEqualTo(1);
        Assertions.assertThat(result.getBody().get(0).getType()).isEqualTo("ride");
    }

}
