package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class RecruiterProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long companyId;
    private String companyTitle;
    private String companyLocation;
    private Boolean companyVerified;

    private Long totalVacancies;
    private Long activeVacancies;
}