package notepad.Common.validation.login;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = LoginRequestDTOValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidLoginRequestDTO {

    String message() default "There must be username or email";

    String username();

    String email();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
