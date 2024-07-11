package it.unicam.cs.ids.model.content;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a base implementation of the {@link Content} interface.
 * This class provides methods that concerns about Comments.
 */
@Entity
public class Comment {

    private boolean isValidate;
    private int authorId;
    private String comment;
    private LocalDateTime timestamp;  // Aggiunta la proprietà timestamp

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    /**
     * Constructs a new Contest object with the specified parameters.
     *
     * @param comment The text of the comment.
     */
    public Comment(String comment) {
        this.isValidate = false;
        this.comment = comment;
        this.timestamp = LocalDateTime.now();  // Imposta il timestamp alla data e ora corrente
    }

    /**
     * Default constructor.
     */
    public Comment() {
        this.isValidate = false;
        this.timestamp = LocalDateTime.now();  // Imposta il timestamp alla data e ora corrente
    }

    // Getters e Setters

    public int getAuthorId() {
        return authorId;
    }

    public void setAuthorId(int authorId) {
        this.authorId = authorId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isValidate() {
        return isValidate;
    }

    public void setValidation(boolean validate) {
        isValidate = validate;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
