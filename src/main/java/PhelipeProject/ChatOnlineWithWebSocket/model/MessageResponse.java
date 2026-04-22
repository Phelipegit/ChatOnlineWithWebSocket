package PhelipeProject.ChatOnlineWithWebSocket.model;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Getter
public class MessageResponse {

    private Boolean success;

    private String message;

    private LocalDateTime localDateTime;

    public MessageResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.localDateTime = LocalDateTime.now(ZoneId.of("America/Campo_Grande"));
    }
}
