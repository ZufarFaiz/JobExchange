package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerifyResponseDto {
    private Long id;
    private String type;
    private String title;
    private String email;
    private Boolean verified;
    private String message;
}