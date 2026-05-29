package JobExchange.service;

import JobExchange.exception.UserNotFoundException;
import JobExchange.model.dto.request.UpdateProfileRequest;
import JobExchange.model.dto.response.ApplicantProfileDto;
import JobExchange.model.entity.Applicant;
import JobExchange.repository.ApplicantRepository;
import JobExchange.repository.ResponseRepository;
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
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final ResponseRepository responseRepository;
    private final FileStorageService fileStorageService;

    public ApplicantProfileDto getProfile(Long applicantId) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        Long totalResponses = responseRepository.countByApplicantId(applicantId);

        return ApplicantProfileDto.builder()
                .id(applicant.getId())
                .email(applicant.getEmail())
                .firstName(applicant.getFirstName())
                .lastName(applicant.getLastName())
                .phoneNumber(applicant.getPhoneNumber())
                .avatarUrl(applicant.getAvatarUrl())
                .resumeUrl(applicant.getResumeUrl())
                .createdAt(applicant.getCreatedAt())
                .updatedAt(applicant.getUpdatedAt())
                .totalResponses(totalResponses)
                .build();
    }

    @Transactional
    public ApplicantProfileDto updateProfile(Long applicantId, UpdateProfileRequest request) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        if (request.getEmail() != null) {
            applicant.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) {
            applicant.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            applicant.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            applicant.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAvatarUrl() != null) {
            applicant.setAvatarUrl(request.getAvatarUrl());
        }

        return getProfile(applicantId);
    }

    public ApplicantProfileDto storeResume(MultipartFile file, Long applicantId){
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        String resumeUrl = fileStorageService.storeResume(file, applicantId);
        applicant.setResumeUrl(resumeUrl);

        Applicant savedApplicant = applicantRepository.save(applicant);
        return getProfile(savedApplicant.getId());
    }

    public ApplicantProfileDto storeAvatar(MultipartFile file, Long applicantId){
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        String avatarUrl = fileStorageService.storeAvatar(file,applicantId);
        applicant.setAvatarUrl(avatarUrl);

        Applicant savedApplicant = applicantRepository.save(applicant);
        return getProfile(savedApplicant.getId());
    }

    public ApplicantProfileDto deleteResume(Long applicantId){
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        if (applicant.getResumeUrl() != null && !applicant.getResumeUrl().isEmpty()) {
            fileStorageService.deleteResume(applicant.getResumeUrl());
            applicant.setResumeUrl(null);
        }
        Applicant savedApplicant = applicantRepository.save(applicant);

        return getProfile(savedApplicant.getId());
    }

    public ResponseEntity<?> getResume(Long applicantId) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new UserNotFoundException(applicantId));

        String resumeUrl = applicant.getResumeUrl();

        if (resumeUrl == null || resumeUrl.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.getResumeFile(resumeUrl);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = fileStorageService.getContentType(resumeUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")  // ← исправлено
                .body(resource);
    }
}