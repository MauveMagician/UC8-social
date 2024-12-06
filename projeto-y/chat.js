import { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "./chat.module.css";

let socket;

export default function Chat({ onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        console.log("Initializing socket...");
        await fetch("/api/socket");
        socket = io();

        socket.on("connect", () => {
          console.log("Connected to server");
        });

        socket.on("connect_error", (err) => {
          console.error("Connection error:", err);
          setError("Failed to connect to the chat server.");
        });

        socket.on("chat message", (msg) => {
          console.log("Received message:", msg);
          setMessages((prevMessages) => [...prevMessages, msg]);
        });
      } catch (err) {
        console.error("Error initializing socket:", err);
        setError("Failed to initialize chat. Please try again later.");
      }
    };

    socketInitializer();

    return () => {
      if (socket) {
        console.log("Disconnecting socket");
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const chatContent = document.querySelector(`.${styles.chatcontent}`);
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      console.log("Sending message:", message);
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  if (error) {
    return (
      <div className={styles.chatcontainer}>
        <div className={styles.chatheader}>
          <h2>Chat Error</h2>
          <button onClick={onClose}>Fechar</button>
        </div>
        <div className={styles.chaterror}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.chatcontainer}>
      <div className={styles.chatheader}>
        <h2>Chat</h2>
        <button onClick={onClose}>Fechar</button>
      </div>
      <div className={styles.chatcontent}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} className={styles.chatinput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
