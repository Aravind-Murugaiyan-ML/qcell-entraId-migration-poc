package mak.jhipster.doer.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.List;
import mak.jhipster.doer.domain.Todo;
import mak.jhipster.doer.repository.TodoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Todo} entity.
 */
public interface TodoSearchRepository extends ElasticsearchRepository<Todo, Long>, TodoSearchRepositoryInternal {}

interface TodoSearchRepositoryInternal {
    Page<Todo> search(String query, Pageable pageable);

    Page<Todo> search(Query query);

    @Async
    void index(Todo entity);

    @Async
    void deleteFromIndexById(Long id);
}

class TodoSearchRepositoryInternalImpl implements TodoSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final TodoRepository repository;

    TodoSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, TodoRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<Todo> search(String query, Pageable pageable) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery.setPageable(pageable));
    }

    @Override
    public Page<Todo> search(Query query) {
        SearchHits<Todo> searchHits = elasticsearchTemplate.search(query, Todo.class);
        List<Todo> hits = searchHits.map(SearchHit::getContent).stream().toList();
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(Todo entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Todo.class);
    }
}
