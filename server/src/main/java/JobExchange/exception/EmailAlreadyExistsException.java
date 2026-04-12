package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApiException {
    public EmailAlreadyExistsException(String email) {
        super(
                HttpStatus.BAD_REQUEST, //400
                "EMAIL_ALREADY_EXISTS",
                "Email " + email + " is already registered"
        );
    }
}