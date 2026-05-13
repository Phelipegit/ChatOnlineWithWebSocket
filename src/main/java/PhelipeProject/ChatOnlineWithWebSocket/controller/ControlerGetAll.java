package PhelipeProject.ChatOnlineWithWebSocket.controller;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.model.ConfirmationRequest;
import PhelipeProject.ChatOnlineWithWebSocket.model.RecordDevolverMensagem;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import PhelipeProject.ChatOnlineWithWebSocket.service.ServiceDeleteAllConfirmation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://phelipeprojectchat-tau.vercel.app",methods = {RequestMethod.GET,RequestMethod.DELETE})
public class ControlerGetAll {

    private final MessageRepository messageRepository;
    private final ServiceDeleteAllConfirmation serviceDeleteAllConfirmation;

    public ControlerGetAll(MessageRepository messageRepository,
                           ServiceDeleteAllConfirmation serviceDeleteAllConfirmation) {
        this.messageRepository = messageRepository;
        this.serviceDeleteAllConfirmation = serviceDeleteAllConfirmation;
    }

    @GetMapping("/messages")
    public List<RecordDevolverMensagem> getAllMessages() {
        return messageRepository.findAll().stream().map(message -> new RecordDevolverMensagem(message.getLocalDateTime(),message.getMessage(),message.getUsuario())).toList();
    }

    @DeleteMapping("/deletartudo")
    public void deletarTudo(@RequestBody ConfirmationRequest confirmationRequest) {
        serviceDeleteAllConfirmation.deletarAll(confirmationRequest);
    }
}
