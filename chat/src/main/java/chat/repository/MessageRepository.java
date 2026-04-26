package chat.repository;

import chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.chat.id = :chatId AND m.senderEmail != :userEmail")
    void markAllAsRead(@Param("chatId") Long chatId, @Param("userEmail") String userEmail);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.chat.id = :chatId AND m.isRead = false AND m.senderEmail != :userEmail")
    long countUnread(@Param("chatId") Long chatId, @Param("userEmail") String userEmail);
}