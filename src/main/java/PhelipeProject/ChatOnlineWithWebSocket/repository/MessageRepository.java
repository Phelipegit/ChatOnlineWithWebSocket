package PhelipeProject.ChatOnlineWithWebSocket.repository;

import PhelipeProject.ChatOnlineWithWebSocket.entity.EntityMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<EntityMessage,UUID> {
}
