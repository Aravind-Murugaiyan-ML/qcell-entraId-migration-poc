package com.geli.geni.site.service.mapper;

import com.geli.geni.site.domain.Sitefalse;
import com.geli.geni.site.service.dto.SiteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Sitefalse} and its DTO {@link SiteDTO}.
 */
@Mapper(componentModel = "spring")
public interface SiteMapper extends EntityMapper<SiteDTO, Sitefalse> {}
