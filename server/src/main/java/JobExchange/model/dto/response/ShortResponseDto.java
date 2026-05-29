package JobExchange.model.dto.response;

import JobExchange.model.enums.ResponseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class ShortResponseDto {
    private Long id;
    private ResponseStatus status;
    private LocalDateTime createdAt;

    private Long vacancyId;
    private String vacancyTitle;

    private Long applicantId;
    private String applicantName;
}
