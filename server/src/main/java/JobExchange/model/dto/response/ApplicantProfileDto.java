package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicantProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long totalResponses;
}