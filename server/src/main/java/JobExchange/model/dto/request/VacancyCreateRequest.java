package JobExchange.model.dto.request;

import JobExchange.model.enums.EmploymentType;
import JobExchange.model.enums.ExperienceLevel;
import JobExchange.model.enums.WorkFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VacancyCreateRequest {

    private String title;

    private String description;

    private String location;

    private Integer salaryMin;

    private Integer salaryMax;

    private String requirements;

    private EmploymentType employmentType;

    private WorkFormat workFormat;

    private ExperienceLevel experienceLevel;

}
