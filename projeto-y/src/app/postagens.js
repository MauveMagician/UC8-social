import Image from "next/image";
import styles from "./postagens.module.css";

export default function Postagem() {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <div className={styles.bola}></div>
      </div>
      <div className={styles.container2}>
        <div className={styles.perfil}>
          <div className={styles.name}>
            <div className={styles.nomedousuario}></div>
            <div className={styles.arrobausuario}></div>
          </div>
          <div className={styles.seguir}>
            <p className={styles.p}>seguir</p>
          </div>
        </div>
        <div className={styles.Mensagem}></div>
        <div className={styles.interaction}></div>
      </div>
    </div>
  );
}
