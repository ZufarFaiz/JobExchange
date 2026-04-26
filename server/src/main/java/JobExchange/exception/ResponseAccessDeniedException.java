package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class ResponseAccessDeniedException extends ApiException {
    public ResponseAccessDeniedException(String message) {
        super(
                HttpStatus.FORBIDDEN,
                "RESPONSE_ACCESS_DENIED",
                message
        );
    }
}