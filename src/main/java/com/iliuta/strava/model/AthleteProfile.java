package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.List;

/**
 * Created by apapusoi on 17/12/14.
 */
public class AthleteProfile {
    private long id;
    @JsonProperty(value = "resource_state")
    private int resourceState;
    @JsonProperty(value="firstname")
    private String firstName;
    @JsonProperty(value="lastname")
    private String lastName;
    @JsonProperty(value = "profile_medium")
    private String profileMedium;
    private String profile;
    private String city;
    private String state;
    private String country;

    private boolean premium;

    @JsonProperty(value = "created_at")
    private Date createdAt;

    @JsonProperty(value = "updated_at")
    private Date updatedAt;

    @JsonProperty(value = "follower_count")
    private int followerCount;

    @JsonProperty(value = "friend_count")
    private int friendCount;

    private String email;

    @JsonProperty(value = "date_preference")
    private String datePreference;
    @JsonProperty(value = "measurement_preference")
    private String measurementPreference;
    private String sex;
    private List<Bike> bikes;
    private List<Shoe> shoes;

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(int followerCount) {
        this.followerCount = followerCount;
    }

    public int getFriendCount() {
        return friendCount;
    }

    public void setFriendCount(int friendCount) {
        this.friendCount = friendCount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDatePreference() {
        return datePreference;
    }

    public void setDatePreference(String datePreference) {
        this.datePreference = datePreference;
    }

    public String getMeasurementPreference() {
        return measurementPreference;
    }

    public void setMeasurementPreference(String measurementPreference) {
        this.measurementPreference = measurementPreference;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getResourceState() {
        return resourceState;
    }

    public void setResourceState(int resourceState) {
        this.resourceState = resourceState;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getProfileMedium() {
        return profileMedium;
    }

    public void setProfileMedium(String profileMedium) {
        this.profileMedium = profileMedium;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public List<Bike> getBikes() {
        return bikes;
    }

    public void setBikes(List<Bike> bikes) {
        this.bikes = bikes;
    }

    public List<Shoe> getShoes() {
        return shoes;
    }

    public void setShoes(List<Shoe> shoes) {
        this.shoes = shoes;
    }
    /*
    {
  "id": 1321007,
  "resource_state": 3,
  "firstname": "Adrian",
  "lastname": "Papusoi",
  "profile_medium": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/athletes\/1321007\/361713\/1\/medium.jpg",
  "profile": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/athletes\/1321007\/361713\/1\/large.jpg",
  "city": "Courbevoie",
  "state": "\u00cele-de-France",
  "country": "France",
  "sex": "M",
  "friend": null,
  "follower": null,
  "premium": false,
  "created_at": "2012-11-13T10:13:38Z",
  "updated_at": "2014-12-17T13:30:39Z",
  "badge_type_id": 0,
  "follower_count": 24,
  "friend_count": 30,
  "mutual_friend_count": 0,
  "date_preference": "%d\/%m\/%Y",
  "measurement_preference": "meters",
  "email": "adrian.papusoi@gmail.com",
  "ftp": null,
  "clubs": [
    {
      "id": 37365,
      "resource_state": 2,
      "name": "Amicale Cycliste des Baltringues de Longchamp",
      "profile_medium": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/37365\/1022943\/1\/medium.jpg",
      "profile": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/37365\/1022943\/1\/large.jpg"
    },
    {
      "id": 45060,
      "resource_state": 2,
      "name": "VeloViewer",
      "profile_medium": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/45060\/1141016\/3\/medium.jpg",
      "profile": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/45060\/1141016\/3\/large.jpg"
    },
    {
      "id": 21017,
      "resource_state": 2,
      "name": "Paris cycling meetup group",
      "profile_medium": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/21017\/449495\/1\/medium.jpg",
      "profile": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/21017\/449495\/1\/large.jpg"
    }
  ],
  "bikes": [
    {
      "id": "b1232920",
      "primary": false,
      "name": "BH G5",
      "resource_state": 2,
      "distance": 4587858
    },
    {
      "id": "b662369",
      "primary": false,
      "name": "Gitane '80s",
      "resource_state": 2,
      "distance": 371587
    },
    {
      "id": "b526413",
      "primary": false,
      "name": "Grand Canyon AL 6.0",
      "resource_state": 2,
      "distance": 362774
    },
    {
      "id": "b1534132",
      "primary": true,
      "name": "Kona Dr Good",
      "resource_state": 2,
      "distance": 1303618
    }
  ],
  "shoes": [

  ]
}
     */
}
