/*postUsuario é um componente que exibe as postagens
de um usuário em seu perfil*/

import { useEffect } from "react";

export default function PostUsuario({ user_id }) {
  //Criar um array vazio para armazenar as postagens
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //Fazer a requisição dos posts de uma pessoa para o servidor e salvar em um array
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
