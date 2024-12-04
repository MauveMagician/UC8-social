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
          postId: notification.post_id,
          notificationId: notification.notification_id,
        }));
        setNotifications(formattedNotifications);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      const response = await fetch(`/api/data/notification/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear notification");
      }
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch("/api/data/clear_notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear notifications");
      }

      setClearingAll(true);
      setTimeout(() => {
        setNotifications([]);
        setClearingAll(false);
      }, 500);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      // Optionally, you can add error handling UI here
    }
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
                href={""}
                key={notification.notification_id}
                onClick={async (e) => {
                  e.preventDefault(); // Prevent immediate navigation
                  await handleNotificationClick(notification.notificationId);
                  // Navigate after a short delay to allow the notification to be marked as read
                  setTimeout(() => {
                    window.location.href = `/posts/${notification.postId}`;
                  }, 300);
                }}
              >
                <div
                  className={`${styles.notificationitem} ${
                    notification.fadeOut ? styles.fadeout : ""
                  }`}
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
