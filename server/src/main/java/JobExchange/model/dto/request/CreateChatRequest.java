package JobExchange.model.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateChatRequest {
    private Long responseId;
    private String applicantEmail;
    private String recruiterEmail;
}