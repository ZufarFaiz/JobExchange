package JobExchange.model.dto.request;

import lombok.Data;

@Data
public class ChangeVerifyRequest {
    private Long id;
    private Boolean verify;
}
