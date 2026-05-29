package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class DuplicateVerificationException extends ApiException {
    public DuplicateVerificationException(String entityType, boolean isVerified) {
        super(
                HttpStatus.BAD_REQUEST,
                "DUPLICATE_VERIFICATION",
                entityType + " is already " + (isVerified ? "verified" : "not verified")
        );
    }
}