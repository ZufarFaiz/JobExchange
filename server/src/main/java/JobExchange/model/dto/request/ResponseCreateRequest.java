package JobExchange.model.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseCreateRequest {
    private Long vacancyId;
    private String coverLetter;
}