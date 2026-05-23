package JobExchange.service;

import JobExchange.model.dto.request.CreateChatRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RestTemplate restTemplate;

    @Value("${chat-service.url}")  // ← так работает
    private String chatServiceUrl;
    public void createChatForResponse(Long responseId, String applicantEmail, String recruiterEmail, String firstMessage) {
        try {
            CreateChatRequest request = CreateChatRequest.builder()
                    .responseId(responseId)
                    .applicantEmail(applicantEmail)
                    .recruiterEmail(recruiterEmail)
                    .firstMessage(firstMessage)
                    .build();

            String url = chatServiceUrl + "/api/chats";
            restTemplate.postForObject(url, request, Void.class);

            log.info("Chat created for response: {}", responseId);
        } catch (Exception e) {
            log.error("Failed to create chat for response: {}", responseId, e);
        }
    }
}