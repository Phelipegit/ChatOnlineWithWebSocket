package PhelipeProject.ChatOnlineWithWebSocket.controller;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.model.ConfirmationRequest;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import PhelipeProject.ChatOnlineWithWebSocket.service.ServiceDeleteAllConfirmation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://phelipeprojectchat-tau.vercel.app/")
public class ControlerGetAll {

    private final MessageRepository messageRepository;
    private final ServiceDeleteAllConfirmation serviceDeleteAllConfirmation;

    public ControlerGetAll(MessageRepository messageRepository,
                           ServiceDeleteAllConfirmation serviceDeleteAllConfirmation) {
        this.messageRepository = messageRepository;
        this.serviceDeleteAllConfirmation = serviceDeleteAllConfirmation;
    }

    @GetMapping("/messages")
    public List<EntityMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    @DeleteMapping("/deletartudo")
    public void deletarTudo(@RequestBody ConfirmationRequest confirmationRequest) {
        serviceDeleteAllConfirmation.deletarAll(confirmationRequest);
    }
}
