import { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = "http://localhost:8080";
const WS_URL = `${BASE_URL}/chat`;
const TOPIC = "/topic/chat";
const DESTINATION = "/app/mensagem";

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return "";
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function Message({ text, time, isMine }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isMine ? "flex-end" : "flex-start",
      maxWidth: "72%",
      alignSelf: isMine ? "flex-end" : "flex-start",
    }}>
      <div style={{
        padding: "9px 13px",
        borderRadius: 16,
        borderBottomRightRadius: isMine ? 4 : 16,
        borderBottomLeftRadius: isMine ? 16 : 4,
        fontSize: 14,
        lineHeight: 1.5,
        background: isMine ? "#B5D4F4" : "var(--color-background-secondary)",
        color: isMine ? "#042C53" : "var(--color-text-primary)",
        wordBreak: "break-word",
      }}>
        {text}
      </div>
      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3, padding: "0 2px" }}>
        {time}
      </span>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("conectando...");
  const [connected, setConnected] = useState(false);
  const stompRef = useRef(null);
  const bottomRef = useRef(null);
  const idRef = useRef(0);
  const pendingRef = useRef(null);

  const addMessage = useCallback((text, time, isMine) => {
    setMessages(prev => [...prev, { id: idRef.current++, text, time, isMine }]);
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/api/messages`)
      .then(r => r.json())
      .then(data => {
        const history = data.map(m => ({
          id: idRef.current++,
          text: m.message,
          time: formatTime(m.localDateTime),
          isMine: false,
        }));
        setMessages(history);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      onConnect: () => {
        setConnected(true);
        setStatus("conectado");
        client.subscribe(TOPIC, (msg) => {
          const body = JSON.parse(msg.body);

          if (pendingRef.current) {
            addMessage(pendingRef.current.text, pendingRef.current.time, true);
            pendingRef.current = null;
          } else {
            addMessage(body.message, formatTime(body.localDateTime), false);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
        setStatus("sem conexão");
      },
      onStompError: () => {
        setConnected(false);
        setStatus("erro na conexão");
      },
    });

    client.activate();
    stompRef.current = client;

    return () => { client.deactivate(); };
  }, [addMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || !connected) return;

    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    pendingRef.current = { text, time };

    stompRef.current.publish({
      destination: DESTINATION,
      body: JSON.stringify({ message: text }),
    });

    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      maxHeight: 600,
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        padding: "14px 20px",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: connected ? "#3B6D11" : "#E24B4A",
          transition: "background 0.3s",
        }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Chat Geral
        </span>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>
          {status}
        </span>
      </div>

      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {messages.length === 0 && (
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 20 }}>
            Nenhuma mensagem ainda
          </span>
        )}
        {messages.map(m => (
          <Message key={m.id} text={m.text} time={m.time} isMine={m.isMine} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: "12px 16px",
        borderTop: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={connected ? "Digite sua mensagem..." : "Aguardando conexão..."}
          disabled={!connected}
          maxLength={300}
          style={{
            flex: 1,
            padding: "9px 14px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 20,
            fontSize: 14,
            background: "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
            outline: "none",
            fontFamily: "var(--font-sans)",
            opacity: connected ? 1 : 0.5,
          }}
        />
        <button
          onClick={send}
          disabled={!connected}
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: connected ? "#378ADD" : "#B4B2A9",
            border: "none",
            cursor: connected ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.3s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}