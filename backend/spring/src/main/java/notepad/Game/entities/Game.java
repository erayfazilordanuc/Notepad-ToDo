package notepad.Game.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "games")
@AllArgsConstructor

@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long room;

    @Column(name = "player1_id")
    private Long player1Id;

    @Column(name = "player2_id")
    private Long player2Id;

    @Column
    private String board;

    @Column(name = "is_started")
    private Boolean isStarted = false;

    @Column(name = "is_finished")
    private Boolean isFinished = false;

    @Column(name = "is_quick")
    private Boolean isQuick = false;

    @Column(name = "winner_id")
    private Long winnerId;
}
