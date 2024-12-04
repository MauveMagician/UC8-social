import styles from "./notificacoes.module.css";
import { useState, useEffect } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import NotificacoesItem from "./notificacoesItem";
import Link from "next/link";

export default function Notificacoes() {
  const { darkMode } = useDarkMode();
  const [notifications, setNotifications] = useState([]);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    fetch("/api/data/notifications")
      .then((response) => response.json())
      .then((data) => {
        const formattedNotifications = data.map((notification) => ({
          ...notification,
          userName: notification.actor_name,
        }));
        setNotifications(formattedNotifications);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleNotificationClick = (id) => {
    const updateNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, fadeOut: true } : notification
    );
    setNotifications(updateNotifications);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }, 300);
  };

  const handleClearAll = () => {
    setClearingAll(true);
    setTimeout(() => {
      setNotifications([]);
      setClearingAll(false);
    }, 500);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notificações</h2>
      {notifications.length > 0 ? (
        <>
          <button
            className={`${styles.clearbutton} ${
              darkMode ? styles.darkbutton : ""
            }`}
            onClick={handleClearAll}
          >
            Limpar notificações
          </button>
          <div
            className={`${styles.notificationlist} ${
              clearingAll ? styles.clearingAll : ""
            }`}
          >
            {notifications.map((notification) => (
              <Link
                style={{ textDecoration: "none" }}
                href={`/posts/${notification.postId}`}
                key={notification.notification_id}
              >
                <div
                  className={`${styles.notificationitem} ${
                    notification.fadeOut ? styles.fadeout : true
                  } : notification`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <NotificacoesItem
                    userImage={notification.userImage}
                    userName={notification.userName}
                    content={notification.message}
                    timestamp={notification.create_at}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className={styles.nonotifications}>Não há notificações.</p>
      )}
    </div>
  );
}
