package com.iliuta.strava.mvc;

/**
 * Created by apapusoi on 16/06/15.
 */
public class StravaClientException extends Exception {
    public StravaClientException(String message) {
        super(message);
    }

    public StravaClientException(String message, Throwable cause) {
        super(message, cause);
    }
}
