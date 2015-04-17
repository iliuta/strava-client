package com.iliuta.strava.model;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by apapusoi on 17/04/15.
 */
public class ActivityList extends ArrayList<Activity> {
    public ActivityList(int initialCapacity) {
        super(initialCapacity);
    }

    public ActivityList() {
    }

    public ActivityList(Collection<? extends Activity> c) {
        super(c);
    }
}
