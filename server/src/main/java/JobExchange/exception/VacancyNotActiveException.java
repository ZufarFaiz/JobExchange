package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class VacancyNotActiveException extends ApiException {
    public VacancyNotActiveException(Long vacancyId) {
        super(
                HttpStatus.BAD_REQUEST,
                "VACANCY_NOT_ACTIVE",
                "Vacancy with id " + vacancyId + " is not active"
        );
    }
}