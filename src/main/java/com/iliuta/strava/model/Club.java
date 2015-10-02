package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by apapusoi on 02/10/15.
 * <p/>
 * {
 * "id": 37365,
 * "resource_state": 2,
 * "name": "Amicale Cycliste des Baltringues de Longchamp",
 * "profile_medium": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/37365\/1022943\/1\/medium.jpg",
 * "profile": "http:\/\/dgalywyr863hv.cloudfront.net\/pictures\/clubs\/37365\/1022943\/1\/large.jpg"
 * }
 */
public class Club {

    private String id;
    
    @JsonProperty(value = "resource_state")
    private int resourceState;
    
    private String name;
    
    @JsonProperty(value = "profile_medium")
    private String profileMedium;
    
    private String profile;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getResourceState() {
        return resourceState;
    }

    public void setResourceState(int resourceState) {
        this.resourceState = resourceState;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}
