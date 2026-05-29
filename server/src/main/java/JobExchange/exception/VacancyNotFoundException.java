package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class VacancyNotFoundException extends ApiException {
    public VacancyNotFoundException(Long companyId) {
        super(
                HttpStatus.NOT_FOUND, //404
                "COMPANY_NOT_FOUND",
                "Company with id " + companyId + " not found"
        );
    }
}
