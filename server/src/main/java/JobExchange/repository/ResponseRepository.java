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

    long countByApplicantId(Long applicantId);

    Page<Response> findAllByVacancy(Vacancy vacancy,Pageable pageable);

    @Query("SELECT r FROM Response r WHERE r.vacancy.recruiter.id = :recruiterId")
    Page<Response> findAllByRecruiterId(@Param("recruiterId") Long recruiterId, Pageable pageable);
}
