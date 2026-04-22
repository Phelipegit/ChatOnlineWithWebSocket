package PhelipeProject.ChatOnlineWithWebSocket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
public class EntityMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String message;

    private LocalDateTime localDateTime;

    public EntityMessage(String message) {
        this.message = message;
        this.localDateTime = LocalDateTime.now();
    }

    public EntityMessage() {

    }
}
