package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by apapusoi on 17/04/15.
 */
public class Map {

    private String id;
    private String polyline;
    @JsonProperty(value = "summary_polyline")
    private String summaryPolyline;
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

    public String getPolyline() {
        return polyline;
    }

    public void setPolyline(String polyline) {
        this.polyline = polyline;
    }

    public String getSummaryPolyline() {
        return summaryPolyline;
    }

    public void setSummaryPolyline(String summaryPolyline) {
        this.summaryPolyline = summaryPolyline;
    }

}
