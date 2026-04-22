package PhelipeProject.ChatOnlineWithWebSocket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Entity
@Getter
public class EntityMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String usuario;

    private String message;

    private LocalDateTime localDateTime;

    public EntityMessage(String usuario,String message) {
        this.usuario = usuario;
        this.message = message;
        this.localDateTime = LocalDateTime.now(ZoneId.of("America/Campo_Grande"));
    }

    public EntityMessage() {

    }
}
