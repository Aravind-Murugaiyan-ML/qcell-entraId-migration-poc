package com.geli.geni.site.repository;

import com.geli.geni.site.domain.Userfalse;
import java.util.Optional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link Userfalse} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<Userfalse, String> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    Optional<Userfalse> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    Optional<Userfalse> findOneWithAuthoritiesByLogin(String login);

    Page<Userfalse> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);
}
