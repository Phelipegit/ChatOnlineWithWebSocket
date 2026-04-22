package PhelipeProject.ChatOnlineWithWebSocket.model;


import lombok.Getter;

@Getter
public class MessageRequest {

    private String message;

    public MessageRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
