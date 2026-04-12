package JobExchange.controller;

import JobExchange.model.dto.request.ApplicantRegisterRequest;
import JobExchange.model.dto.request.RecruiterRegisterRequest;
import JobExchange.model.dto.response.AuthResponse;
import JobExchange.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register/applicant")
    public ResponseEntity<AuthResponse> registerApplicant(@RequestBody ApplicantRegisterRequest request){
        return ResponseEntity.ok(authService.registerApplicant(request));
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<AuthResponse> registerRecruiter(@RequestBody RecruiterRegisterRequest request){
        return ResponseEntity.ok(authService.registerRecruiter(request));
    }
}
