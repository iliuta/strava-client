package com.iliuta.strava.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Created by apapusoi on 05/10/15.
 */
public class Photo {
    private String id;
    @JsonProperty(value = "unique_id")
    private String uniqueId;
    @JsonProperty(value = "activity_id")
    private String activityId;
    @JsonProperty(value = "resource_state")
    private int resourceState;
    private String ref;
    private String uid;
    private java.util.Map<String, String> urls;
    private String caption;
    private Integer source;
    private List<BigDecimal> location;

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public int getResourceState() {
        return resourceState;
    }

    public void setResourceState(int resourceState) {
        this.resourceState = resourceState;
    }

    public Map<String, String> getUrls() {
        return urls;
    }

    public void setUrls(Map<String, String> urls) {
        this.urls = urls;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Integer getSource() {
        return source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }

    public List<BigDecimal> getLocation() {
        return location;
    }

    public void setLocation(List<BigDecimal> location) {
        this.location = location;
    }
}
