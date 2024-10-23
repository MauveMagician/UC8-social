/*postUsuario é um componente que exibe as postagens
de um usuário em seu perfil*/

import { useEffect, useState } from "react";
import Postagem from "./postagens"; //Componente Postagem

export default function PostUsuario({ user_id }) {
  //Criar um array vazio para armazenar as postagens
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //Fazer a requisição dos posts de uma pessoa para o servidor e salvar em um array
    fetch(`/api/data/posts?user_id=${user_id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  //Exibir as postagens na tela
  return (
    <div>
      {posts.map((post) => (
        <Postagem />
      ))}
    </div>
  );
}
