package JobExchange.model.dto.response;

import JobExchange.model.enums.EmploymentType;
import JobExchange.model.enums.ExperienceLevel;
import JobExchange.model.enums.WorkFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class VacancyDto {

    private Long id;

    private String title;

    private String description;

    private String location;

    private Integer salaryMin;

    private Integer salaryMax;

    private String requirements;

    private EmploymentType employmentType;

    private WorkFormat workFormat;

    private ExperienceLevel experienceLevel;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<CommentDto> comments;

    // Информация о компании
    private Long companyId;
    private String companyTitle;
    private String companyLocation;

    // Информация о рекрутере
    private Long recruiterId;
    private String recruiterName;  // firstName + lastName
    private String recruiterEmail;
}