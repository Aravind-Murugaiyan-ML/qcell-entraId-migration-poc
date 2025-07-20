package com.geli.geni.site.repository;

import com.geli.geni.site.domain.Devicefalse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Devicefalse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeviceRepository extends JpaRepository<Devicefalse, Long> {}
