package JobExchange.service;

import JobExchange.exception.*;
import JobExchange.model.dto.request.ResponseCreateRequest;
import JobExchange.model.dto.request.ResponseStatusUpdateRequest;
import JobExchange.model.dto.response.ResponseDto;
import JobExchange.model.dto.response.ShortResponseDto;
import JobExchange.model.entity.Applicant;
import JobExchange.model.entity.Recruiter;
import JobExchange.model.entity.Response;
import JobExchange.model.entity.Vacancy;
import JobExchange.model.enums.ResponseStatus;
import JobExchange.repository.ApplicantRepository;
import JobExchange.repository.RecruiterRepository;
import JobExchange.repository.ResponseRepository;
import JobExchange.repository.VacancyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final VacancyRepository vacancyRepository;
    private final ApplicantRepository applicantRepository;
    private final RecruiterRepository recruiterRepository;
    private final ChatService chatService;

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
        response.setVacancy(vacancy);

        Response saved = responseRepository.save(response);

        String chatMessage = buildChatMessage(saved.getCoverLetter(),applicant.getFirstName(),applicant.getLastName(),vacancy.getTitle());

        try{
            chatService.createChatForResponse(
                    saved.getId(),
                    saved.getApplicant().getEmail(),
                    saved.getVacancy().getRecruiter().getEmail(),
                    chatMessage
            );
        } catch (Exception e) {
            log.error("Failed to create chat for response: {}", saved.getId(), e);
        }

        return toDto(saved);
    }

    @Transactional
    public ResponseDto updateStatus(Long responseId, ResponseStatusUpdateRequest request, Long recruiterId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResponseNotFoundException(responseId));

        if (!response.getVacancy().getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseAccessDeniedException("You don't have permission to update this response");
        }

        response.setStatus(request.getStatus());
        response.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == ResponseStatus.REVIEWED && response.getViewedAt() == null) {
            response.setViewedAt(LocalDateTime.now());
        }

        return toDto(responseRepository.save(response));
    }

    public ResponseDto getResponse(Long responseId, Long recruiterId){
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResponseNotFoundException(responseId));

        if (!response.getVacancy().getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseAccessDeniedException("You don't have permission to see this response");
        }

        return toDto(response);
    }

    public Page<ShortResponseDto> getAllResponsesByRecruiter(Long recruiterId, Pageable pageable) {
        recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(recruiterId));

        return responseRepository.findAllByRecruiterId(recruiterId, pageable)
                .map(this::shortResponseDto);
    }

    public Page<ShortResponseDto> getAllResponses(Long recruiterId, Long vacancyId, Pageable pageable){
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(recruiterId));

        Vacancy vacancy = vacancyRepository.findById(vacancyId).orElseThrow(()->new VacancyNotFoundException(vacancyId));

        if (!vacancy.getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseAccessDeniedException("You don't have permission to see this responses");
        }

        return responseRepository.findAllByVacancy(vacancy,pageable).map(this::shortResponseDto);
    }

    private ShortResponseDto shortResponseDto(Response response){
        return ShortResponseDto.builder()
                .id(response.getId())
                .createdAt(response.getCreatedAt())
                .status(response.getStatus())
                .vacancyId(response.getVacancy().getId())
                .vacancyTitle(response.getVacancy().getTitle())
                .applicantId(response.getApplicant().getId())
                .applicantName(response.getApplicant().getFirstName() + " " + response.getApplicant().getLastName())
                .build();
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

    private String buildChatMessage(String coverLetter,String firstName, String lastName, String vacancyTitle){
        String fullName = firstName + " " + lastName;

        if(coverLetter != null && !coverLetter.trim().isEmpty()){
            return fullName + " оставил(а) сопрововодительное письмо к отклику на вакансию \"" + vacancyTitle + "\":\n\n" + coverLetter;
        }
        else{
            return fullName + " откликается на вашу вакансию \"" + vacancyTitle + "\".\n\n" +
                    "Сопроводительное письмо не указано, но вы можете связаться с соискателем через этот чат.";
        }
    }
}