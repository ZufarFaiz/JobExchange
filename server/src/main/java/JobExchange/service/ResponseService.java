package JobExchange.service;

import JobExchange.exception.*;
import JobExchange.model.dto.request.ResponseCreateRequest;
import JobExchange.model.dto.request.ResponseStatusUpdateRequest;
import JobExchange.model.dto.response.ResponseDto;
import JobExchange.model.entity.Applicant;
import JobExchange.model.entity.Response;
import JobExchange.model.entity.Vacancy;
import JobExchange.model.enums.ResponseStatus;
import JobExchange.repository.ApplicantRepository;
import JobExchange.repository.ResponseRepository;
import JobExchange.repository.VacancyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final VacancyRepository vacancyRepository;
    private final ApplicantRepository applicantRepository;

    @Transactional
    public ResponseDto createResponse(ResponseCreateRequest request, Long applicantId) {
        Vacancy vacancy = vacancyRepository.findById(request.getVacancyId())
                .orElseThrow(() -> new VacancyNotFoundException(request.getVacancyId()));

        if (!vacancy.getIsActive()) {
            throw new VacancyNotActiveException(vacancy.getId());
        }

        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ApplicantNotFoundException(applicantId));

        if (responseRepository.existsByApplicantAndVacancy(applicant, vacancy)) {
            throw new DuplicateResponseException();
        }

        Response response = new Response();
        response.setApplicant(applicant);
        response.setCoverLetter(request.getCoverLetter());
        response.setStatus(ResponseStatus.PENDING);

        Response saved = responseRepository.save(response);
        return toDto(saved);
    }

    @Transactional
    public ResponseDto updateStatus(Long responseId, ResponseStatusUpdateRequest request, Long recruiterId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResponseNotFoundException(responseId));

        if (!response.getVacancy().getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseAccessDeniedException();
        }

        response.setStatus(request.getStatus());
        response.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == ResponseStatus.REVIEWED && response.getViewedAt() == null) {
            response.setViewedAt(LocalDateTime.now());
        }

        return toDto(responseRepository.save(response));
    }

    private ResponseDto toDto(Response response) {
        return ResponseDto.builder()
                .id(response.getId())
                .status(response.getStatus())
                .coverLetter(response.getCoverLetter())
                .createdAt(response.getCreatedAt())
                .viewedAt(response.getViewedAt())
                .vacancyId(response.getVacancy().getId())
                .vacancyTitle(response.getVacancy().getTitle())
                .vacancyLocation(response.getVacancy().getLocation())
                .vacancySalaryMin(response.getVacancy().getSalaryMin())
                .vacancySalaryMax(response.getVacancy().getSalaryMax())
                .companyId(response.getVacancy().getCompany().getId())
                .companyTitle(response.getVacancy().getCompany().getTitle())
                .applicantId(response.getApplicant().getId())
                .applicantName(response.getApplicant().getFirstName() + " " + response.getApplicant().getLastName())
                .applicantEmail(response.getApplicant().getEmail())
                .applicantResumeUrl(response.getApplicant().getResumeUrl())
                .build();
    }
}