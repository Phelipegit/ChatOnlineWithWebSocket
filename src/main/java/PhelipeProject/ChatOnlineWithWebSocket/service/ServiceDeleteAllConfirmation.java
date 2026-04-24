package PhelipeProject.ChatOnlineWithWebSocket.service;

import PhelipeProject.ChatOnlineWithWebSocket.model.ConfirmationRequest;
import PhelipeProject.ChatOnlineWithWebSocket.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ServiceDeleteAllConfirmation {

    private final MessageRepository repository;

    public ServiceDeleteAllConfirmation(MessageRepository repository) {
        this.repository = repository;
    }

    @Value("${confirmation}")
    private String confirmation;

    public void deletarAll(ConfirmationRequest request) {
        if(verificarConfirmacao(request.getConfirmation())) {
            repository.deleteAll();
        }
    }

    public boolean verificarConfirmacao(String confirmationUser) {
        return confirmationUser.equals(this.confirmation);
    }
}
