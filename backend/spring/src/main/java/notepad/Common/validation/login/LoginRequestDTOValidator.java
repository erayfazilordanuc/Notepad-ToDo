package notepad.Common.validation.login;

import org.springframework.beans.BeanWrapperImpl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class LoginRequestDTOValidator implements
        ConstraintValidator<ValidLoginRequestDTO, Object> {

    // private String username;
    // private String email;
    // @Override
    // public void initialize(ValidLoginRequestDTO loginRequestDTO) {
    //   this.username = loginRequestDTO.username();
    //   this.email = loginRequestDTO.email();
    // }
    @Override
    public boolean isValid(Object value,
            ConstraintValidatorContext cxt) {
        Object usernameValue = new BeanWrapperImpl(value).getPropertyValue("username");

        Object emailValue = new BeanWrapperImpl(value).getPropertyValue("email");

        return usernameValue != null || emailValue != null;
    }
}
