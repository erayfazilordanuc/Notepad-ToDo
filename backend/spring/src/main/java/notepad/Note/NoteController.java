package notepad.Note;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import notepad.Note.dtos.NoteDTO;
import notepad.Note.entities.Note;
import notepad.Note.repositories.NoteRepository;
import notepad.Note.services.NoteService;
import notepad.User.entities.User;

@RestController
@RequestMapping("api/note")
@Tags(value = @Tag(name = "Note Operations"))
public class NoteController {

    @Autowired
    public NoteService noteService;

    @Autowired
    public NoteRepository noteRepo;

    @PostMapping
    public Note createNote(@RequestBody NoteDTO noteDTO, @AuthenticationPrincipal User user) {
        if (!Objects.equals(user.getId(),
                noteDTO.getAuthorId())) {
            throw new Error("You can't create a note for someone else");
        }

        Note note = noteService.createNote(noteDTO);

        return note;
    }

    @GetMapping("/{id}")
    public Note getNoteById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Note note = noteRepo.findById(id).get();

        if (!Objects.equals(id, note.getId())) {
            throw new Error("This not is not yours");
        }

        return note;
    }

    @GetMapping("/author/{authorId}")
    public List<Note> getNoteByAuthorId(@PathVariable Long authorId, @AuthenticationPrincipal User user) {
        if (!Objects.equals(user.getId(),
                authorId)) {
            throw new Error("You can't see notes for someone else");
        }

        List<Note> notes = noteRepo.findAllByAuthorId(authorId);

        return notes;
    }

    @PostMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody NoteDTO noteDTO, @AuthenticationPrincipal User user) {
        if (!Objects.equals(user.getId(),
                noteDTO.getAuthorId())) {
            throw new Error("This note is not yours");
        }

        Note note = noteService.updateNote(id, noteDTO, user.getId());

        return note;
    }

    @DeleteMapping("/{id}")
    public String deleteNoteById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Note note = noteRepo.findById(id).get();

        if (!Objects.equals(id, note.getId())) {
            throw new Error("This not is not yours");
        }

        noteRepo.delete(note);

        return "Note with id " + note.getId() + " deleted";
    }

    @DeleteMapping
    public String deleteNotesByIds(@RequestBody List<Long> ids, @AuthenticationPrincipal User user) {
        System.out.println("NAHANDA");
        System.out.println(ids);
        ids.stream()
                .map(noteRepo::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .peek(note -> {
                    if (!Objects.equals(note.getAuthor().getId(), user.getId())) {
                        throw new RuntimeException("This note is not yours");
                    }
                })
                .forEach(noteRepo::delete);

        return "Notes deleted successfully";
    }
}
