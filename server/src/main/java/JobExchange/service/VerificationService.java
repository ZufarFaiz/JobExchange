package JobExchange.service;

import JobExchange.exception.CompanyNotFoundException;
import JobExchange.exception.CompanyNotVerifiedForRecruiterException;
import JobExchange.exception.DuplicateVerificationException;
import JobExchange.exception.UserNotFoundException;
import JobExchange.model.dto.request.ChangeVerifyRequest;
import JobExchange.model.dto.response.CompanyDto;
import JobExchange.model.dto.response.RecruiterDto;
import JobExchange.model.dto.response.VerifyResponseDto;
import JobExchange.model.entity.Company;
import JobExchange.model.entity.Recruiter;
import JobExchange.repository.CompanyRepository;
import JobExchange.repository.RecruiterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class VerificationService {
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;

    public Page<CompanyDto> allNonVerifiedCompanies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Company> companyPage = companyRepository.findByIsVerified(false, pageable);

        return companyPage.map(company -> CompanyDto.builder()
                .id(company.getId())
                .title(company.getTitle())
                .taxId(company.getTaxId())
                .description(company.getDescription())
                .location(company.getLocation())
                .isVerified(company.getIsVerified())
                .build());
    }

    public Page<RecruiterDto> allNonVerifiedRecruiters(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Recruiter> recruiterPage = recruiterRepository.findByIsVerified(false, pageable);

        return recruiterPage.map(recruiter -> RecruiterDto.builder()
                .id(recruiter.getId())
                .email(recruiter.getEmail())
                .phoneNumber(recruiter.getPhoneNumber())
                .lastName(recruiter.getLastName())
                .firstName(recruiter.getFirstName())
                .companyTitle(recruiter.getCompany().getTitle())
                .isVerified(recruiter.getIsVerified())
                .build());
    }


    @Transactional
    public VerifyResponseDto changeCompanyVerified(ChangeVerifyRequest request) {
        Company company = companyRepository.findById(request.getId())
                .orElseThrow(() -> new CompanyNotFoundException(request.getId()));

        if (company.getIsVerified().equals(request.getVerify())) {
            throw new DuplicateVerificationException(
                    "Company",
                    request.getVerify()
            );
        }

        company.setIsVerified(request.getVerify());

        return VerifyResponseDto.builder()
                .id(company.getId())
                .type("COMPANY")
                .title(company.getTitle())
                .verified(company.getIsVerified())
                .message(request.getVerify()
                        ? "Company verified successfully"
                        : "Company rejected successfully")
                .build();
    }

    @Transactional
    public VerifyResponseDto changeRecruiterVerified(ChangeVerifyRequest request) {
        Recruiter recruiter = recruiterRepository.findById(request.getId())
                .orElseThrow(() -> new UserNotFoundException(request.getId()));

        if (recruiter.getIsVerified().equals(request.getVerify())) {
            throw new DuplicateVerificationException("Recruiter",request.getVerify());
        }

        if (request.getVerify() && !recruiter.getCompany().getIsVerified()) {
            throw new CompanyNotVerifiedForRecruiterException();
        }

        recruiter.setIsVerified(request.getVerify());

        return VerifyResponseDto.builder()
                .id(recruiter.getId())
                .type("RECRUITER")
                .title(recruiter.getFirstName() + " " + recruiter.getLastName())
                .email(recruiter.getEmail())
                .verified(recruiter.getIsVerified())
                .message(request.getVerify()
                        ? "Recruiter verified successfully"
                        : "Recruiter rejected successfully")
                .build();
    }
}
