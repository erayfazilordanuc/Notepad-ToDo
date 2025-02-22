package notepad.Common.entities;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Embeddable;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class TimeStamps implements Serializable {

    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt() {
        setCreatedAt(LocalDateTime.now());
    }
}
