package JobExchange.repository;

import JobExchange.model.entity.Vacancy;
import JobExchange.model.enums.EmploymentType;
import JobExchange.model.enums.ExperienceLevel;
import JobExchange.model.enums.WorkFormat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface VacancyRepository extends JpaRepository<Vacancy,Long> {
    Long countByRecruiterId(Long recruiterId);
    Long countByRecruiterIdAndIsActiveTrue(Long recruiterId);

    @Query("SELECT v FROM Vacancy v WHERE " +
            "(CAST(:title AS string) IS NULL OR LOWER(v.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%'))) AND " +
            "(CAST(:location AS string) IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))) AND " +
            "(:salaryMin IS NULL OR v.salaryMin >= :salaryMin) AND " +
            "(:salaryMax IS NULL OR v.salaryMax <= :salaryMax) AND " +
            "(:employmentType IS NULL OR v.employmentType = :employmentType) AND " +
            "(:workFormat IS NULL OR v.workFormat = :workFormat) AND " +
            "(:experienceLevel IS NULL OR v.experienceLevel = :experienceLevel)")
    Page<Vacancy> findAllWithFilters(@Param("title") String title,
                                     @Param("location") String location,
                                     @Param("salaryMin") Integer salaryMin,
                                     @Param("salaryMax") Integer salaryMax,
                                     @Param("employmentType") EmploymentType employmentType,
                                     @Param("workFormat") WorkFormat workFormat,
                                     @Param("experienceLevel") ExperienceLevel experienceLevel,
                                     Pageable pageable);
}

