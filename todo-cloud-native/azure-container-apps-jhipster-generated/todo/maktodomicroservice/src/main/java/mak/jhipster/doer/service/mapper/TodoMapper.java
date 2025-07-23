package mak.jhipster.doer.service.mapper;

import mak.jhipster.doer.domain.Todo;
import mak.jhipster.doer.service.dto.TodoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Todo} and its DTO {@link TodoDTO}.
 */
@Mapper(componentModel = "spring")
public interface TodoMapper extends EntityMapper<TodoDTO, Todo> {}
