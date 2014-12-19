package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by apapusoi on 17/12/14.
 */
public class Shoe {
    private String id;
    @JsonProperty(value = "resource_state")
    private int resourceState;

    public int getResourceState() {
        return resourceState;
    }

    public void setResourceState(int resourceState) {
        this.resourceState = resourceState;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
