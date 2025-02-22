package notepad.Game.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import notepad.Game.dtos.BoardDTO;
import notepad.Game.entities.notepad;
import notepad.Game.mappers.BoardMapper;

@Service
public class BoardService {

    @Autowired
    private BoardMapper boardMapper;

    public BoardDTO createBoard(int difficulty) {
        notepad notepad = new notepad(9, difficulty);

        notepad.createBoard();

        String[][] board = boardMapper.intToStringArray(notepad.getBoard());
        String[][] solvedBoard = boardMapper.intToStringArray(notepad.getSolvedBoard());

        BoardDTO boardDTO = new BoardDTO(null, null, board, solvedBoard);

        return boardDTO;
    }

}
