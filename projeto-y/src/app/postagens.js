"use client";
import Image from "next/image";
import styles from "./postagens.module.css";
import FotoPerfil from "./fotoperfil";
import { useEffect, useState } from "react";

export default function Postagem({ post_id }) {
  const [content, setContent] = useState("");
  const [user_id, setUserId] = useState("");
  const [user_name, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Puxar do banco de dados os dados da postagem
        const response = await fetch(`/api/data/post?post_id=${post_id}`);
        const data = await response.json();
        console.log(data);
        //Parsear o json com os dados e usar os setters dos useStates para trocar os elementos do componente
        setContent(data.Content);
        setUserId(data.user_id);
        setUserName(data.username);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchData();
  }, [user_id]);
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <FotoPerfil user_id={user_id} className={styles.foto} />
      </div>
      <div className={styles.perfil}>
        <div className={styles.name}>
          <div className={styles.nomedousuario}>{user_name}</div>
          <div className={styles.arrobausuario}>@user</div>
        </div>
        <div className={styles.points}>
          <img
            className={styles.img}
            src="/ellipsis-svgrepo-com.svg"
            alt="Salvar"
          />
        </div>
      </div>
      <div className={styles.Mensagem}>{content}</div>
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
