package PhelipeProject.ChatOnlineWithWebSocket.exceptions;

public class ExceptionMensagemGrande extends RuntimeException {
    public ExceptionMensagemGrande() {
        super("Mensagem muito grande");
    }
}
