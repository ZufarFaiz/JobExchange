package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class RecruiterNotVerifiedException extends ApiException {
    public RecruiterNotVerifiedException(Long recruiterId) {
        super(
                HttpStatus.FORBIDDEN,
                "RECRUITER_NOT_VERIFIED",
                "Recruiter with id" + recruiterId + " not verified. Please wait for admin approval."
        );
    }
}