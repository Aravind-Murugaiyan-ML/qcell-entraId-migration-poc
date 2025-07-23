package mak.jhipster.doer.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import mak.jhipster.doer.IntegrationTest;
import mak.jhipster.doer.domain.Todo;
import mak.jhipster.doer.repository.TodoRepository;
import mak.jhipster.doer.repository.search.TodoSearchRepository;
import mak.jhipster.doer.service.dto.TodoDTO;
import mak.jhipster.doer.service.mapper.TodoMapper;
import org.apache.commons.collections4.IterableUtils;
import org.assertj.core.util.IterableUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/todos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/todos/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TodoMapper todoMapper;

    @Autowired
    private TodoSearchRepository todoSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoMockMvc;

    private Todo todo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createEntity(EntityManager em) {
        Todo todo = new Todo()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .completed(DEFAULT_COMPLETED)
            .createdDate(DEFAULT_CREATED_DATE)
            .userId(DEFAULT_USER_ID);
        return todo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Todo createUpdatedEntity(EntityManager em) {
        Todo todo = new Todo()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .completed(UPDATED_COMPLETED)
            .createdDate(UPDATED_CREATED_DATE)
            .userId(UPDATED_USER_ID);
        return todo;
    }

    @AfterEach
    public void cleanupElasticSearchRepository() {
        todoSearchRepository.deleteAll();
        assertThat(todoSearchRepository.count()).isEqualTo(0);
    }

    @BeforeEach
    public void initTest() {
        todo = createEntity(em);
    }

    @Test
    @Transactional
    void createTodo() throws Exception {
        int databaseSizeBeforeCreate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);
        restTodoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeCreate + 1);
        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTodo.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTodo.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testTodo.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testTodo.getUserId()).isEqualTo(DEFAULT_USER_ID);
    }

    @Test
    @Transactional
    void createTodoWithExistingId() throws Exception {
        // Create the Todo with an existing ID
        todo.setId(1L);
        TodoDTO todoDTO = todoMapper.toDto(todo);

        int databaseSizeBeforeCreate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllTodos() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        // Get all the todoList
        restTodoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)));
    }

    @Test
    @Transactional
    void getTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        // Get the todo
        restTodoMockMvc
            .perform(get(ENTITY_API_URL_ID, todo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todo.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID));
    }

    @Test
    @Transactional
    void getNonExistingTodo() throws Exception {
        // Get the todo
        restTodoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        todoSearchRepository.save(todo);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());

        // Update the todo
        Todo updatedTodo = todoRepository.findById(todo.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTodo are not directly saved in db
        em.detach(updatedTodo);
        updatedTodo
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .completed(UPDATED_COMPLETED)
            .createdDate(UPDATED_CREATED_DATE)
            .userId(UPDATED_USER_ID);
        TodoDTO todoDTO = todoMapper.toDto(updatedTodo);

        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTodo.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodo.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testTodo.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testTodo.getUserId()).isEqualTo(UPDATED_USER_ID);
        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<Todo> todoSearchList = IterableUtils.toList(todoSearchRepository.findAll());
                Todo testTodoSearch = todoSearchList.get(searchDatabaseSizeAfter - 1);
                assertThat(testTodoSearch.getTitle()).isEqualTo(UPDATED_TITLE);
                assertThat(testTodoSearch.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
                assertThat(testTodoSearch.getCompleted()).isEqualTo(UPDATED_COMPLETED);
                assertThat(testTodoSearch.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
                assertThat(testTodoSearch.getUserId()).isEqualTo(UPDATED_USER_ID);
            });
    }

    @Test
    @Transactional
    void putNonExistingTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTodo.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTodo.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testTodo.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testTodo.getUserId()).isEqualTo(DEFAULT_USER_ID);
    }

    @Test
    @Transactional
    void fullUpdateTodoWithPatch() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);

        int databaseSizeBeforeUpdate = todoRepository.findAll().size();

        // Update the todo using partial update
        Todo partialUpdatedTodo = new Todo();
        partialUpdatedTodo.setId(todo.getId());

        partialUpdatedTodo
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .completed(UPDATED_COMPLETED)
            .createdDate(UPDATED_CREATED_DATE)
            .userId(UPDATED_USER_ID);

        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodo))
            )
            .andExpect(status().isOk());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        Todo testTodo = todoList.get(todoList.size() - 1);
        assertThat(testTodo.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTodo.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodo.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testTodo.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testTodo.getUserId()).isEqualTo(UPDATED_USER_ID);
    }

    @Test
    @Transactional
    void patchNonExistingTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodo() throws Exception {
        int databaseSizeBeforeUpdate = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        todo.setId(longCount.incrementAndGet());

        // Create the Todo
        TodoDTO todoDTO = todoMapper.toDto(todo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Todo in the database
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteTodo() throws Exception {
        // Initialize the database
        todoRepository.saveAndFlush(todo);
        todoRepository.save(todo);
        todoSearchRepository.save(todo);

        int databaseSizeBeforeDelete = todoRepository.findAll().size();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the todo
        restTodoMockMvc
            .perform(delete(ENTITY_API_URL_ID, todo.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Todo> todoList = todoRepository.findAll();
        assertThat(todoList).hasSize(databaseSizeBeforeDelete - 1);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(todoSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchTodo() throws Exception {
        // Initialize the database
        todo = todoRepository.saveAndFlush(todo);
        todoSearchRepository.save(todo);

        // Search the todo
        restTodoMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + todo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)));
    }
}
