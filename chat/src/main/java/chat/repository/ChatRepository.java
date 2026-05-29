package chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import chat.entity.Chat;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByResponseId(Long responseId);

    boolean existsByResponseId(Long responseId);

    List<Chat> findByApplicantEmailOrderByUpdatedAtDesc(String applicantEmail);

    List<Chat> findByRecruiterEmailOrderByUpdatedAtDesc(String recruiterEmail);
}