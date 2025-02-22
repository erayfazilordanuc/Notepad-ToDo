package notepad.Game.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import notepad.Game.entities.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    public Game findByRoom(Long room);

    public Game findByPlayer1Id(Long player1Id);

    public Game findByPlayer2Id(Long player2Id);

    @Query("SELECT game from Game game WHERE game.room = :room AND game.isFinished = :isFinished")
    public Game findByRoomAndIsFinished(Long room, Boolean isFinished);

    @Query("SELECT game from Game game WHERE game.room = :room AND game.isQuick = :isQuick")
    public Game findByRoomAndIsQuick(Long room, Boolean isQuick);

    @Query("SELECT game from Game game WHERE game.id = :gameId AND game.isFinished = :isFinished")
    public Game findByGmaeIdAndIsFinished(Long gameId, Boolean isFinished);

    @Query("SELECT game from Game game WHERE game.id = :gameId AND game.isQuick = :isQuick")
    public Game findByGameIdAndIsQuick(Long gameId, Boolean isQuick);
}
