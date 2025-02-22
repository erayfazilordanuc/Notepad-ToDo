package notepad.Game.mappers;

import org.springframework.stereotype.Component;

@Component
public class BoardMapper {

    public String[][] stringToArray(String board) {
        String[][] boardArray = new String[9][9];

        for (int i = 0; i < 81; i += 2) {
            boardArray[i / 9][i % 9] = String.valueOf(board.charAt(i));
        }

        return boardArray;
    }

    public String arrayToString(String[][] boardArray) {
        String board = "";

        for (int i = 0; i < boardArray.length; i++) {
            for (int j = 0; j < boardArray[0].length; j++) {
                board += boardArray[i][j];
                if (!(i == boardArray.length - 1 && j == boardArray[0].length - 1)) {
                    board += ",";
                }
            }
        }

        return board;
    }

    public String[][] intToStringArray(int[][] intArray) {
        String[][] stringArray = new String[intArray.length][intArray[0].length];

        for (int i = 0; i < intArray.length; i++) {
            for (int j = 0; j < intArray[0].length; j++) {
                stringArray[i][j] = String.valueOf(intArray[i][j]);
            }
        }

        return stringArray;
    }
}
