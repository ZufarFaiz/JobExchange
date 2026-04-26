package chat.service;

import chat.dto.*;
import chat.entity.Chat;
import chat.entity.Message;
import chat.repository.ChatRepository;
import chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public ChatDto createChat(CreateChatRequest request) {
        if (chatRepository.existsByResponseId(request.getResponseId())) {
            return getChatByResponseId(request.getResponseId());
        }

        Chat chat = Chat.builder()
                .responseId(request.getResponseId())
                .applicantEmail(request.getApplicantEmail())
                .recruiterEmail(request.getRecruiterEmail())
                .isActive(true)
                .build();

        chat = chatRepository.save(chat);
        log.info("Chat created: id={}, responseId={}", chat.getId(), chat.getResponseId());

        return toDto(chat);
    }

    @Transactional
    public MessageDto sendMessage(Long chatId, String senderEmail, SendMessageRequest request) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        // Проверяем, что отправитель участник чата
        if (!chat.getApplicantEmail().equals(senderEmail) &&
                !chat.getRecruiterEmail().equals(senderEmail)) {
            throw new RuntimeException("Access denied");
        }

        Message message = Message.builder()
                .chat(chat)
                .content(request.getContent())
                .senderEmail(senderEmail)
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);

        log.info("Message sent: chatId={}, senderEmail={}", chatId, senderEmail);

        return toDto(message);
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(Long chatId, String userEmail) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        // Проверяем, что пользователь участник чата
        if (!chat.getApplicantEmail().equals(userEmail) &&
                !chat.getRecruiterEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        // Помечаем сообщения как прочитанные (кроме своих)
        messageRepository.markAllAsRead(chatId, userEmail);

        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChatDto getChatByResponseId(Long responseId) {
        Chat chat = chatRepository.findByResponseId(responseId)
                .orElseThrow(() -> new RuntimeException("Chat not found for response: " + responseId));
        return toDto(chat);
    }

    @Transactional(readOnly = true)
    public List<ChatDto> getApplicantChats(String applicantEmail) {
        return chatRepository.findByApplicantEmailOrderByUpdatedAtDesc(applicantEmail).stream()
                .map(chat -> toDto(chat, applicantEmail))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatDto> getRecruiterChats(String recruiterEmail) {
        return chatRepository.findByRecruiterEmailOrderByUpdatedAtDesc(recruiterEmail).stream()
                .map(chat -> toDto(chat, recruiterEmail))
                .collect(Collectors.toList());
    }

    private ChatDto toDto(Chat chat) {
        List<Message> messages = chat.getMessages();
        if (messages == null) {
            messages = new ArrayList<>();
        }

        Message lastMessage = messages.isEmpty() ? null : messages.get(messages.size() - 1);

        return ChatDto.builder()
                .id(chat.getId())
                .responseId(chat.getResponseId())
                .applicantEmail(chat.getApplicantEmail())
                .recruiterEmail(chat.getRecruiterEmail())
                .isActive(chat.getIsActive())
                .createdAt(chat.getCreatedAt())
                .updatedAt(chat.getUpdatedAt())
                .lastMessage(lastMessage != null ? toDto(lastMessage) : null)
                .build();
    }

    private ChatDto toDto(Chat chat, String currentUserEmail) {
        List<Message> messages = chat.getMessages();
        if (messages == null) {
            messages = new ArrayList<>();
        }

        Message lastMessage = messages.isEmpty() ? null : messages.get(messages.size() - 1);
        Long unreadCount = messageRepository.countUnread(chat.getId(), currentUserEmail);

        String otherPartyEmail = chat.getApplicantEmail().equals(currentUserEmail) ?
                chat.getRecruiterEmail() : chat.getApplicantEmail();
        String otherPartyRole = chat.getApplicantEmail().equals(currentUserEmail) ? "RECRUITER" : "APPLICANT";

        return ChatDto.builder()
                .id(chat.getId())
                .responseId(chat.getResponseId())
                .applicantEmail(chat.getApplicantEmail())
                .recruiterEmail(chat.getRecruiterEmail())
                .otherPartyEmail(otherPartyEmail)
                .otherPartyRole(otherPartyRole)
                .isActive(chat.getIsActive())
                .createdAt(chat.getCreatedAt())
                .updatedAt(chat.getUpdatedAt())
                .lastMessage(lastMessage != null ? toDto(lastMessage) : null)
                .unreadCount(unreadCount)
                .build();
    }

    private MessageDto toDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderEmail(message.getSenderEmail())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}