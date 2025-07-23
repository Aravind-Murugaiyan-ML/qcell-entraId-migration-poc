package mak.jhipster.doer.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class TodoMapperTest {

    private TodoMapper todoMapper;

    @BeforeEach
    public void setUp() {
        todoMapper = new TodoMapperImpl();
    }
}
