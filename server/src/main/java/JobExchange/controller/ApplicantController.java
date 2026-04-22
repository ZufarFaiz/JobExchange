package JobExchange.controller;

import JobExchange.model.dto.request.CommentCreateRequest;
import JobExchange.model.dto.request.CommentUpdateRequest;
import JobExchange.model.dto.request.ResponseCreateRequest;
import JobExchange.model.dto.response.CommentDto;
import JobExchange.model.dto.response.ResponseDto;
import JobExchange.model.entity.Applicant;
import JobExchange.service.CommentService;
import JobExchange.service.ResponseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applicant")
public class ApplicantController {
    private final ResponseService responseService;
    private final CommentService commentService;

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
}
