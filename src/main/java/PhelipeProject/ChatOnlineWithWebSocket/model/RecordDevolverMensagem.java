package PhelipeProject.ChatOnlineWithWebSocket.model;

import java.time.LocalDateTime;

public record RecordDevolverMensagem(LocalDateTime localDateTime, String message, String usuario) {
}
