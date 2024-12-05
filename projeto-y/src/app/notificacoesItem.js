import styles from "./notificacoesItem.module.css";
import { useDarkMode } from "./context/DarkModeContext";

export default function NotificacoesItem({
  userImage,
  userName,
  action,
  content,
  timestamp,
}) {
  const { dark } = useDarkMode();
  return (
    <div className={styles.container}>
      <div
        className={`${styles.notificacao} ${
          dark ? styles.darknotificacao : ""
        }`}
      >
        <div className={styles.imagem}>
          <img
            src={userImage || "/perfil.jpeg"}
            alt={`Foto de perfil de ${userName}`}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.message}>
            <strong>{userName}</strong> {action} {content}
          </p>
          <span className={styles.timestamp}>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
