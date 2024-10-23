"use client";
import Image from "next/image";
import styles from "./postagens.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";
import FotoPerfil from "./fotoperfil";
import { useState } from "react";

export default function Postagem({ post_id }) {
  const { dark } = useDarkMode();
  const [like, setLike] = useState(false);
  const [requack, setRequack] = useState(false);
  const handleLike = async () => {
    // Adicionar ou remover o like
    const response = await fetch(`/api/data/likes?post_id=${post_id}`);
    if (response.ok) {
      console.log("Like added or removed");
      setLike(!like);
    }
  };
  const handleRequack = async () => {
    try {
      const response = await fetch(`/api/data/requacks?post_id=${post_id}`);
      if (response.ok) {
        // Atualizar o número de requacks na interface
        setRequack(!requack);
      }
    } catch (error) {
      console.error("Error requacking the post:", error);
    }
  };
  return (
    <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
      <div className={styles.avatar}>
        <FotoPerfil user_id={1} className={styles.foto} />
      </div>
      <div className={styles.perfil}>
        <div className={styles.name}>
          <div className={styles.nomedousuario}>
            <span className={dark ? styles.username : ""}>eminen</span>
          </div>
          <div className={styles.arrobausuario}>
            <span className={dark ? styles.arroba : ""}>@eminen</span>
          </div>
        </div>
        <div className={styles.points}>
          <img
            className={styles.img}
            src={dark ? "/ellipsis-dark.svg" : "/ellipsis-svgrepo-com.svg"}
            alt="Salvar"
          />
        </div>
      </div>
      <div className={`${styles.Mensagem} ${dark ? styles.dark2 : ""}`}>
        Descubra a beleza das pequenas coisas do dia a dia. Um sorriso, uma
        flor, ou um pôr do sol podem transformar o seu momento
      </div>
      <div className={styles.interaction}>
        <div className={styles.svg}>
          <img
            className={styles.img}
            src={
              requack
                ? "/retweet-filled.svg"
                : dark
                ? "/retweet-dark.svg"
                : "/retweet-svgrepo-com.svg"
            }
            alt="Republicar"
            onClick={handleRequack}
          />
        </div>
        <div className={styles.svg}>
          <img
            className={styles.img}
            src={
              like
                ? "/heart-filled.svg"
                : dark
                ? "/heart-like-dark.svg"
                : "/heart-like-svgrepo-com (1).svg"
            }
            alt="Gostei"
            onClick={handleLike}
          />
        </div>
      </div>
    </div>
  );
}
