package JobExchange.model.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentUpdateRequest {
    @Size(min = 10, max = 2000, message = "Comment must be between 10 and 2000 characters")
    private String content;

    @Min(1) @Max(5)
    private Integer rating;
}