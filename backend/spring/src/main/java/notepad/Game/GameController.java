// package notepad.Game;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import io.swagger.v3.oas.annotations.tags.Tag;
// import io.swagger.v3.oas.annotations.tags.Tags;
// import notepad.Game.dtos.BoardDTO;
// import notepad.Game.services.GameService;
// import notepad.User.entities.User;

// @RestController
// @RequestMapping("api/game")
// @Tags(value = @Tag(name = "Game Operations"))
// public class GameController {

//     @Autowired
//     public GameService gameService;

//     @PostMapping("/init")
//     public BoardDTO joinGame(@RequestParam Long room, @AuthenticationPrincipal User user) throws Exception {
//         BoardDTO boardDTO = gameService.initGame(room, user);

//         return boardDTO;
//     }

//     @PostMapping("/quick")
//     public BoardDTO joinQuickGame(@RequestParam Long room) throws Exception {
//         BoardDTO boardDTO = gameService.quickGame(room);

//         return boardDTO;
//     }

//     @PutMapping("/finish")
//     public String finishGame(@RequestParam Long room, @AuthenticationPrincipal User user) throws Exception {
//         String response = gameService.finishGame(room, user);

//         return response;
//     }

//     @GetMapping("/board")
//     public BoardDTO getABoard(@RequestParam int difficulty) {
//         BoardDTO boardDTO = gameService.getABoard(difficulty);

//         return boardDTO;
//     }

//     @DeleteMapping
//     public String deleteGame(@RequestParam Long gameId, @AuthenticationPrincipal User user) {
//         String response = gameService.deleteGame(gameId, user);

//         return response;
//     }

//     @DeleteMapping("/quick")
//     public String deleteQuickGame(@RequestParam Long gameId) throws Exception {
//         String response = gameService.deleteQuickGame(gameId);

//         return response;
//     }
// }
