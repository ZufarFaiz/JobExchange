package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDto {
    private Long id;
    private String content;
    private Integer rating;
    private Boolean isVerified;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    private Long vacancyId;
    private String vacancyTitle;
    private String companyName;
}