package PhelipeProject.ChatOnlineWithWebSocket.model;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class MessageRequest {

    @NotBlank
    @Size(max = 20)
    private String usuario;

    @NotBlank
    private String message;

    public MessageRequest(String usuario,String message) {
        this.usuario = usuario;
        this.message = message;
    }

    public String getUsuario() {
        return this.usuario;
    }

    public String getMessage() {
        return this.message;
    }
}
