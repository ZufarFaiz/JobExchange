package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class ApplicantNotFoundException extends ApiException {
    public ApplicantNotFoundException(Long applicantId) {
        super(
                HttpStatus.NOT_FOUND,
                "APPLICANT_NOT_FOUND",
                "Applicant with id " + applicantId + " not found"
        );
    }
}