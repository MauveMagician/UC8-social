import styles from "./notificacoesItem.module.css";

export default function NotificacoesItem({
  userImage,
  userName,
  action,
  content,
  timestamp,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.notificacao}>
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
