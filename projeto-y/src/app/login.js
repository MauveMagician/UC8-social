import styles from "./login.module.css";
import { useState } from "react";
import CriarConta from "@/app/criarConta";

export default function Login({ setRenderLog }) {
  const [account, setAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha, nome }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Bem-vindo");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {account ? <CriarConta setAccount={setAccount} /> : <></>}
      <div className={styles.container}>
        <div className={styles.pato}>
          <img src="/pato.svg"></img>
        </div>
        <div className={styles.close}>
          <button className={styles.fechar} onClick={() => setRenderLog(false)}>
            <img src="/closebutton.svg"></img>
          </button>
        </div>
        <form onSubmit={handleSignUp} className={styles.containerfilho}>
          <p>Email de usuário</p>
          <input
            type="email"
            placeholder="Digite seu email"
            className={styles.input1}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>Senha</p>
          <input
            type="password"
            placeholder="Digite sua senha"
            className={styles.input2}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div className={styles.botao}>
            <button type="submit" className={styles.entrarbutton}>
              Entrar
            </button>
          </div>
        </form>
        <div className={styles.cadastro}>
          Não tem uma conta?
          <span
            className={styles.conta}
            onClick={() => {
              setAccount(true);
            }}
          >
            Criar uma
          </span>
        </div>
      </div>
    </>
  );
}
