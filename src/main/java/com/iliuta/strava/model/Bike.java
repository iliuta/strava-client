package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by apapusoi on 17/12/14.
 */
public class Bike {
    private String id;
    private boolean primary;
    private String name;
    @JsonProperty(value = "resource_state")
    private int resourceState;
    private long distance;


    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getResourceState() {
        return resourceState;
    }

    public void setResourceState(int resourceState) {
        this.resourceState = resourceState;
    }

    public long getDistance() {
        return distance;
    }

    public void setDistance(long distance) {
        this.distance = distance;
    }


    /*
    {
      "id": "b1534132",
      "primary": true,
      "name": "Kona Dr Good",
      "resource_state": 2,
      "distance": 1303618
    }
     */
}
