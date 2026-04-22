package PhelipeProject.ChatOnlineWithWebSocket.service;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.model.MessageRequest;
import PhelipeProject.ChatOnlineWithWebSocket.model.MessageResponse;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }


    public MessageResponse enviarMensagem(MessageRequest messageRequest) {

        if(messageRequest.getMessage().isEmpty()) {
            return new MessageResponse(false,"Mensagem vazia não é permitida");
        }

        if(messageRequest.getMessage().length() > 200) {
            return new MessageResponse(false, "Mensagem muito grande");
        }

        EntityMessage entityMessage = new EntityMessage(messageRequest.getUsuario(),messageRequest.getMessage());

        messageRepository.save(entityMessage);

        return new MessageResponse(true, messageRequest.getMessage());
    }
}
