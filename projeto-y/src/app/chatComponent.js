import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "./chatComponent.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const { dark } = useDarkMode();

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("chat message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...msg, isSent: msg.id === newSocket.id },
      ]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setError("Failed to connect to the chat server. Please try again later.");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      setError("An error occurred with the chat connection.");
    });

    setSocket(newSocket);
    document.body.style.overflow = "hidden";
    return () => {
      newSocket.close();
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && inputMessage.trim()) {
      const message = { id: socket.id, message: inputMessage };
      socket.emit("chat message", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, isSent: true },
      ]);
      setInputMessage("");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (socket) {
      socket.close();
    }
    document.body.style.overflow = "auto";
  };

  if (!isVisible) {
    return null;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!isConnected) {
    return <div className={styles.loading}>Connecting to chat server...</div>;
  }

  return (
    <div className={`${styles.chatcontainer} ${dark ? styles.dark : ""}`}>
      <div className={styles.chatheader}>
        <span className={styles.chatTitle}>Quacker</span>
        <button className={styles.closeButton} onClick={handleClose}>
          <img
            src={dark ? "/closebutton-dark.svg" : "/closebutton.svg"}
            alt="Close"
            className={styles.closeIcon}
          />
        </button>
      </div>
      <div className={styles.chatmessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${
              msg.isSent ? styles.sentWrapper : styles.receivedWrapper
            }`}
          >
            <div
              className={`${styles.message} ${
                msg.isSent ? styles.sent : styles.received
              }`}
            >
              <span className={styles.messageid}>{msg.id.slice(0, 4)}:</span>
              <span className={styles.messagetext}>{msg.message}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className={styles.chatform}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className={styles.chattextarea}
          placeholder="Digite sua mensagem..."
          rows="2"
        />
        <button type="submit" className={styles.sendbutton}>
          Enviar
        </button>
      </form>
    </div>
  );
}
