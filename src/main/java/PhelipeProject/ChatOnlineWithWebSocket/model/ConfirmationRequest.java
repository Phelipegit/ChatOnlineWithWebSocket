package PhelipeProject.ChatOnlineWithWebSocket.model;

import lombok.Getter;

@Getter
public class ConfirmationRequest {

    private String confirmation;

    public String getConfirmation() {
        return this.confirmation;
    }
}
