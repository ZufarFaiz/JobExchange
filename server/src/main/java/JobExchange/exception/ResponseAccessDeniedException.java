package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class ResponseAccessDeniedException extends ApiException {
    public ResponseAccessDeniedException() {
        super(
                HttpStatus.FORBIDDEN,
                "RESPONSE_ACCESS_DENIED",
                "You don't have permission to update this response"
        );
    }
}