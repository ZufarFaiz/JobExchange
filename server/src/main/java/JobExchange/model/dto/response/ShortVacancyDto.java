package JobExchange.model.dto.response;

import JobExchange.model.enums.EmploymentType;
import JobExchange.model.enums.ExperienceLevel;
import JobExchange.model.enums.WorkFormat;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShortVacancyDto {
    private Long id;

    private String title;

    private String location;

    private Integer salaryMin;

    private Integer salaryMax;

    private ExperienceLevel experienceLevel;
    private EmploymentType employmentType;

    private WorkFormat workFormat;

    private String companyTitle;
}
