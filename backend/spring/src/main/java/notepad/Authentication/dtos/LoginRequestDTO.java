package notepad.Authentication.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import notepad.Common.validation.login.ValidLoginRequestDTO;

@Getter
@Setter
// This validation is for username or email login options
@ValidLoginRequestDTO(username = "username", email = "email")
public class LoginRequestDTO {

    private String username;

    private String email;

    @NotEmpty
    private String password;
}
