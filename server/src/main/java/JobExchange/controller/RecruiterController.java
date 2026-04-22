package JobExchange.controller;

import JobExchange.model.dto.request.ResponseStatusUpdateRequest;
import JobExchange.model.dto.request.VacancyCreateRequest;
import JobExchange.model.dto.response.ResponseDto;
import JobExchange.model.dto.response.VacancyDto;
import JobExchange.model.entity.Recruiter;
import JobExchange.service.ResponseService;
import JobExchange.service.VacancyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruiter")
public class RecruiterController {
    private final VacancyService vacancyService;
    private final ResponseService responseService;

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
}
