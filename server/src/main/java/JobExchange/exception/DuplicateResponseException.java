package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResponseException extends ApiException {
    public DuplicateResponseException() {
        super(
                HttpStatus.CONFLICT,
                "DUPLICATE_RESPONSE",
                "You have already responded to this vacancy"
        );
    }
}