package JobExchange.service;

import JobExchange.exception.ResponseAccessDeniedException;
import JobExchange.exception.ResponseNotFoundException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.model.dto.request.UpdateProfileRequest;
import JobExchange.model.dto.response.RecruiterProfileDto;
import JobExchange.model.entity.Recruiter;
import JobExchange.model.entity.Response;
import JobExchange.repository.RecruiterRepository;
import JobExchange.repository.ResponseRepository;
import JobExchange.repository.VacancyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final VacancyRepository vacancyRepository;
    private final FileStorageService fileStorageService;
    private final ResponseRepository responseRepository;

    public RecruiterProfileDto getProfile(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(recruiterId));

        Long totalVacancies = vacancyRepository.countByRecruiterId(recruiterId);
        Long activeVacancies = vacancyRepository.countByRecruiterIdAndIsActiveTrue(recruiterId);


        return RecruiterProfileDto.builder()
                .id(recruiter.getId())
                .email(recruiter.getEmail())
                .firstName(recruiter.getFirstName())
                .lastName(recruiter.getLastName())
                .phoneNumber(recruiter.getPhoneNumber())
                .avatarUrl(recruiter.getAvatarUrl())
                .isVerified(recruiter.getIsVerified())
                .createdAt(recruiter.getCreatedAt())
                .updatedAt(recruiter.getUpdatedAt())
                .companyId(recruiter.getCompany().getId())
                .companyTitle(recruiter.getCompany().getTitle())
                .companyLocation(recruiter.getCompany().getLocation())
                .companyVerified(recruiter.getCompany().getIsVerified())
                .totalVacancies(totalVacancies)
                .activeVacancies(activeVacancies)
                .build();
    }

    @Transactional
    public RecruiterProfileDto updateProfile(Long recruiterId, UpdateProfileRequest request) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(recruiterId));

        if (request.getEmail() != null) {
            recruiter.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) {
            recruiter.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            recruiter.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            recruiter.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAvatarUrl() != null) {
            recruiter.setAvatarUrl(request.getAvatarUrl());
        }

        return getProfile(recruiterId);
    }

    public RecruiterProfileDto storeAvatar(MultipartFile file, Long recruiterId){
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new UserNotFoundException(recruiterId));

        String avatarUrl = fileStorageService.storeAvatar(file,recruiterId);
        recruiter.setAvatarUrl(avatarUrl);

        Recruiter savedRecruiter = recruiterRepository.save(recruiter);
        return getProfile(savedRecruiter.getId());
    }

    public ResponseEntity<?> getResume(Long responseId, Long recruiterId, boolean download) {
        Response response = getAndValidateResponse(responseId, recruiterId);

        String resumeUrl = response.getApplicant().getResumeUrl();
        if (resumeUrl == null || resumeUrl.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.getResumeFile(resumeUrl);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = fileStorageService.getContentType(resumeUrl);
        String disposition = download ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        disposition + "; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private Response getAndValidateResponse(Long responseId, Long recruiterId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new ResponseNotFoundException(responseId));

        if (!response.getVacancy().getRecruiter().getId().equals(recruiterId)) {
            throw new ResponseAccessDeniedException("You don't have permission to update this response");
        }

        return response;
    }
}