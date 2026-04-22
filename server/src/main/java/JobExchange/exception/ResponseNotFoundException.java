package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class ResponseNotFoundException extends ApiException {
    public ResponseNotFoundException(Long responseId) {
        super(
                HttpStatus.NOT_FOUND,
                "RESPONSE_NOT_FOUND",
                "Response with id " + responseId + " not found"
        );
    }
}