import styles from "./login.module.css";
import { useState } from "react";
import CriarConta from "@/app/criarConta";
import { useRouter } from "next/router";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function Login({ setRenderLog }) {
  const { dark, setDark } = useDarkMode();
  const [account, setAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Bem-vindo");
        window.location.reload();
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
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <div className={styles.pato}>
          <img src={dark ? "/pato-dark.svg" : "/pato.svg"}></img>
        </div>
        <div className={styles.close}>
          <button className={styles.fechar} onClick={() => setRenderLog(false)}>
            <img
              src={dark ? "/closebutton-dark.svg" : "/closebutton.svg"}
            ></img>
          </button>
        </div>
        <form onSubmit={handleSignUp} className={styles.containerfilho}>
          <p className={`${dark ? styles.lightfont : ""}`}>Email de usuário</p>
          <input
            type="email"
            placeholder="Digite seu email"
            className={`${styles.input1} ${dark ? styles.darkinput : ""}`}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className={`${dark ? styles.lightpassword : ""}`}>Senha</p>
          <input
            type="password"
            placeholder="Digite sua senha"
            className={`${styles.input1} ${dark ? styles.darkinput : ""}`}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div className={styles.botao}>
            <button
              type="submit"
              className={`${styles.entrarbutton} ${
                dark ? styles.whitebutton : ""
              }`}
            >
              Entrar
            </button>
          </div>
        </form>
        <div
          className={`${styles.cadastro} ${dark ? styles.lightaccount : ""}`}
        >
          Não tem uma conta?
          <span
            className={`${dark ? styles.lightcreate : styles.conta}`}
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
