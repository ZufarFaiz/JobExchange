package JobExchange.model.dto.response;

import JobExchange.model.enums.ResponseStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResponseDto {
    private Long id;
    private ResponseStatus status;
    private String coverLetter;
    private LocalDateTime createdAt;
    private LocalDateTime viewedAt;

    private Long vacancyId;
    private String vacancyTitle;
    private String vacancyLocation;
    private Integer vacancySalaryMin;
    private Integer vacancySalaryMax;

    private Long companyId;
    private String companyTitle;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantResumeUrl;
}