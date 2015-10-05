package com.iliuta.strava.model;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by apapusoi on 17/04/15.
 */
public class PhotoList extends ArrayList<Photo> {
    public PhotoList(int initialCapacity) {
        super(initialCapacity);
    }

    public PhotoList() {
    }

    public PhotoList(Collection<? extends Photo> c) {
        super(c);
    }
}
