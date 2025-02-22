package notepad.Note.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import notepad.Note.entities.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    public Note findByTitle(String title);

    @Query("SELECT note FROM Note note WHERE note.author.id = :authorId ORDER BY note.updatedAt DESC")
    public List<Note> findAllByAuthorId(Long authorId);
}
