package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class CompanyNotVerifiedException extends ApiException {
    public CompanyNotVerifiedException(Long companyId) {
        super(
                HttpStatus.FORBIDDEN,
                "COMPANY_NOT_VERIFIED",
                "Company with " + companyId + " is not verified. Please wait for admin approval."
        );
    }
}