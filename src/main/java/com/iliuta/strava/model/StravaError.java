package com.iliuta.strava.model;

/**
 * Created by apapusoi on 20/04/15.
 */
public class StravaError {
    private String message;

    private String detailedMessage;

    public String getDetailedMessage() {
        return detailedMessage;
    }

    public void setDetailedMessage(String detailedMessage) {
        this.detailedMessage = detailedMessage;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
