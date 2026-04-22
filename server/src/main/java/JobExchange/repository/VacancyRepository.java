package JobExchange.repository;

import JobExchange.model.entity.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VacancyRepository extends JpaRepository<Vacancy,Long> {

}
