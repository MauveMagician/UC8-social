import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "./chatComponent.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";
import { fetchUserInfo } from "./userinfo";

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const { dark } = useDarkMode();
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        await fetch("/api/socket");
        const newSocket = io();

        newSocket.on("connect", () => {
          console.log("Connected to server");
          setIsConnected(true);
        });

        newSocket.on("chat message", (msg) => {
          setMessages((prevMessages) => {
            if (!prevMessages.some((m) => m.id === msg.id)) {
              return [...prevMessages, msg];
            }
            return prevMessages;
          });
        });

        newSocket.on("online users", (users) => {
          setOnlineUsers(users);
        });

        newSocket.on("mention", (notification) => {
          setNotifications((prev) => [...prev, notification]);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error("Socket initialization error:", error);
        setError("Failed to connect to chat server");
      }
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [username]);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const userInfo = await fetchUserInfo();
        const userName = userInfo.nome || userInfo.arroba || "Anonymous";
        setUsername(userName);
        if (socket) {
          socket.emit("set username", userName);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUsername("Anonymous");
      }
    }
    getUserInfo();
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && inputMessage.trim()) {
      const mentionRegex = /@(\w+)/g;
      const mentions = [...new Set(inputMessage.match(mentionRegex) || [])];
      const mentionedUsers = mentions.map((mention) => mention.slice(1));

      const message = {
        id: Date.now(),
        message: inputMessage,
        username: username,
        mentions: mentionedUsers,
      };
      socket.emit("chat message", message);
      setInputMessage("");
      // Don't add the message to the state here, let the server echo it back
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (socket) {
      socket.disconnect();
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
        <span className={styles.chatTitle}>Quacker - {username}</span>
        <button className={styles.closeButton} onClick={handleClose}>
          <img
            src={dark ? "/closebutton-dark.svg" : "/closebutton.svg"}
            alt="Close"
            className={styles.closeIcon}
          />
        </button>
      </div>
      {notifications.length > 0 && (
        <div className={styles.notifications}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.notification}>
              <strong>{notification.fromUser}</strong> mentioned you ({username}
              ): {notification.message}
            </div>
          ))}
        </div>
      )}
      <div className={styles.chatmessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageWrapper} ${
              msg.username === username
                ? styles.sentWrapper
                : styles.receivedWrapper
            }`}
          >
            <div
              className={`${styles.message} ${
                msg.username === username ? styles.sent : styles.received
              }`}
            >
              <span className={styles.messageid}>
                {msg.username || msg.id.slice(0, 4)}:
              </span>
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
