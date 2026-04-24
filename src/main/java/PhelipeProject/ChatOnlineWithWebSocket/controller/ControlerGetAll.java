package PhelipeProject.ChatOnlineWithWebSocket.controller;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://phelipeprojectchat-tau.vercel.app/")
public class ControlerGetAll {

    private final MessageRepository messageRepository;

    public ControlerGetAll(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/messages")
    public List<EntityMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    @GetMapping("/deletartudo")
    public void deletarTudo() {
        messageRepository.deleteAll();
    }
}
