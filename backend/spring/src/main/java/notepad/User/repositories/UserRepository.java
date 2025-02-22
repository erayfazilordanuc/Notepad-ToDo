package notepad.User.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import notepad.User.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public User findByUsername(String username);

    public User findByEmail(String email);
}
