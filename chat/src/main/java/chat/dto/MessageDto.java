package chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
    private Long id;
    private String content;
    private String senderEmail;
    private String senderRole;
    private Boolean isRead;
    private LocalDateTime createdAt;
}