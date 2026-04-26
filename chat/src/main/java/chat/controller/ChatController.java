package chat.controller;

import chat.dto.ChatDto;
import chat.dto.CreateChatRequest;
import chat.dto.MessageDto;
import chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatDto> createChat(@RequestBody CreateChatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.createChat(request));
    }

    @GetMapping("/response/{responseId}")
    public ResponseEntity<ChatDto> getChatByResponse(@PathVariable Long responseId) {
        return ResponseEntity.ok(chatService.getChatByResponseId(responseId));
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long chatId,
            @RequestParam String email) {
        return ResponseEntity.ok(chatService.getMessages(chatId, email));
    }

    @GetMapping("/applicant/{email}")
    public ResponseEntity<List<ChatDto>> getApplicantChats(@PathVariable String email) {
        return ResponseEntity.ok(chatService.getApplicantChats(email));
    }

    @GetMapping("/recruiter/{email}")
    public ResponseEntity<List<ChatDto>> getRecruiterChats(@PathVariable String email) {
        return ResponseEntity.ok(chatService.getRecruiterChats(email));
    }
}