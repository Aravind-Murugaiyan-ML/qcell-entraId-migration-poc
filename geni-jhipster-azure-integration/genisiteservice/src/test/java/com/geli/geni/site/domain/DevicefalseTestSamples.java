package com.geli.geni.site.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DevicefalseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Devicefalse getDevicefalseSample1() {
        return new Devicefalse().id(1L).name("name1").serialNumber("serialNumber1");
    }

    public static Devicefalse getDevicefalseSample2() {
        return new Devicefalse().id(2L).name("name2").serialNumber("serialNumber2");
    }

    public static Devicefalse getDevicefalseRandomSampleGenerator() {
        return new Devicefalse()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .serialNumber(UUID.randomUUID().toString());
    }
}
