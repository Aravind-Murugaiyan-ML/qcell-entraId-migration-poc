package com.geli.geni.site.repository;

import com.geli.geni.site.domain.Sitefalse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Sitefalse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SiteRepository extends JpaRepository<Sitefalse, Long> {}
