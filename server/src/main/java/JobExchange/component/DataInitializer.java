package JobExchange.component;

import JobExchange.model.entity.*;
import JobExchange.model.enums.*;
import JobExchange.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final ApplicantRepository applicantRepository;
    private final VacancyRepository vacancyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Проверяем, есть ли уже данные
        if (userRepository.existsByEmail("admin@jobexchange.com")) {
            log.info("Data already initialized. Skipping...");
            return;
        }

        log.info("Starting data initialization...");

        // ========== 1. СОЗДАНИЕ АДМИНА ==========
        User admin = new User();
        admin.setEmail("admin@jobexchange.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhoneNumber("+70000000000");
        admin.setRole(Role.ROLE_ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        userRepository.save(admin);
        log.info("Admin created: admin@jobexchange.com / admin123");

        // ========== 2. СОЗДАНИЕ КОМПАНИЙ ==========
        Company company1 = new Company();
        company1.setTitle("ТехКорп");
        company1.setLocation("Москва, ул. Тверская, д. 1");
        company1.setTaxId("123456789012");
        company1.setDescription("Крупная IT-компания, специализирующаяся на разработке ПО");
        company1.setIsVerified(true);
        company1.setCreatedAt(LocalDateTime.now());
        company1.setUpdatedAt(LocalDateTime.now());
        companyRepository.save(company1);

        Company company2 = new Company();
        company2.setTitle("ООО Ромашка");
        company2.setLocation("Санкт-Петербург, Невский пр., д. 10");
        company2.setTaxId("987654321098");
        company2.setDescription("Торговая компания");
        company2.setIsVerified(true);
        company2.setCreatedAt(LocalDateTime.now());
        company2.setUpdatedAt(LocalDateTime.now());
        companyRepository.save(company2);

        Company company3 = new Company();
        company3.setTitle("Стартап Инновации");
        company3.setLocation("Новосибирск, Академгородок");
        company3.setTaxId("555555555555");
        company3.setDescription("Инновационный стартап в области AI");
        company3.setIsVerified(false);
        company3.setCreatedAt(LocalDateTime.now());
        company3.setUpdatedAt(LocalDateTime.now());
        companyRepository.save(company3);
        log.info("Companies created: {} companies", companyRepository.count());

        // ========== 3. СОЗДАНИЕ РЕКРУТЕРОВ ==========
        // Рекрутер 1 (верифицированный)
        Recruiter recruiter1 = new Recruiter();
        recruiter1.setEmail("hr.ivanov@techcorp.com");
        recruiter1.setPassword(passwordEncoder.encode("123456"));
        recruiter1.setFirstName("Иван");
        recruiter1.setLastName("Иванов");
        recruiter1.setPhoneNumber("+79001234567");
        recruiter1.setRole(Role.ROLE_RECRUITER);
        recruiter1.setCreatedAt(LocalDateTime.now());
        recruiter1.setIsVerified(true);
        recruiter1.setCompany(company1);
        recruiterRepository.save(recruiter1);

        // Рекрутер 2 (не верифицированный)
        Recruiter recruiter2 = new Recruiter();
        recruiter2.setEmail("hr.petrov@romashka.ru");
        recruiter2.setPassword(passwordEncoder.encode("123456"));
        recruiter2.setFirstName("Петр");
        recruiter2.setLastName("Петров");
        recruiter2.setPhoneNumber("+79009998877");
        recruiter2.setRole(Role.ROLE_RECRUITER);
        recruiter2.setCreatedAt(LocalDateTime.now());
        recruiter2.setIsVerified(false);
        recruiter2.setCompany(company2);
        recruiterRepository.save(recruiter2);
        log.info("Recruiters created: {} recruiters", recruiterRepository.count());

        // ========== 4. СОЗДАНИЕ СОИСКАТЕЛЕЙ ==========
        // Соискатель 1
        Applicant applicant1 = new Applicant();
        applicant1.setEmail("applicant@example.com");
        applicant1.setPassword(passwordEncoder.encode("123456"));
        applicant1.setFirstName("Алексей");
        applicant1.setLastName("Смирнов");
        applicant1.setPhoneNumber("+79111234567");
        applicant1.setRole(Role.ROLE_APPLICANT);
        applicant1.setCreatedAt(LocalDateTime.now());
        applicant1.setResumeUrl(null);
        applicantRepository.save(applicant1);

        // Соискатель 2
        Applicant applicant2 = new Applicant();
        applicant2.setEmail("applicant2@example.com");
        applicant2.setPassword(passwordEncoder.encode("123456"));
        applicant2.setFirstName("Елена");
        applicant2.setLastName("Козлова");
        applicant2.setPhoneNumber("+79229887766");
        applicant2.setRole(Role.ROLE_APPLICANT);
        applicant2.setCreatedAt(LocalDateTime.now());
        applicant2.setResumeUrl(null);
        applicantRepository.save(applicant2);
        log.info("Applicants created: {} applicants", applicantRepository.count());

        // ========== 5. СОЗДАНИЕ ВАКАНСИЙ ==========
        Vacancy vacancy1 = new Vacancy();
        vacancy1.setTitle("Java Developer");
        vacancy1.setDescription("Разработка backend сервисов на Java");
        vacancy1.setLocation("Москва (можно удаленно)");
        vacancy1.setSalaryMin(200000);
        vacancy1.setSalaryMax(300000);
        vacancy1.setRequirements("Java 17+, Spring Boot, PostgreSQL");
        vacancy1.setEmploymentType(EmploymentType.FULL_TIME);
        vacancy1.setWorkFormat(WorkFormat.REMOTE);
        vacancy1.setExperienceLevel(ExperienceLevel.MIDDLE);
        vacancy1.setIsActive(true);
        vacancy1.setRecruiter(recruiter1);
        vacancy1.setCompany(company1);
        vacancy1.setCreatedAt(LocalDateTime.now());
        vacancy1.setUpdatedAt(LocalDateTime.now());
        vacancyRepository.save(vacancy1);

        Vacancy vacancy2 = new Vacancy();
        vacancy2.setTitle("Frontend Developer");
        vacancy2.setDescription("Разработка интерфейсов на React");
        vacancy2.setLocation("Санкт-Петербург");
        vacancy2.setSalaryMin(150000);
        vacancy2.setSalaryMax(220000);
        vacancy2.setRequirements("React, TypeScript, Redux");
        vacancy2.setEmploymentType(EmploymentType.FULL_TIME);
        vacancy2.setWorkFormat(WorkFormat.OFFICE);
        vacancy2.setExperienceLevel(ExperienceLevel.JUNIOR);
        vacancy2.setIsActive(true);
        vacancy2.setRecruiter(recruiter1);
        vacancy2.setCompany(company1);
        vacancy2.setCreatedAt(LocalDateTime.now());
        vacancy2.setUpdatedAt(LocalDateTime.now());
        vacancyRepository.save(vacancy2);

        Vacancy vacancy3 = new Vacancy();
        vacancy3.setTitle("DevOps Engineer");
        vacancy3.setDescription("Настройка CI/CD, администрирование");
        vacancy3.setLocation("Новосибирск");
        vacancy3.setSalaryMin(180000);
        vacancy3.setSalaryMax(250000);
        vacancy3.setRequirements("Docker, Kubernetes, CI/CD");
        vacancy3.setEmploymentType(EmploymentType.FULL_TIME);
        vacancy3.setWorkFormat(WorkFormat.HYBRID);
        vacancy3.setExperienceLevel(ExperienceLevel.SENIOR);
        vacancy3.setIsActive(true);
        vacancy3.setRecruiter(recruiter2);
        vacancy3.setCompany(company2);
        vacancy3.setCreatedAt(LocalDateTime.now());
        vacancy3.setUpdatedAt(LocalDateTime.now());
        vacancyRepository.save(vacancy3);
        log.info("Vacancies created: {} vacancies", vacancyRepository.count());

        log.info("Data initialization completed!");
    }
}