package JobExchange.repository;

import JobExchange.model.entity.Applicant;
import JobExchange.model.entity.Response;
import JobExchange.model.entity.Vacancy;
import JobExchange.model.enums.ResponseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {

    boolean existsByApplicantAndVacancy(Applicant applicant, Vacancy vacancy);

    List<Response> findByApplicantOrderByCreatedAtDesc(Applicant applicant);

    Page<Response> findByVacancyOrderByCreatedAtDesc(Vacancy vacancy, Pageable pageable);

    List<Response> findByVacancyAndStatus(Vacancy vacancy, ResponseStatus status);

    @Query("SELECT r FROM Response r WHERE r.vacancy.recruiter.id = :recruiterId")
    List<Response> findAllByRecruiterId(@Param("recruiterId") Long recruiterId);

    // Подсчитать новые отклики для рекрутера
    @Query("SELECT COUNT(r) FROM Response r WHERE r.vacancy.recruiter.id = :recruiterId AND r.viewedAt IS NULL")
    Long countNewResponsesByRecruiterId(@Param("recruiterId") Long recruiterId);

    // Обновить статус отклика
    @Modifying
    @Query("UPDATE Response r SET r.status = :status, r.updatedAt = :now WHERE r.id = :responseId")
    void updateStatus(@Param("responseId") Long responseId,
                      @Param("status") ResponseStatus status,
                      @Param("now") LocalDateTime now);
}
