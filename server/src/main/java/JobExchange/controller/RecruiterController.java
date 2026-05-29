package JobExchange.controller;

import JobExchange.model.dto.request.ResponseStatusUpdateRequest;
import JobExchange.model.dto.request.UpdateProfileRequest;
import JobExchange.model.dto.request.VacancyCreateRequest;
import JobExchange.model.dto.response.*;
import JobExchange.model.entity.Recruiter;
import JobExchange.service.RecruiterService;
import JobExchange.service.ResponseService;
import JobExchange.service.VacancyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruiter")
public class RecruiterController {
    private final VacancyService vacancyService;
    private final ResponseService responseService;
    private final RecruiterService recruiterService;

    @PostMapping("/add-vacancy")
    public ResponseEntity<VacancyDto> createVacancy(@AuthenticationPrincipal Recruiter recruiter,
                                                    @RequestBody VacancyCreateRequest request){
        return ResponseEntity.ok(vacancyService.createVacancy(recruiter.getId(),request));
    }

    @PutMapping("/responses/{responseId}/status")
    public ResponseEntity<ResponseDto> updateResponseStatus(@AuthenticationPrincipal Recruiter recruiter,
                                                            @PathVariable Long responseId,
                                                            @RequestBody ResponseStatusUpdateRequest request){
        return ResponseEntity.ok(responseService.updateStatus(responseId,request,recruiter.getId()));
    }

    @GetMapping("/responses")
    public ResponseEntity<Page<ShortResponseDto>> getAllResponses(@AuthenticationPrincipal Recruiter recruiter,
                                                                  @PageableDefault(size = 10)Pageable pageable){
        return ResponseEntity.ok(responseService.getAllResponsesByRecruiter(recruiter.getId(),pageable));
    }

    @GetMapping("/responses/{responseId}")
    public ResponseEntity<ResponseDto> getResponse(@AuthenticationPrincipal Recruiter recruiter,
                                                   @PathVariable Long responseId){
        return ResponseEntity.ok(responseService.getResponse(responseId,recruiter.getId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(@AuthenticationPrincipal Recruiter recruiter) {
        return ResponseEntity.ok(recruiterService.getProfile(recruiter.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            @AuthenticationPrincipal Recruiter recruiter,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(recruiterService.updateProfile(recruiter.getId(), request));
    }

    @PostMapping(value = "/avatar",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecruiterProfileDto> storeAvatar(@AuthenticationPrincipal Recruiter recruiter,
                                                           @RequestParam("file")MultipartFile file){
        return ResponseEntity.ok(recruiterService.storeAvatar(file,recruiter.getId()));
    }

    @GetMapping("/responses/{responseId}/resume")
    public ResponseEntity<?> viewResume(
            @AuthenticationPrincipal Recruiter recruiter,
            @PathVariable Long responseId) {
        return recruiterService.getResume(responseId, recruiter.getId(),false);
    }

    @GetMapping("/responses/{responseId}/resume/download")
    public ResponseEntity<?> downloadResume(
            @AuthenticationPrincipal Recruiter recruiter,
            @PathVariable Long responseId) {
        return recruiterService.getResume(responseId, recruiter.getId(),true);
    }
}
