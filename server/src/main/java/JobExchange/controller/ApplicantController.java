package JobExchange.controller;

import JobExchange.model.dto.request.CommentCreateRequest;
import JobExchange.model.dto.request.CommentUpdateRequest;
import JobExchange.model.dto.request.ResponseCreateRequest;
import JobExchange.model.dto.request.UpdateProfileRequest;
import JobExchange.model.dto.response.ApplicantProfileDto;
import JobExchange.model.dto.response.CommentDto;
import JobExchange.model.dto.response.ResponseDto;
import JobExchange.model.entity.Applicant;
import JobExchange.service.ApplicantService;
import JobExchange.service.CommentService;
import JobExchange.service.ResponseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applicant")
public class ApplicantController {
    private final ResponseService responseService;
    private final CommentService commentService;
    private final ApplicantService applicantService;

    @PostMapping("/responses")
    public ResponseEntity<ResponseDto> createResponse(@AuthenticationPrincipal Applicant applicant,
                                                     @Valid @RequestBody ResponseCreateRequest request){
        return ResponseEntity.ok(responseService.createResponse(request,applicant.getId()));
    }

    @PostMapping("/comments")
    public ResponseEntity<CommentDto> createComment(@AuthenticationPrincipal Applicant applicant,
                                                    @Valid @RequestBody CommentCreateRequest request){
        return ResponseEntity.ok(commentService.createComment(request,applicant.getId()));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDto> updateComment(@AuthenticationPrincipal Applicant applicant,
                                                    @Valid @RequestBody CommentUpdateRequest request,
                                                    @PathVariable Long commentId){
        return ResponseEntity.ok(commentService.updateComment(commentId,request,applicant.getId()));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@AuthenticationPrincipal Applicant applicant,
                                           @PathVariable Long commentId){
        return ResponseEntity.ok(commentService.deleteComment(commentId,applicant.getId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApplicantProfileDto> getProfile(@AuthenticationPrincipal Applicant applicant) {
        return ResponseEntity.ok(applicantService.getProfile(applicant.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApplicantProfileDto> updateProfile(
            @AuthenticationPrincipal Applicant applicant,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(applicantService.updateProfile(applicant.getId(), request));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicantProfileDto> uploadResume(@AuthenticationPrincipal Applicant applicant,
                                                            @RequestParam("file")MultipartFile file){
        return ResponseEntity.ok(applicantService.storeResume(file,applicant.getId()));
    }

    @GetMapping("/resume")
    public ResponseEntity<?> viewResume(@AuthenticationPrincipal Applicant applicant){
         return applicantService.getResume(applicant.getId());
    }

    @DeleteMapping("/resume")
    public ResponseEntity<ApplicantProfileDto> deleteResume(@AuthenticationPrincipal Applicant applicant){
        return ResponseEntity.ok(applicantService.deleteResume(applicant.getId()));
    }

    @PostMapping(value = "/avatar",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicantProfileDto> uploadAvatar(@AuthenticationPrincipal Applicant applicant,
                                                            @RequestParam("file")MultipartFile file){
        return ResponseEntity.ok(applicantService.storeAvatar(file,applicant.getId()));
    }
}
