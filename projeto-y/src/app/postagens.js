"use client";
import Image from "next/image";
import styles from "./postagens.module.css";

export default function Postagem() {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <div className={styles.bolapai}>
          <div className={styles.bola}></div>
        </div>
      </div>
      <div className={styles.perfil}>
        <div className={styles.name}>
          <div className={styles.nomedousuario}>eminen</div>
          <div className={styles.arrobausuario}>@eminen</div>
        </div>
        <div className={styles.points}>
          <img
            className={styles.img}
            src="/ellipsis-svgrepo-com.svg"
            alt="Salvar"
          />
        </div>
      </div>
      <div className={styles.Mensagem}>
        Descubra a beleza das pequenas coisas do dia a dia. Um sorriso, uma
        flor, ou um pôr do sol podem transformar o seu momento
      </div>
      <div className={styles.interaction}>
        <div className={styles.svg}>
          <img
            className={styles.img}
            src="/retweet-svgrepo-com.svg"
            alt="Republicar"
          />
        </div>
        <div className={styles.svg}>
          <img
            className={styles.img}
            src="/heart-like-svgrepo-com (1).svg"
            alt="Gostei"
          />
        </div>
      </div>
    </div>
  );
}
