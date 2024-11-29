import styles from "./notificacoesItem.module.css";
import { useDarkMode } from "./context/DarkModeContext";

export default function NotificacoesItem() {
  const { dark, setDark } = useDarkMode();
  return (
    <>
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
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
