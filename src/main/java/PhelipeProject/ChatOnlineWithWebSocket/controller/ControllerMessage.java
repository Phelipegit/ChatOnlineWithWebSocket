package PhelipeProject.ChatOnlineWithWebSocket.controller;

import PhelipeProject.ChatOnlineWithWebSocket.model.MessageRequest;
import PhelipeProject.ChatOnlineWithWebSocket.model.MessageResponse;
import PhelipeProject.ChatOnlineWithWebSocket.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerMessage {

    private final MessageService messageService;

    public ControllerMessage(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/mensagem")
    @SendTo("/topic/chat")
    public MessageResponse enviarMensagem(MessageRequest messageRequest) {
        return messageService.enviarMensagem(messageRequest);
    }
}
