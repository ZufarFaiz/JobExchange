package chat.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatDto {
    private Long id;
    private Long responseId;
    private String applicantEmail;
    private String recruiterEmail;
    private String otherPartyEmail;      // Email собеседника
    private String otherPartyRole;       // Role собеседника
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MessageDto lastMessage;
    private Long unreadCount;
}