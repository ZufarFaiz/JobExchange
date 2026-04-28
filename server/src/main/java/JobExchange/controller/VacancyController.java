package JobExchange.controller;

import JobExchange.model.dto.request.VacancyFilterRequest;
import JobExchange.model.dto.response.ShortVacancyDto;
import JobExchange.model.dto.response.VacancyDto;
import JobExchange.service.VacancyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacancies")
public class VacancyController {
    private final VacancyService vacancyService;

    @GetMapping
    public ResponseEntity<Page<ShortVacancyDto>> getAllVacancies(@PageableDefault(size = 10, sort = "createdAt") Pageable pageable){
        return ResponseEntity.ok(vacancyService.getAllVacancies(pageable));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<ShortVacancyDto>> getVacanciesWithFilters(
            @RequestBody(required = false) VacancyFilterRequest filters,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        return ResponseEntity.ok(vacancyService.getAllVacanciesWithFilters(filters, pageable));
    }

    @GetMapping("/{vacancyId}")
    public ResponseEntity<VacancyDto> getVacancy(@PathVariable Long vacancyId){
        return ResponseEntity.ok(vacancyService.getVacancy(vacancyId));
    }
}
