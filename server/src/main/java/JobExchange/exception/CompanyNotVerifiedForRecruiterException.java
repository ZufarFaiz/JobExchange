package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class CompanyNotVerifiedForRecruiterException extends ApiException {
    public CompanyNotVerifiedForRecruiterException() {
        super(
                HttpStatus.BAD_REQUEST,
                "COMPANY_NOT_VERIFIED",
                "Cannot verify recruiter: company is not verified yet"
        );
    }
}