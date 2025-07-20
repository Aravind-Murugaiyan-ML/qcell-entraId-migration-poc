package com.geli.geni.site.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SitefalseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Sitefalse getSitefalseSample1() {
        return new Sitefalse().id(1L).name("name1").location("location1");
    }

    public static Sitefalse getSitefalseSample2() {
        return new Sitefalse().id(2L).name("name2").location("location2");
    }

    public static Sitefalse getSitefalseRandomSampleGenerator() {
        return new Sitefalse().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).location(UUID.randomUUID().toString());
    }
}
