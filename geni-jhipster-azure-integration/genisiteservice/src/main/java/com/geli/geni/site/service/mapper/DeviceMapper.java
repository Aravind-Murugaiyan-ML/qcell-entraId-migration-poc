package com.geli.geni.site.service.mapper;

import com.geli.geni.site.domain.Devicefalse;
import com.geli.geni.site.domain.Sitefalse;
import com.geli.geni.site.service.dto.DeviceDTO;
import com.geli.geni.site.service.dto.SiteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Devicefalse} and its DTO {@link DeviceDTO}.
 */
@Mapper(componentModel = "spring")
public interface DeviceMapper extends EntityMapper<DeviceDTO, Devicefalse> {
    @Mapping(target = "site", source = "site", qualifiedByName = "siteId")
    DeviceDTO toDto(Devicefalse s);

    @Named("siteId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SiteDTO toDtoSiteId(Sitefalse sitefalse);
}
