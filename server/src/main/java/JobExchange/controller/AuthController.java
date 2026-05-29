package JobExchange.controller;

import JobExchange.model.dto.request.ApplicantRegisterRequest;
import JobExchange.model.dto.request.LoginRequest;
import JobExchange.model.dto.request.RecruiterRegisterRequest;
import JobExchange.model.dto.response.AuthResponse;
import JobExchange.model.entity.User;
import JobExchange.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Map<String,String>> logout(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(authService.logout(user.getId()));
    }
}
