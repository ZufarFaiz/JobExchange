package chat.config;

import chat.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> nativeHeaders = accessor.getNativeHeader("Authorization");

                    if (nativeHeaders == null || nativeHeaders.isEmpty()) {
                        String query = accessor.getNativeHeader("query") != null ?
                                accessor.getNativeHeader("query").get(0) : null;
                        if (query != null && query.contains("token=")) {
                            String token = query.split("token=")[1];
                            if (token.contains("&")) {
                                token = token.split("&")[0];
                            }
                            nativeHeaders = List.of("Bearer " + token);
                        }
                    }

                    if (nativeHeaders != null && !nativeHeaders.isEmpty()) {
                        String authHeader = nativeHeaders.get(0);
                        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

                        if (jwtService.isTokenValid(token)) {
                            String email = jwtService.extractUsername(token);
                            accessor.setUser(() -> email);
                            log.info("WebSocket connected: email={}", email);
                        } else {
                            log.warn("Invalid token for WebSocket connection");
                        }
                    }
                }
                return message;
            }
        });
    }
}