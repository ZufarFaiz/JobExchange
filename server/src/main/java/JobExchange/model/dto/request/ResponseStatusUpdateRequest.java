package JobExchange.model.dto.request;

import JobExchange.model.enums.ResponseStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseStatusUpdateRequest {
    private ResponseStatus status;
}