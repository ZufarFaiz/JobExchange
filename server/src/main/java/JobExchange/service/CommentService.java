package JobExchange.service;

import JobExchange.exception.CommentAccessDeniedException;
import JobExchange.exception.CommentNotFoundException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.exception.VacancyNotFoundException;
import JobExchange.model.dto.request.CommentCreateRequest;
import JobExchange.model.dto.request.CommentUpdateRequest;
import JobExchange.model.dto.response.CommentDto;
import JobExchange.model.entity.Applicant;
import JobExchange.model.entity.Comment;
import JobExchange.model.entity.Vacancy;
import JobExchange.repository.ApplicantRepository;
import JobExchange.repository.CommentRepository;
import JobExchange.repository.VacancyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final ApplicantRepository applicantRepository;
    private final VacancyRepository vacancyRepository;

    @Transactional
    public CommentDto createComment(CommentCreateRequest request,Long applicantId){
        Applicant applicant = applicantRepository.findById(applicantId).orElseThrow(()-> new UserNotFoundException(applicantId));

        Vacancy vacancy = vacancyRepository.findById(request.getVacancyId()).orElseThrow(()->
                new VacancyNotFoundException(request.getVacancyId()));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        comment.setVacancy(vacancy);
        comment.setApplicant(applicant);

        Comment saved = commentRepository.save(comment);

        return toDto(saved);
    }

    @Transactional
    public CommentDto updateComment(Long commentId, CommentUpdateRequest request, Long applicantId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getApplicant().getId().equals(applicantId)) {
            throw new CommentAccessDeniedException("update");
        }


        if (request.getRating() != null) {
            comment.setRating(request.getRating());
        }
        comment.setUpdatedAt(LocalDateTime.now());

        return toDto(commentRepository.save(comment));
    }

    @Transactional
    public Map<String, String> deleteComment(Long commentId, Long applicantId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getApplicant().getId().equals(applicantId)) {
            throw new CommentAccessDeniedException("delete");
        }

        commentRepository.delete(comment);

        return Map.of(
                "message", "Comment deleted successfully",
                "commentId", String.valueOf(commentId)
        );
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .rating(comment.getRating())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .applicantId(comment.getApplicant().getId())
                .applicantName(comment.getApplicant().getFirstName() + " " + comment.getApplicant().getLastName())
                .applicantEmail(comment.getApplicant().getEmail())
                .vacancyId(comment.getVacancy().getId())
                .vacancyTitle(comment.getVacancy().getTitle())
                .companyName(comment.getVacancy().getCompany().getTitle())
                .build();
    }
}
