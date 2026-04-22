package PhelipeProject.ChatOnlineWithWebSocket.model;

import lombok.Getter;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalTime;

@Getter
public class MessageResponse {

    private Boolean success;

    private String message;

    private LocalTime localTime;

    public MessageResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.localTime = LocalTime.now();
    }
}
