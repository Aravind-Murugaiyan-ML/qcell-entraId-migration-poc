package com.geli.geni.site.domain;

import static com.geli.geni.site.domain.DevicefalseTestSamples.*;
import static com.geli.geni.site.domain.SitefalseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.geli.geni.site.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DevicefalseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Devicefalse.class);
        Devicefalse devicefalse1 = getDevicefalseSample1();
        Devicefalse devicefalse2 = new Devicefalse();
        assertThat(devicefalse1).isNotEqualTo(devicefalse2);

        devicefalse2.setId(devicefalse1.getId());
        assertThat(devicefalse1).isEqualTo(devicefalse2);

        devicefalse2 = getDevicefalseSample2();
        assertThat(devicefalse1).isNotEqualTo(devicefalse2);
    }

    @Test
    void siteTest() throws Exception {
        Devicefalse devicefalse = getDevicefalseRandomSampleGenerator();
        Sitefalse sitefalseBack = getSitefalseRandomSampleGenerator();

        devicefalse.setSite(sitefalseBack);
        assertThat(devicefalse.getSite()).isEqualTo(sitefalseBack);

        devicefalse.site(null);
        assertThat(devicefalse.getSite()).isNull();
    }
}
