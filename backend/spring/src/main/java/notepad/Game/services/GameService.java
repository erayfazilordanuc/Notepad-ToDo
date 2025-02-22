package notepad.Game.services;

import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import notepad.Game.dtos.BoardDTO;
import notepad.Game.entities.Game;
import notepad.Game.mappers.BoardMapper;
import notepad.Game.repositories.GameRepository;
import notepad.User.entities.User;
import notepad.User.repositories.UserRepository;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private BoardService boardService;

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private UserRepository userRepo;

    public BoardDTO initGame(Long room, User user) throws Exception {
        Game game = gameRepo.findByRoomAndIsFinished(room, false);

        if (Objects.isNull(game)) {
            game = new Game(null, room, user.getId(), null, null, false, false, false, null);
            gameRepo.save(game);

            return new BoardDTO(null, "Player joined to the game", null, null);
        }

        if (Objects.isNull(game.getPlayer2Id())) {
            if (Objects.equals(user.getId(), game.getPlayer1Id())) {
                throw new Exception("You are already in this room");
            }

            game.setPlayer2Id(user.getId());
            gameRepo.save(game);
        } else {
            throw new Exception("Game is full");
        }

        if (!Objects.isNull(game.getPlayer1Id()) && !Objects.isNull(game.getPlayer2Id())) {
            if (Objects.equals(game.getPlayer1Id(), user.getId()) || Objects.equals(game.getPlayer2Id(), user.getId())) {
                BoardDTO boardDTO = boardService.createBoard(25);

                String boardString = boardMapper.arrayToString(boardDTO.getSolvedBoard());

                game.setBoard(boardString);
                gameRepo.save(game);

                return boardDTO;
            } else {
                throw new Exception("This game is not yours");
            }
        } else {
            throw new Exception("Players are not ready");
        }
    }

    public BoardDTO quickGame(Long room) throws Exception {
        Game game = gameRepo.findByRoomAndIsQuick(room, true);

        User user = new User();

        userRepo.save(user);

        if (Objects.isNull(game)) {
            game = new Game(null, room, user.getId(), null, null, false, false, true, null);
            gameRepo.save(game);

            return new BoardDTO(null, "Player joined to the game", null, null);
        }

        if (Objects.isNull(game.getPlayer2Id())) {
            if (Objects.equals(user.getId(), game.getPlayer1Id())) {
                throw new Exception("You are already in this room");
            }

            game.setPlayer2Id(user.getId());
            gameRepo.save(game);
        } else {
            throw new Exception("Game is full");
        }

        if (!Objects.isNull(game.getPlayer1Id()) && !Objects.isNull(game.getPlayer2Id())) {
            if (Objects.equals(game.getPlayer1Id(), user.getId()) || Objects.equals(game.getPlayer2Id(), user.getId())) {
                BoardDTO boardDTO = boardService.createBoard(30);

                String boardString = boardMapper.arrayToString(boardDTO.getSolvedBoard());

                game.setBoard(boardString);
                gameRepo.save(game);

                boardDTO.setGameId(game.getId());

                return boardDTO;
            } else {
                throw new Exception("This game is not yours");
            }
        } else {
            throw new Exception("Players are not ready");
        }
    }

    public String finishGame(Long gameId, User user) {
        Game game = gameRepo.findById(gameId).get();

        if (Objects.equals(game.getPlayer1Id(), user.getId()) || Objects.equals(game.getPlayer2Id(), user.getId())) {
            game.setIsFinished(true);

            return "Game \"" + gameId + "\" set to finished";
        } else {
            return "Game is not yours";
        }
    }

    public BoardDTO getABoard(int difficulty) {
        BoardDTO boardDTO = boardService.createBoard(difficulty);

        return boardDTO;
    }

    public String deleteGame(Long gameId, User user) {
        Game game;
        if (Objects.nonNull(gameRepo.findById(gameId))) {
            game = gameRepo.findById(gameId).get();

            if (Objects.equals(game.getPlayer1Id(), user.getId()) || Objects.equals(game.getPlayer2Id(), user.getId())) {
                gameRepo.delete(game);

                return "Game \"" + gameId + "\" deleted";
            } else {
                return "Game is not yours";
            }
        }

        return "There is no game with that id";
    }

    public String deleteQuickGame(Long gameId) {
        if (Objects.nonNull(gameRepo.findByGameIdAndIsQuick(gameId, true))) {
            Game game = gameRepo.findByGameIdAndIsQuick(gameId, true);
            gameRepo.delete(game);

            return "Game \"" + gameId + "\" deleted";
        }

        return "There is no room with that id";
    }
}
