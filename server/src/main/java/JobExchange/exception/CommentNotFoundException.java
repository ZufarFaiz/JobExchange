package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class CommentNotFoundException extends ApiException {
    public CommentNotFoundException(Long commentId) {
        super(
                HttpStatus.NOT_FOUND,
                "COMMENT_NOT_FOUND",
                "Comment with id " + commentId + " not found"
        );
    }
}