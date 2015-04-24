package com.iliuta.strava.model;

import java.io.Serializable;

/**
 * Created by apapusoi on 20/04/15.
 */
public class StravaError implements Serializable {

    private static final long serialVersionUID = 1810128527105287526L;

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
