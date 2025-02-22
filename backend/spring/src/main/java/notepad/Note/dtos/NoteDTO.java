package notepad.Note.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NoteDTO {

    private String title;

    private String content;

    private Long authorId;
}
