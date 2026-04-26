package JobExchange.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateProfileRequest {

    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Size(min = 10, max = 20, message = "Phone number must be between 10 and 20 characters")
    private String phoneNumber;

    private String avatarUrl;
}