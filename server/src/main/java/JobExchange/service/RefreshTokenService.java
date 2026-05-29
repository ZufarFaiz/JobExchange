package JobExchange.service;

import JobExchange.exception.RefreshTokenExpiredException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.model.entity.RefreshToken;
import JobExchange.model.entity.User;
import JobExchange.repository.RefreshTokenRepository;
import JobExchange.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${app.jwt.refresh-token-expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new UserNotFoundException(userId));

        refreshTokenRepository.findByUser(user).ifPresent(token -> {
            refreshTokenRepository.delete(token);
            refreshTokenRepository.flush();  // ← КЛЮЧЕВОЙ МОМЕНТ!
        });

        RefreshToken refreshToken=RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0 || token.isRevoked()){
            refreshTokenRepository.delete(token);
            throw new RefreshTokenExpiredException();
        }
        return token;
    }

    @Transactional
    public void revokedAllUserTokens(User user){
        refreshTokenRepository.deleteByUser(user);
    }
}