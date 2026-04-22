package JobExchange.controller;

import JobExchange.model.dto.request.ChangeVerifyRequest;
import JobExchange.model.dto.response.CompanyDto;
import JobExchange.model.dto.response.RecruiterDto;
import JobExchange.model.dto.response.VerifyResponseDto;
import JobExchange.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final VerificationService verificationService;


    @GetMapping("/companies/pending")
    public ResponseEntity<Page<CompanyDto>> getPendingCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CompanyDto> companies = verificationService.allNonVerifiedCompanies(page, size);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/recruiters/pending")
    public ResponseEntity<Page<RecruiterDto>> getPendingRecruiters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RecruiterDto> recruiters = verificationService.allNonVerifiedRecruiters(page, size);
        return ResponseEntity.ok(recruiters);
    }

    @PostMapping("/companies/verify")
    public ResponseEntity<VerifyResponseDto> verifyCompany(@RequestBody ChangeVerifyRequest request){
        return ResponseEntity.ok(verificationService.changeCompanyVerified(request));
    }

    @PostMapping("/recruiters/verify")
    public ResponseEntity<VerifyResponseDto> verifyRecruiter(@RequestBody ChangeVerifyRequest request){
        return ResponseEntity.ok(verificationService.changeRecruiterVerified(request));
    }
}
