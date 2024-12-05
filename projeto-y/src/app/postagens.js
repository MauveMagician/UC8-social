"use client";
import Image from "next/image";
import styles from "./postagens.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";
import FotoPerfil from "./fotoperfil";
import { useEffect, useState } from "react";

export default function Postagem({ post_id }) {
  const { dark, setDark } = useDarkMode();
  const [content, setContent] = useState("");
  const [user_id, setUserId] = useState("");
  const [user_name, setUserName] = useState("");
  const [user_arroba, setUserArroba] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data/post?post_id=${post_id}`);
        const data = await response.json();
        console.log("Dados completos recebidos da API:", data);

        setContent(data.Content);
        setUserId(data.user_id);
        setUserName(data.username);

        if (data.arroba) {
          console.log("Arroba encontrado:", data.arroba);
          setUserArroba(data.arroba);
        } else {
          console.log("Arroba não encontrado, usando username como fallback");
          setUserArroba(data.username);
        }

        console.log("Estados atualizados:");
        console.log("user_id:", data.user_id);
        console.log("user_name:", data.username);
        console.log("user_arroba:", data.arroba || data.username);
      } catch (error) {
        console.error("Erro ao buscar dados do post:", error);
      }
    };
    fetchData();
  }, [post_id]);

  const [like, setLike] = useState(false);
  const [requack, setRequack] = useState(false);
  useEffect(() => {
    const fetchLikeData = async () => {
      //Determinar se o post possui um like, retweet pelo usuário ou não
      const response = await fetch(`/api/data/likes-rqs?post_id=${post_id}`);
      if (response.ok) {
        //Transformar a resposta em JSON
        const likeData = await response.json();
        //Se likeData tem um like_id, significa que o post possui um like pelo usuário
        if (likeData.like_id) {
          setLike(true);
        }
        // Se likeData tem um requack_id, significa que o post possui um requack pelo usuário
        if (likeData.requack_id) {
          setRequack(true);
        }
      }
    };
    fetchLikeData();
  }, []);
  const handleLike = async () => {
    // Adicionar ou remover o like
    const response = await fetch(`/api/data/likes?post_id=${post_id}`);
    if (response.ok) {
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
        <FotoPerfil user_id={user_id} className={styles.foto} />
      </div>
      <div className={styles.perfil}>
        <div className={styles.name}>
          <div className={styles.nomedousuario}>
            <span className={dark ? styles.username : ""}>{user_name}</span>
          </div>
          <div className={styles.arrobausuario}>
            <span className={dark ? styles.arroba : ""}>
              @{user_arroba || user_name}
            </span>
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
      <div className={styles.Mensagem}>{content}</div>
      <div className={styles.interaction}>
        <div className={styles.svg}>
          <img
            className={styles.img}
            src={
              requack
                ? dark
                  ? "/retweet-filled.svg"
                  : "/retweet-filled-light.svg"
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
                ? dark
                  ? "/heart-filled.svg"
                  : "/heart-filled-light.svg"
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
