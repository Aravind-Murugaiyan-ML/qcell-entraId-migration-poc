package com.geli.geni.site.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.geli.geni.site.domain.enumeration.DeviceStatus;
import com.geli.geni.site.domain.enumeration.DeviceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Devicefalse.
 */
@Entity
@Table(name = "device")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Devicefalse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type")
    private DeviceType deviceType;

    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DeviceStatus status;

    @Column(name = "installation_date")
    private Instant installationDate;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "devices" }, allowSetters = true)
    private Sitefalse site;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Devicefalse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Devicefalse name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeviceType getDeviceType() {
        return this.deviceType;
    }

    public Devicefalse deviceType(DeviceType deviceType) {
        this.setDeviceType(deviceType);
        return this;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public String getSerialNumber() {
        return this.serialNumber;
    }

    public Devicefalse serialNumber(String serialNumber) {
        this.setSerialNumber(serialNumber);
        return this;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public DeviceStatus getStatus() {
        return this.status;
    }

    public Devicefalse status(DeviceStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }

    public Instant getInstallationDate() {
        return this.installationDate;
    }

    public Devicefalse installationDate(Instant installationDate) {
        this.setInstallationDate(installationDate);
        return this;
    }

    public void setInstallationDate(Instant installationDate) {
        this.installationDate = installationDate;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Devicefalse createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Devicefalse updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Sitefalse getSite() {
        return this.site;
    }

    public void setSite(Sitefalse site) {
        this.site = site;
    }

    public Devicefalse site(Sitefalse site) {
        this.setSite(site);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Devicefalse)) {
            return false;
        }
        return getId() != null && getId().equals(((Devicefalse) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Devicefalse{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", deviceType='" + getDeviceType() + "'" +
            ", serialNumber='" + getSerialNumber() + "'" +
            ", status='" + getStatus() + "'" +
            ", installationDate='" + getInstallationDate() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
