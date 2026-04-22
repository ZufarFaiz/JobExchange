package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruiterDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String companyTitle;
    private Boolean isVerified;
}
