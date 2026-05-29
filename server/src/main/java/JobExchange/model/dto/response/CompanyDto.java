package JobExchange.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyDto {
    private Long id;
    private String title;
    private String description;
    private String taxId;
    private String location;
    private boolean isVerified;
}
