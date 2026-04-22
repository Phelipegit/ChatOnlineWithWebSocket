package PhelipeProject.ChatOnlineWithWebSocket.controller;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.model.MessageResponse;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ControlerGetAll {

    private final MessageRepository messageRepository;

    public ControlerGetAll(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/messages")
    public List<EntityMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    @DeleteMapping("/deletarall")
    public void deletarMensagens() {
        messageRepository.deleteAll();
    }
}
