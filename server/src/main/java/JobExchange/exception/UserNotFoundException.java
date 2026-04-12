package JobExchange.exception;


import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(String email) {
        super(
                HttpStatus.NOT_FOUND, //404
                "USER_NOT_FOUND",
                "User with email " + email + " not found"
        );
    }

    public UserNotFoundException(Long userId) {
        super(
                HttpStatus.NOT_FOUND,
                "USER_NOT_FOUND",
                "User with id " + userId + " not found"
        );
    }
}