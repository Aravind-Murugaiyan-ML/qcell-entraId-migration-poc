package com.geli.geni.site.domain;

import static com.geli.geni.site.domain.DevicefalseTestSamples.*;
import static com.geli.geni.site.domain.SitefalseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.geli.geni.site.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SitefalseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sitefalse.class);
        Sitefalse sitefalse1 = getSitefalseSample1();
        Sitefalse sitefalse2 = new Sitefalse();
        assertThat(sitefalse1).isNotEqualTo(sitefalse2);

        sitefalse2.setId(sitefalse1.getId());
        assertThat(sitefalse1).isEqualTo(sitefalse2);

        sitefalse2 = getSitefalseSample2();
        assertThat(sitefalse1).isNotEqualTo(sitefalse2);
    }

    @Test
    void devicesTest() throws Exception {
        Sitefalse sitefalse = getSitefalseRandomSampleGenerator();
        Devicefalse devicefalseBack = getDevicefalseRandomSampleGenerator();

        sitefalse.addDevices(devicefalseBack);
        assertThat(sitefalse.getDevices()).containsOnly(devicefalseBack);
        assertThat(devicefalseBack.getSite()).isEqualTo(sitefalse);

        sitefalse.removeDevices(devicefalseBack);
        assertThat(sitefalse.getDevices()).doesNotContain(devicefalseBack);
        assertThat(devicefalseBack.getSite()).isNull();

        sitefalse.devices(new HashSet<>(Set.of(devicefalseBack)));
        assertThat(sitefalse.getDevices()).containsOnly(devicefalseBack);
        assertThat(devicefalseBack.getSite()).isEqualTo(sitefalse);

        sitefalse.setDevices(new HashSet<>());
        assertThat(sitefalse.getDevices()).doesNotContain(devicefalseBack);
        assertThat(devicefalseBack.getSite()).isNull();
    }
}
