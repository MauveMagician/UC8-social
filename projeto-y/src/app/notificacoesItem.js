import styles from "./notificacoesItem.module.css";

export default function NotificacoesItem() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.notificacao}>
          <div className={styles.imagem}>
            <img src="/perfil.jpeg" alt="Foto de perfil do usuário" />
          </div>
          Bom dia!
        </div>
      </div>
    </>
  );
}
