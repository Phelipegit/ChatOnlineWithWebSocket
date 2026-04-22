import { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = "https://chatonlinewithwebsocket.onrender.com";
const WS_URL = `${BASE_URL}/chat`;
const TOPIC = "/topic/chat";
const DESTINATION = "/app/mensagem";

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return "";
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function NameModal({ onConfirm }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      borderRadius: "var(--border-radius-lg)",
    }}>
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 16,
        padding: "28px 28px 24px",
        width: 280,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
            Bem-vindo ao Chat 👋
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--color-text-tertiary)", fontFamily: "var(--font-sans)" }}>
            Como quer ser chamado?
          </p>
        </div>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Seu nome..."
          maxLength={30}
          style={{
            padding: "9px 14px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 10,
            fontSize: 14,
            background: "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
            outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
        <button
          onClick={handleConfirm}
          disabled={!value.trim()}
          style={{
            padding: "10px",
            borderRadius: 10,
            border: "none",
            background: value.trim() ? "#378ADD" : "#B4B2A9",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: value.trim() ? "pointer" : "not-allowed",
            fontFamily: "var(--font-sans)",
            transition: "background 0.2s",
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

function Message({ text, time, isMine, sender }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isMine ? "flex-end" : "flex-start",
      maxWidth: "72%",
      alignSelf: isMine ? "flex-end" : "flex-start",
    }}>
      {!isMine && sender && (
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          marginBottom: 3,
          paddingLeft: 2,
          fontFamily: "var(--font-sans)",
        }}>
          {sender}
        </span>
      )}
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
  const [nome, setNome] = useState(() => localStorage.getItem("chat_nome") || "");
  const [showModal, setShowModal] = useState(() => !localStorage.getItem("chat_nome"));
  const stompRef = useRef(null);
  const bottomRef = useRef(null);
  const idRef = useRef(0);
  const pendingRef = useRef(null);
  const nomeRef = useRef(localStorage.getItem("chat_nome") || "");

  const addMessage = useCallback((text, time, isMine, sender) => {
    setMessages(prev => [...prev, { id: idRef.current++, text, time, isMine, sender }]);
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/api/messages`)
      .then(r => r.json())
      .then(data => {
        const history = data.map(m => {
          const isMine = m.usuario === nomeRef.current;
          return {
            id: idRef.current++,
            text: m.message,
            time: formatTime(m.localDateTime),
            isMine,
            sender: isMine ? null : (m.usuario || null),
          };
        });
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
            addMessage(pendingRef.current.text, formatTime(body.localDateTime), true, null);
            pendingRef.current = null;
          } else {
            addMessage(body.message, formatTime(body.localDateTime), false, body.usuario || null);
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

  const handleNameConfirm = (name) => {
    localStorage.setItem("chat_nome", name);
    nomeRef.current = name;
    setNome(name);
    setShowModal(false);
  };

  const send = () => {
    const text = input.trim();
    if (!text || !connected) return;

    pendingRef.current = { text };

    stompRef.current.publish({
      destination: DESTINATION,
      body: JSON.stringify({ message: text, usuario: nomeRef.current }),
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
      position: "relative",
    }}>
      {showModal && <NameModal onConfirm={handleNameConfirm} />}

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
        {nome && (
          <button
            onClick={() => setShowModal(true)}
            title="Trocar nome"
            style={{
              marginLeft: 6,
              fontSize: 12,
              color: "var(--color-text-tertiary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 6,
              fontFamily: "var(--font-sans)",
            }}
          >
            {nome} ✏️
          </button>
        )}
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
          <Message key={m.id} text={m.text} time={m.time} isMine={m.isMine} sender={m.sender} />
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
