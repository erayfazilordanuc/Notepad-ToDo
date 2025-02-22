package notepad.Game.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BoardDTO {

    Long gameId;
    String message;
    String[][] board;
    String[][] solvedBoard;
}
