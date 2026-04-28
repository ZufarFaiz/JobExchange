package JobExchange.model.dto.request;

import JobExchange.model.enums.EmploymentType;
import JobExchange.model.enums.ExperienceLevel;
import JobExchange.model.enums.WorkFormat;
import lombok.Data;

@Data
public class VacancyFilterRequest {
    private String title;
    private String location;
    private Integer salaryMin;
    private Integer salaryMax;
    private EmploymentType employmentType;
    private WorkFormat workFormat;
    private ExperienceLevel experienceLevel;
}