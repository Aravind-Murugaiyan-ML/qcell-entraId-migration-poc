package mak.jhipster.doer.service;

import java.util.Optional;
import mak.jhipster.doer.domain.Todo;
import mak.jhipster.doer.repository.TodoRepository;
import mak.jhipster.doer.repository.search.TodoSearchRepository;
import mak.jhipster.doer.service.dto.TodoDTO;
import mak.jhipster.doer.service.mapper.TodoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link mak.jhipster.doer.domain.Todo}.
 */
@Service
@Transactional
public class TodoService {

    private final Logger log = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    private final TodoMapper todoMapper;

    private final TodoSearchRepository todoSearchRepository;

    public TodoService(TodoRepository todoRepository, TodoMapper todoMapper, TodoSearchRepository todoSearchRepository) {
        this.todoRepository = todoRepository;
        this.todoMapper = todoMapper;
        this.todoSearchRepository = todoSearchRepository;
    }

    /**
     * Save a todo.
     *
     * @param todoDTO the entity to save.
     * @return the persisted entity.
     */
    public TodoDTO save(TodoDTO todoDTO) {
        log.debug("Request to save Todo : {}", todoDTO);
        Todo todo = todoMapper.toEntity(todoDTO);
        todo = todoRepository.save(todo);
        TodoDTO result = todoMapper.toDto(todo);
        todoSearchRepository.index(todo);
        return result;
    }

    /**
     * Update a todo.
     *
     * @param todoDTO the entity to save.
     * @return the persisted entity.
     */
    public TodoDTO update(TodoDTO todoDTO) {
        log.debug("Request to update Todo : {}", todoDTO);
        Todo todo = todoMapper.toEntity(todoDTO);
        todo = todoRepository.save(todo);
        TodoDTO result = todoMapper.toDto(todo);
        todoSearchRepository.index(todo);
        return result;
    }

    /**
     * Partially update a todo.
     *
     * @param todoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TodoDTO> partialUpdate(TodoDTO todoDTO) {
        log.debug("Request to partially update Todo : {}", todoDTO);

        return todoRepository
            .findById(todoDTO.getId())
            .map(existingTodo -> {
                todoMapper.partialUpdate(existingTodo, todoDTO);

                return existingTodo;
            })
            .map(todoRepository::save)
            .map(savedTodo -> {
                todoSearchRepository.index(savedTodo);
                return savedTodo;
            })
            .map(todoMapper::toDto);
    }

    /**
     * Get all the todos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TodoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Todos");
        return todoRepository.findAll(pageable).map(todoMapper::toDto);
    }

    /**
     * Get one todo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TodoDTO> findOne(Long id) {
        log.debug("Request to get Todo : {}", id);
        return todoRepository.findById(id).map(todoMapper::toDto);
    }

    /**
     * Delete the todo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Todo : {}", id);
        todoRepository.deleteById(id);
        todoSearchRepository.deleteFromIndexById(id);
    }

    /**
     * Search for the todo corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TodoDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Todos for query {}", query);
        return todoSearchRepository.search(query, pageable).map(todoMapper::toDto);
    }
}
