package mak.jhipster.doer.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link mak.jhipster.doer.domain.Todo} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TodoDTO implements Serializable {

    private Long id;

    @Size(min = 1, max = 255)
    private String title;

    private String description;

    private Boolean completed;

    private Instant createdDate;

    private String userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TodoDTO)) {
            return false;
        }

        TodoDTO todoDTO = (TodoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, todoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TodoDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", completed='" + getCompleted() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", userId='" + getUserId() + "'" +
            "}";
    }
}
