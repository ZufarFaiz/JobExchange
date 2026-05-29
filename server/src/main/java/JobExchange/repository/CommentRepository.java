package JobExchange.repository;

import JobExchange.model.entity.Comment;
import JobExchange.model.entity.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

    // Найти все комментарии соискателя (в личном кабинете)
    List<Comment> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<Comment> findByVacancy(Vacancy vacancy);

    // Удалить все комментарии соискателя
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.applicant.id = :applicantId")
    void deleteAllByApplicantId(@Param("applicantId") Long applicantId);
}
