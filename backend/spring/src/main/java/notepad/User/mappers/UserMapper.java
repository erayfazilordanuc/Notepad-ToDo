package notepad.User.mappers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import notepad.User.dtos.UserDTO;
import notepad.User.entities.User;

@Component
public class UserMapper {

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User DTOToEntity(UserDTO userDTO, User user) {
        User userEntity = new User(user.getId(), userDTO.getUsername(), userDTO.getEmail(),
                passwordEncoder.encode(userDTO.getPassword()));

        return userEntity;
    }
}
