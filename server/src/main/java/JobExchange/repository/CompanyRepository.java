package JobExchange.repository;

import JobExchange.model.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company,Long> {
    Optional<Company> findByTaxId(String taxId);
    List<Company> findByIsVerified(Boolean isVerified);
    Page<Company> findByIsVerified(Boolean isVerified, Pageable pageable);
}
