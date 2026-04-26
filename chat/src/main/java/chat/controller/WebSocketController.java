package chat.controller;

import chat.dto.MessageDto;
import chat.dto.SendMessageRequest;
import chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat/{chatId}/send")
    @SendTo("/topic/chat/{chatId}")
    public MessageDto sendMessage(
            @DestinationVariable Long chatId,
            @Payload SendMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor) {

        Principal principal = headerAccessor.getUser();
        String email = principal != null ? principal.getName() : "unknown";

        log.info("WebSocket message: chatId={}, email={}", chatId, email);

        return chatService.sendMessage(chatId, email, request);
    }
}