package PhelipeProject.ChatOnlineWithWebSocket.service;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import PhelipeProject.ChatOnlineWithWebSocket.exceptions.ExceptionMensagemGrande;
import PhelipeProject.ChatOnlineWithWebSocket.exceptions.ExceptionMensagemVazia;
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
            throw new ExceptionMensagemVazia();
        }

        if(messageRequest.getMessage().length() > 200) {
            throw new ExceptionMensagemGrande();
        }

        EntityMessage entityMessage = new EntityMessage(messageRequest.getUsuario(),messageRequest.getMessage());

        messageRepository.save(entityMessage);

        return new MessageResponse(true,messageRequest.getUsuario(), messageRequest.getMessage());
    }
}
