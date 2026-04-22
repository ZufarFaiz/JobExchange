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

    // Средний рейтинг вакансии
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.vacancy.id = :vacancyId AND c.isVerified = true")
    Double getAverageRatingByVacancyId(@Param("vacancyId") Long vacancyId);

    // Количество комментариев у вакансии
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.vacancy.id = :vacancyId AND c.isVerified = true")
    Long countVerifiedCommentsByVacancyId(@Param("vacancyId") Long vacancyId);

    // Удалить все комментарии соискателя
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.applicant.id = :applicantId")
    void deleteAllByApplicantId(@Param("applicantId") Long applicantId);
}
