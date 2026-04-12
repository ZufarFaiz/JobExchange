package JobExchange.model.dto.response;

import JobExchange.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String fistName;
    private String lastName;
    private String email;
    private String accessToken;
    private String refreshToken;
    private Role role;
}
