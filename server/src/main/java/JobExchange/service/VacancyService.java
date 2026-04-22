package JobExchange.service;

import JobExchange.exception.CompanyNotVerifiedException;
import JobExchange.exception.RecruiterNotVerifiedException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.exception.VacancyNotFoundException;
import JobExchange.model.dto.request.VacancyCreateRequest;
import JobExchange.model.dto.response.CommentDto;
import JobExchange.model.dto.response.ShortVacancyDto;
import JobExchange.model.dto.response.VacancyDto;
import JobExchange.model.entity.Comment;
import JobExchange.model.entity.Recruiter;
import JobExchange.model.entity.Vacancy;
import JobExchange.repository.CommentRepository;
import JobExchange.repository.RecruiterRepository;
import JobExchange.repository.VacancyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacancyService {
    private final VacancyRepository vacancyRepository;
    private final RecruiterRepository recruiterRepository;
    private final CommentRepository commentRepository;

    public VacancyDto createVacancy(Long recruiterId, VacancyCreateRequest request){
        Recruiter recruiter = recruiterRepository.findById(recruiterId).orElseThrow(()-> new UserNotFoundException(recruiterId));
        if (!recruiter.getIsVerified()) {
            throw new RecruiterNotVerifiedException(recruiterId);
        }

        if (!recruiter.getCompany().getIsVerified()) {
            throw new CompanyNotVerifiedException(recruiter.getCompany().getId());
        }

        Vacancy vacancy = new Vacancy();
        vacancy.setCompany(recruiter.getCompany());
        vacancy.setRecruiter(recruiter);
        vacancy.setTitle(request.getTitle());
        vacancy.setDescription(request.getDescription());
        vacancy.setSalaryMax(request.getSalaryMax());
        vacancy.setSalaryMin(request.getSalaryMin());
        vacancy.setLocation(request.getLocation());
        vacancy.setRequirements(request.getRequirements());
        vacancy.setWorkFormat(request.getWorkFormat());
        vacancy.setEmploymentType(request.getEmploymentType());
        vacancy.setExperienceLevel(request.getExperienceLevel());

        Vacancy savedVacancy = vacancyRepository.save(vacancy);
        return toFullVacancyDto(savedVacancy);
    }

    public Page<ShortVacancyDto> getAllVacancies(Pageable pageable){
        return vacancyRepository.findAll(pageable)
                .map(this::toShortVacancyDto);
    }

    public VacancyDto getVacancy(Long vacancyId){
        Vacancy vacancy = vacancyRepository.findById(vacancyId).orElseThrow(()-> new VacancyNotFoundException(vacancyId));
        List<Comment> comments = commentRepository.findByVacancy(vacancy);
        return toFullVacancyDto(vacancy,comments);
    }

    private ShortVacancyDto toShortVacancyDto(Vacancy vacancy) {
        return ShortVacancyDto.builder()
                .id(vacancy.getId())
                .title(vacancy.getTitle())
                .location(vacancy.getLocation())
                .salaryMin(vacancy.getSalaryMin())
                .salaryMax(vacancy.getSalaryMax())
                .employmentType(vacancy.getEmploymentType())
                .workFormat(vacancy.getWorkFormat())
                .experienceLevel(vacancy.getExperienceLevel())
                .companyTitle(vacancy.getCompany().getTitle())
                .build();
    }

    private VacancyDto toFullVacancyDto(Vacancy vacancy, List<Comment> comments){
        VacancyDto vacancyDto = toFullVacancyDto(vacancy);
        vacancyDto.setComments(comments.stream()
                .map(comment -> CommentDto.builder()
                        .id(comment.getId())
                        .applicantEmail(comment.getApplicant().getEmail())
                        .applicantName(comment.getApplicant().getFirstName() + " " + comment.getApplicant().getLastName())
                        .content(comment.getContent())
                        .rating(comment.getRating())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .isEdited(!(comment.getCreatedAt()==comment.getUpdatedAt()))
                        .build()
                )
                .toList());
        return vacancyDto;
    }
    private VacancyDto toFullVacancyDto(Vacancy vacancy){
        return VacancyDto.builder()
                .id(vacancy.getId())
                .title(vacancy.getTitle())
                .location(vacancy.getLocation())
                .salaryMin(vacancy.getSalaryMin())
                .salaryMax(vacancy.getSalaryMax())
                .employmentType(vacancy.getEmploymentType())
                .workFormat(vacancy.getWorkFormat())
                .experienceLevel(vacancy.getExperienceLevel())
                .companyTitle(vacancy.getCompany().getTitle())
                .companyLocation(vacancy.getCompany().getLocation())
                .recruiterName(vacancy.getRecruiter().getFirstName() + " " + vacancy.getRecruiter().getLastName())
                .requirements(vacancy.getRequirements())
                .description(vacancy.getDescription())
                .companyId(vacancy.getCompany().getId())
                .recruiterEmail(vacancy.getRecruiter().getEmail())
                .recruiterId(vacancy.getRecruiter().getId())
                .createdAt(vacancy.getCreatedAt())
                .updatedAt(vacancy.getUpdatedAt())
                .isActive(vacancy.getIsActive())
                .build();
    }
}
