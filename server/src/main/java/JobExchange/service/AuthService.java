package JobExchange.service;

import JobExchange.exception.EmailAlreadyExistsException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.model.dto.request.ApplicantRegisterRequest;
import JobExchange.model.dto.request.LoginRequest;
import JobExchange.model.dto.request.RecruiterRegisterRequest;
import JobExchange.model.dto.response.AuthResponse;
import JobExchange.model.entity.*;
import JobExchange.model.enums.Role;
import JobExchange.repositroy.CompanyRepository;
import JobExchange.repositroy.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final CompanyRepository companyRepository;

    @Transactional
    public AuthResponse registerApplicant(ApplicantRegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User user = new Applicant();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_APPLICANT);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);


        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse registerRecruiter(RecruiterRegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        Company company = companyRepository.findByTaxId(request.getCompanyTaxId()).orElseGet(()->{
            Company newCompany = new Company();
            newCompany.setTaxId(request.getCompanyTaxId());
            newCompany.setTitle(request.getCompanyTitle());
            newCompany.setLocation(request.getCompanyLocation());
            newCompany.setDescription(request.getCompanyDescription());
            return companyRepository.save(newCompany);
        });

        User user = new Recruiter();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(Role.ROLE_RECRUITER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        if(user instanceof Recruiter){
            ((Recruiter)user).setCompany(company);
            userRepository.save(user);
        }

        return buildAuthResponse(user);

    }

    private AuthResponse login(LoginRequest request){
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            User user = (User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

            return buildAuthResponse(user,accessToken,refreshToken.getToken());
        }
        catch (BadCredentialsException e){
            throw e;
        }
    }

    @Transactional
    public void logout(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new UserNotFoundException(userId));

        refreshTokenService.revokedAllUserTokens(user);
    }

    private AuthResponse buildAuthResponse(User user,String accessToken, String refreshToken){
        AuthResponse authResponse = buildAuthResponse(user);
        authResponse.setAccessToken(accessToken);
        authResponse.setRefreshToken(refreshToken);

        return authResponse;
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .email(user.getEmail())
                .fistName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
