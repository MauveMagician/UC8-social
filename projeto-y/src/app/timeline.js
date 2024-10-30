"use client";
import Postagem from "./postagens";
import styles from "./timeline.module.css";
import Conta from "./conta";
import { useState, useEffect } from "react";

export default function Timeline({ user_id }) {
  //Criar um array vazio para armazenar as postagens
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //Fazer a requisição dos posts de uma pessoa para o servidor e salvar em um array
    fetch(`/api/data/my_posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  //Exibir as postagens na tela
  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <Postagem key={post.post_id} post_id={post.post_id} />
      ))}
    </div>
  );
}
