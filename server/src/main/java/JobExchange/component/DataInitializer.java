package JobExchange.component;

import JobExchange.model.entity.User;
import JobExchange.model.enums.Role;
import JobExchange.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Проверяем, есть ли уже админ
        if (userRepository.existsByEmail("admin@jobexchange.com")) {
            log.info("Data already initialized. Skipping...");
            return;
        }

        log.info("Starting data initialization...");

        // ========== 1. СОЗДАНИЕ АДМИНА ==========
        User admin = new User();
        admin.setEmail("admin@jobexchange.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhoneNumber("+70000000000");
        admin.setRole(Role.ROLE_ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        userRepository.save(admin);
    }
}
