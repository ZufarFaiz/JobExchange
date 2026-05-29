package JobExchange.repository;

import JobExchange.model.entity.Recruiter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter,Long> {
    List<Recruiter> findByIsVerified(Boolean isVerified);
    Page<Recruiter> findByIsVerified(Boolean isVerified, Pageable pageable);
}
