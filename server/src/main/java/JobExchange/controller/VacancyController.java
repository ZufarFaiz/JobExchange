package JobExchange.controller;

import JobExchange.model.dto.response.ShortVacancyDto;
import JobExchange.model.dto.response.VacancyDto;
import JobExchange.service.VacancyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vacancies")
public class VacancyController {
    private final VacancyService vacancyService;

    @GetMapping
    public ResponseEntity<Page<ShortVacancyDto>> getAllVacancies(@RequestParam Pageable pageable){
        return ResponseEntity.ok(vacancyService.getAllVacancies(pageable));
    }

    @GetMapping("/{vacancyId}")
    public ResponseEntity<VacancyDto> getVacancy(@PathVariable Long vacancyId){
        return ResponseEntity.ok(vacancyService.getVacancy(vacancyId));
    }
}
