package JobExchange.exception;

import org.springframework.http.HttpStatus;

public class RefreshTokenExpiredException extends ApiException {
    public RefreshTokenExpiredException() {
        super(
                HttpStatus.UNAUTHORIZED,
                "REFRESH_TOKEN_EXPIRED",
                "Refresh token has expired. Please login again"
        );
    }
}