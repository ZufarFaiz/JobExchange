package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class CommentAccessDeniedException extends ApiException {
    public CommentAccessDeniedException(String action) {
        super(
                HttpStatus.FORBIDDEN,
                "COMMENT_ACCESS_DENIED",
                "You can only " + action + " your own comments"
        );
    }
}